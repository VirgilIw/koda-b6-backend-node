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
 select id, email, password from users
 where id = $1
 order by id asc;`;

    const values = [id];

    const {
        rows: [user],
    } = await pool.query(sql, values);
    if (!user) {
        throw new Error("user not found");
    }
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



// const data ="test"

// function test(data) {
//     console.log(`test, ${data}`)
// }