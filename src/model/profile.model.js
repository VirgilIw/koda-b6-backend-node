import { pool } from "../lib/db.js";

/**
 *
 * @param {number} id - User ID
 * @returns {Promise<{
 *   id: number,
 *   fullname: string,
 *   email: string,
 *   password: string,
 *   phone: string,
 *   address: string,
 *   picture: string,
 *   role: string,
 *   created_at: string,
 *   updated_at: string,
 *   deleted_at: string | null,
 *   lastlogin_at: string | null
 * } | undefined>}
 */
export async function getProfile() {
    const query = `
    SELECT 
        id,
        fullname,
        email,
        password,
        phone,
        address,
        picture,
        role,
        created_at,
        updated_at,
        deleted_at,
        lastlogin_at
    FROM users;`;

    const { rows: result } = await pool.query(query);
    return result[0];
}

/**
 * @param {Object} user
 * @param {number} user.id
 * @param {string} user.fullname
 * @param {string} user.email
 * @param {string} user.password
 * @param {string} user.phone
 * @param {string} user.address
 * @param {string} user.picture
 * @param {string} user.role
 * @returns {Promise<User>}
 */
/**
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<User>}
 */
export async function updateProfile(id, data) {
    const sql = `
UPDATE users SET
    fullname = $1,
    email = $2,
    password = $3,
    phone = $4,
    address = $5,
    picture = $6,
    role = $7,
    updated_at = now()
WHERE id = $8
RETURNING id, fullname, email, phone, address, picture, role;
    `;

    const values = [
        data.fullname,
        data.email,
        data.password,
        data.phone,
        data.address,
        data.picture,
        data.role,
        id,
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}
