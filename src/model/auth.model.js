/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} email
 * @property {string} password
 */

import { pool } from "../lib/db.js";

/**
 *
 * @param {string} data
 * @returns {User}
 */
export async function register(data) {
    const sql = `
        INSERT INTO users(fullname, email, password) 
        VALUES($1, $2, $3)
        RETURNING id, fullname, email;
    `;

    const values = [data.fullname, data.email, data.password];

    const {
        rows: [rgstr],
    } = await pool.query(sql, values);

    return rgstr;
}
