/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} role
 */

import { pool } from "../lib/db.js";
import { redisClient } from "../lib/redis.js";

/**
 *
 * @returns {User[]}
 */
export async function getAllUsers() {
    const cacheKey = "users:all";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        console.log("CACHE HIT");
        return JSON.parse(cached);
    }

    const sql = `
        SELECT id, email, password 
        FROM users
        ORDER BY id ASC;
    `;

    const { rows } = await pool.query(sql);

    await redisClient.setEx(cacheKey, 600, JSON.stringify(rows));

    return rows;
}

/**
 * @param {number} id
 * @returns {User}
 */
export async function getUserById(id) {
    const cacheKey = `user:${id}`;

    // 1. Cek cache dulu
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
        console.log("CACHE HIT");
        return JSON.parse(cachedUser);
    }

    console.log("CACHE MISS");

    // 2. Kalau tidak ada di cache → query DB
    const sql = `
        SELECT id, email, role 
        FROM users
        WHERE id = $1
    `;

    const values = [id];

    const {
        rows: [user],
    } = await pool.query(sql, values);

    if (!user) return null;

    await redisClient.setEx(cacheKey, 60, JSON.stringify(user));

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

    await redisClient.del(`user:${id}`);

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
