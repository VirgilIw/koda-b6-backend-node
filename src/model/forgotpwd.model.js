import { pool } from "../lib/db.js";

/**
 * @typedef {Object} ForgotPasswordData
 * @property {string} email 
 * @property {number|string} code_otp 
 */

/**
 * @typedef {Object} ForgotPasswordEntity
 * @property {number} id 
 * @property {string} email 
 * @property {number|string} code_otp 
 * @property {Date} created_at 
 */

/**
 * @param {ForgotPasswordData} data 
 * @returns {Promise<ForgotPasswordEntity | undefined>} 
 */
export async function getDataByEmailAndCode(data) {
    const query = `
		SELECT id, email, code_otp, created_at
		FROM forgot_password
		WHERE email = $1 AND code_otp = $2;
	`;

    const values = [data.email, data.code_otp];

    const { rows: result } = await pool.query(query, values);
    return result[0];
}

/**
 * @param {ForgotPasswordData} data
 * @returns {Promise<void>}
 */
export async function deleteDataByCode(data) {
    const query = `
        DELETE FROM forgot_password
        WHERE email = $1 AND code_otp = $2;
    `;

    const values = [data.email, data.code_otp];

    await pool.query(query, values);
}

/**
 * @param {ForgotPasswordData} data 
 * @returns {Promise<ForgotPasswordEntity | null>} 
 */
export async function createForgotRequest(data) {
    const query = `
		INSERT INTO forgot_password (email, code_otp)
		VALUES ($1, $2)
		ON CONFLICT (email)
		DO UPDATE SET 
			code_otp = EXCLUDED.code_otp,
			created_at = NOW()
		RETURNING id, email, code_otp, created_at
	`;

    const values = [data.email, data.code_otp];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
}