import { pool } from "../lib/db.js";

export async function getProducts(page = 1) {
    const limit = 6;
    const offset = (page - 1) * limit;

    const query = `
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.created_at,
    p.is_flash_sale,
    p.is_buy1get1,
    ARRAY_AGG(DISTINCT s.size_name) FILTER (WHERE s.size_name IS NOT NULL) AS sizes,
    p.is_birthday_package,
    AVG(t.rating) AS rating,
    COUNT(p.id) OVER() AS total,
    p.stock AS stock,
    (
        SELECT i.image_path
        FROM product_images pi
        JOIN images i ON i.id = pi.image_id
        WHERE pi.product_id = p.id
        ORDER BY i.id
        LIMIT 1
    ) AS image
FROM products p
LEFT JOIN testimonials t ON t.product_id = p.id
LEFT JOIN product_sizes ps ON ps.product_id = p.id
LEFT JOIN sizes s ON s.id = ps.size_id
GROUP BY 
    p.id, p.name, p.description, p.price, p.created_at,
    p.is_flash_sale, p.is_buy1get1, p.is_birthday_package
ORDER BY p.id
LIMIT $1 OFFSET $2;
`;

    const { rows } = await pool.query(query, [limit, offset]);

    return rows;
}

export async function deleteTransactionProducts(client, productId) {
    await client.query(
        `DELETE FROM transaction_products WHERE product_id = $1`,
        [productId],
    );
}

export async function deleteProductCategories(client, productId) {
    await client.query(`DELETE FROM product_categories WHERE product_id = $1`, [
        productId,
    ]);
}

export async function deleteProductSizes(client, productId) {
    await client.query(`DELETE FROM product_sizes WHERE product_id = $1`, [
        productId,
    ]);
}

export async function deleteProductVariants(client, productId) {
    await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [
        productId,
    ]);
}

export async function deleteProductImages(client, productId) {
    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [
        productId,
    ]);
}

export async function deleteProductTestimonials(client, productId) {
    await client.query(`DELETE FROM testimonials WHERE product_id = $1`, [
        productId,
    ]);
}

export async function deleteProductById(client, productId) {
    await client.query(`DELETE FROM products WHERE id = $1`, [productId]);
}

export async function deleteProduct(productId) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await deleteProductCategories(client, productId);
        await deleteProductSizes(client, productId);
        await deleteProductVariants(client, productId);
        await deleteProductImages(client, productId);
        await deleteProductTestimonials(client, productId);

        await deleteTransactionProducts(client, productId);

        await deleteProductById(client, productId);

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
        // WAJIB: kembalikan connection ke pool
        // kalau tidak di-release:
        // - connection akan "terkunci" (connection leak)
        // - pool bisa kehabisan connection
        // - request lain bisa hang / timeout
        // release ini bikin connection bisa dipakai lagi oleh request lain
    }
}

/**
 * Search products with filters & pagination
 * @param {Object} reqQuery
 * @returns {Promise<{ products: Object[], totalCount: number }>}
 */
