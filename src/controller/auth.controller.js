import { GenerateHash, VerifyHash } from "../lib/hash.js";
import { GenerateToken } from "../lib/jwt.js";
import * as authModel from "../model/auth.model.js";
import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        if (await VerifyHash(user.password, password)) {
            const token = GenerateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            res.json({
                success: true,
                message: "login success",
                result: {
                    token,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            throw new Error("wrong password");
        }
    } catch (error) {
        res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "unauthorized",
            error: error.message,
        });
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function register(req, res) {
    const data = req.body;
    try {
        if (data.password) {
            data.password = await GenerateHash(data.password);
        }

        const user = await authModel.register(data);

        const token = GenerateToken({
            userId: user.id,
        });

        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "register success",
            result: {
                token,
            },
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            success: false,
            message: "failed to register",
            error: error.message,
        });
    }
}
