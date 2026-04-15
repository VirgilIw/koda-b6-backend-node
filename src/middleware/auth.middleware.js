import { VerifyToken } from "../lib/jwt.js";
import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "unauthorized - no header",
        });
    }

    const prefix = "Bearer ";
    if (!authHeader.startsWith(prefix)) {
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "invalid token format",
        });
    }

    const token = authHeader.slice(prefix.length);

    try {
        const payload = VerifyToken(token);

        if (!payload) {
            throw new Error("invalid token");
        }
        req.user = payload;
        res.locals.userId = payload.userId;
        res.locals.role = payload.role;

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err.message);
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "invalid token",
        });
    }
}
