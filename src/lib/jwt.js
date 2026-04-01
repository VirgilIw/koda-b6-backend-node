import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET_KEY;

/**
 * @typedef {Object} Payload
 * @property {number} userId
 */

/**
 *
 * @param {Payload} payload
 * @returns {string}
 */
export function GenerateToken(payload) {
    return jwt.sign(payload, SECRET);
}

/**
 *
 * @param {string} token
 * @returns {Payload}
 */
export function VerifyToken(token) {
    try {
        const payload = jwt.verify(token, SECRET);
        return payload;
    } catch {
        return null;
    }
}
