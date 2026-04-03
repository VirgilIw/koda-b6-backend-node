/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} image
 * @property {string} author_title
 * @property {string} message
 * @property {number} rating
 */

import { pool } from "../lib/db.js";

/**
 * Get latest reviews
 * @returns {Product[]}
 */
export async function getReviews() {
    const query = `
    SELECT id, "name", image, author_title, message, rating, created_at, product_id
    FROM testimonials
    ORDER BY created_at DESC
    LIMIT 5;
  `;

    const { rows: result } = await pool.query(query);
    return result;
}

/**
 * Get recommended products
 * @returns {Product[]}
 */
export async function getRecommendedProducts() {
    const query = `SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    AVG(t.rating) AS rating,
    STRING_AGG(t.message, ' , ') AS review_messages,
    (
        SELECT i.image_path
        FROM product_images pi
        JOIN images i ON i.id = pi.image_id
        WHERE pi.product_id = p.id
        LIMIT 1
    ) AS image_path,
    COUNT(DISTINCT t.id) AS total_review
FROM products p
LEFT JOIN testimonials t 
    ON t.product_id = p.id
GROUP BY p.id, p.name, p.description, p.price
HAVING COUNT(DISTINCT t.id) >= 3
ORDER BY total_review DESC
LIMIT 4;`;

    const { rows: result } = await pool.query(query);
    return result;
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
        category,
        minPrice,
        maxPrice,
        isFlashSale,
        isBuy1Get1,
        isBirthdayPackage,
        cheap,
        recommended,
    } = reqQuery;

    page = Number(page) || 1;

    // --- WHERE ---
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

    if (minPrice) {
        whereClause += ` AND p.price >= $${i}`;
        args.push(Number(minPrice));
        i++;
    }

    if (maxPrice) {
        whereClause += ` AND p.price <= $${i}`;
        args.push(Number(maxPrice));
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

    // --- COUNT ---
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
      ARRAY_AGG(DISTINCT i.image_path) 
        FILTER (WHERE i.id IS NOT NULL) AS images
    FROM filtered_products fp
    JOIN products p ON p.id = fp.id
    LEFT JOIN testimonials t ON t.product_id = p.id
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.categories_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN images i ON i.id = pi.image_id
    GROUP BY p.id
    ORDER BY p.id ASC
    LIMIT $${i} OFFSET $${i + 1};
  `;

    const dataArgs = [...args, limit, offset];

    const { rows } = await pool.query(dataQuery, dataArgs);

    const products = rows.map((p) => ({
        ...p,
        categories: p.categories || [],
        images: p.images || [],
    }));

    return { products, totalCount };
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
