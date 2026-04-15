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
        [productId]
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
