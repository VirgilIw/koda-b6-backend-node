import { GenerateHash, VerifyHash } from "../lib/hash.js";
import { GenerateToken } from "../lib/jwt.js";
import * as authModel from "../model/auth.model.js";
import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);

        // handle user tidak ditemukan
        if (!user) {
            const err = new Error("user not found");
            err.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
            err.isOperational = true;
            throw err;
        }

        if (await VerifyHash(user.password, password)) {
            const token = GenerateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return res.json({
                success: true,
                message: "login success",
                result: {
                    token,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            const err = new Error("wrong password");
            err.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
            err.isOperational = true;
            throw err;
        }
    } catch (error) {
        next(error);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function register(req, res, next) {
    const data = req.body;

    try {
        const { password, confirmPassword } = data;

        if (!password || !confirmPassword) {
            const err = new Error("password and confirm password are required");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        if (password !== confirmPassword) {
            const err = new Error("password does not match");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
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
        next(error);
    }
}