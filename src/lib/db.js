import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSLMODE === "require"
    ? { rejectUnauthorized: false }
    : false,
});

export async function db() {
    const client = await pool.connect();
    return client;
}