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