export async function searchProducts(reqQuery) {
    let {
        page = 1,
        name,
        q,
        category,
        minPrice,
        maxPrice,
        isFlashSale,
        isBuy1Get1,
        isBirthdayPackage,
        cheap,
        recommended,
    } = reqQuery;

    // support q alias
    name = name || q;

    // --- NORMALIZE ---
    page = parseInt(page);
    if (isNaN(page) || page < 1) page = 1;

    // --- BUILD WHERE ---
    let whereClause = "WHERE 1=1";
    const args = [];
    let i = 1;

    if (name) {
        whereClause += ` AND p.name ILIKE $${i}`;
        args.push(`%${name}%`);
        i++;
    }

    if (category) {
        whereClause += `
        AND EXISTS (
            SELECT 1 FROM product_categories pc2
            JOIN categories c2 ON c2.id = pc2.categories_id
            WHERE pc2.product_id = p.id
            AND c2.categories_name ILIKE $${i}
        )`;
        args.push(`%${category}%`);
        i++;
    }

    const parsedMin = Number(minPrice);
    if (!isNaN(parsedMin) && parsedMin > 0) {
        whereClause += ` AND p.price >= $${i}`;
        args.push(parsedMin);
        i++;
    }

    const parsedMax = Number(maxPrice);
    if (!isNaN(parsedMax) && parsedMax > 0) {
        whereClause += ` AND p.price <= $${i}`;
        args.push(parsedMax);
        i++;
    }

    if (isFlashSale === "true") {
        whereClause += ` AND p.is_flash_sale = true`;
    }

    if (isBuy1Get1 === "true") {
        whereClause += ` AND p.is_buy1get1 = true`;
    }

    if (isBirthdayPackage === "true") {
        whereClause += ` AND p.is_birthday_package = true`;
    }

    if (cheap === "true") {
        whereClause += ` AND p.price <= 20000`;
    }

    if (recommended === "true") {
        whereClause += `
        AND EXISTS (
            SELECT 1
            FROM testimonials t2
            WHERE t2.product_id = p.id
            GROUP BY t2.product_id
            HAVING AVG(t2.rating) >= 4.7
        )`;
    }

    // --- CTE ---
    const cte = `
        WITH filtered_products AS (
            SELECT DISTINCT p.id
            FROM products p
            LEFT JOIN product_categories pc ON pc.product_id = p.id
            LEFT JOIN categories c ON c.id = pc.categories_id
            LEFT JOIN testimonials t ON t.product_id = p.id
            ${whereClause}
        )
    `;

    // --- COUNT QUERY ---
    const countQuery = `${cte} SELECT COUNT(*) FROM filtered_products;`;
    const countRes = await pool.query(countQuery, args);
    const totalCount = Number(countRes.rows[0].count);

    // --- PAGINATION ---
    const limit = 6;
    const offset = (page - 1) * limit;

    // --- DATA QUERY ---
    const dataQuery = `
        ${cte}
        SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.is_flash_sale,
            p.is_buy1get1,
            p.is_birthday_package,
            COALESCE(AVG(t.rating), 0) AS rating,
            ARRAY_AGG(DISTINCT c.categories_name)
                FILTER (WHERE c.id IS NOT NULL) AS categories,
            ARRAY_AGG(DISTINCT img.image_path)
                FILTER (WHERE img.id IS NOT NULL) AS images
        FROM filtered_products fp
        JOIN products p ON p.id = fp.id
        LEFT JOIN testimonials t ON t.product_id = p.id
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        LEFT JOIN categories c ON c.id = pc.categories_id
        LEFT JOIN product_images pi ON pi.product_id = p.id
        LEFT JOIN images img ON img.id = pi.image_id
        GROUP BY p.id
        ORDER BY p.id ASC
        LIMIT $${i} OFFSET $${i + 1};
    `;
    const dataArgs = [...args, limit, offset];
    console.log("ARGS:", args);
    console.log("DATA ARGS:", dataArgs);
    console.log("PAGE:", page);
    console.log("OFFSET:", offset);
    const { rows } = await pool.query(dataQuery, dataArgs);

    // --- SAFETY ---
    const products = rows.map((p) => ({
        ...p,
        categories: p.categories || [],
        images: p.images || [],
    }));
    console.log("FINAL QUERY:", dataQuery);
    return {
        products,
        totalCount,
    };
}

/**
 *
 * @param {number} id
 * @returns {Product}
 */
export async function getDetailProductById(id) {
    const query = `
    SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    AVG(t.rating) AS rating,
    COUNT(t.message) AS total_reviews,
    (
        SELECT ARRAY_AGG(v.variant_name ORDER BY v.id)
        FROM product_variants pv
        JOIN variants v ON v.id = pv.variant_id
        WHERE pv.product_id = p.id
    ) AS variants,
    (
        SELECT ARRAY_AGG(v.additional_price ORDER BY v.id)
        FROM product_variants pv
        JOIN variants v ON v.id = pv.variant_id
        WHERE pv.product_id = p.id
    ) AS variant_prices,
    (
        SELECT ARRAY_AGG(s.size_name ORDER BY s.id)
        FROM product_sizes ps
        JOIN sizes s ON s.id = ps.size_id
        WHERE ps.product_id = p.id
    ) AS sizes,
    (
        SELECT ARRAY_AGG(s.additional_price ORDER BY s.id)
        FROM product_sizes ps
        JOIN sizes s ON s.id = ps.size_id
        WHERE ps.product_id = p.id
    ) AS size_prices,
    (
        SELECT ARRAY_AGG(i.image_path ORDER BY i.id)
        FROM product_images pi
        JOIN images i ON i.id = pi.image_id
        WHERE pi.product_id = p.id
    ) AS images
FROM products p
LEFT JOIN testimonials t ON t.product_id = p.id
WHERE p.id = $1
GROUP BY p.id, p.name, p.price, p.description;
`;

    const data = [id];

    const {
        rows: [result],
    } = await pool.query(query, data);

    return result;
}
