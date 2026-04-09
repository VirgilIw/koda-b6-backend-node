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
        const { password, confirmPassword } = data;
        // console.log(password, confirmPassword);
        if (!password || !confirmPassword) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "password and confirm password are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "password does not match",
            });
        }

        // hapus confirmPassword biar gak masuk DB
        delete data.confirmPassword;

        // hash password
        data.password = await GenerateHash(password);

        console.log("BODY:", req.body);
        console.log("FULLNAME:", data.fullname);
        const user = await authModel.register(data);

        const token = GenerateToken({
            userId: user.id,
        });

        return res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "register success",
            result: {
                token,
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            success: false,
            message: "failed to register",
            error: error.message,
        });
    }
}
