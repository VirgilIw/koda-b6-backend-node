import argon2 from "argon2";

/**
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function GenerateHash(password) {
    const hash = await argon2.hash(password);
    return hash;
}
/**
 *
 * @param {string} hash
 * @param {string} plaintext
 *
 * @returns {Promise<boolean>}
 */
export async function VerifyHash(hash, plaintext) {
    const isVerified = await argon2.verify(hash, plaintext);
    return isVerified;
}
