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
        if (password == user.password) {
            res.json({
                success: true,
                message: "login success",
                result: {
                    id: user.id,
                    email: user.email,
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
        const user = await authModel.register(data);
        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "register success",
            result: user,
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            success: false,
            message: "failed to register",
            error: error.message,
        });
    }
}
