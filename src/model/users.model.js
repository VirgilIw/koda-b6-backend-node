/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} role
 */

import { pool } from "../lib/db.js";

/**
 *
 * @returns {User[]}
 */
export async function getAllUsers() {
    const sql = `
 select id, email, password from users
 order by id asc;`;

    const { rows: user } = await pool.query(sql);
    return user;
}

/**
 * @param {number} id
 * @returns {User}
 */
export async function getUserById(id) {
    const sql = `
 select id, email, role from users
 where id = $1
 order by id asc;`;

    const values = [id];

    const {
        rows: [user],
    } = await pool.query(sql, values);

    return user;
}

/**
 * @param {string} email
 * @returns {User}
 */
export async function getUserByEmail(email) {
    const sql = `
    SELECT id, email, password, role 
    FROM users 
    WHERE email = $1
  `;

    const values = [email];

    const { rows: data } = await pool.query(sql, values);

    if (data.length === 0) {
        throw new Error("user not found");
    }

    return data[0];
}

/**
 * @param {number} id
 * @returns {User}
 */
export async function deleteUser(id) {
    const sql = `
        DELETE FROM users 
        WHERE id = $1
        RETURNING id, fullname, email
    `;

    const values = [id];
    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export async function createUser(email, password) {
    const sql = `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email;
    `;

    const values = [email, password];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}
