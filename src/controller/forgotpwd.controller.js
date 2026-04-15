import * as forgotPwdModel from "../model/forgotpwd.model.js";
import { constants } from "node:http2";
import * as userModel from "../model/users.model.js";
import { GenerateHash } from "../lib/hash.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function requestForgotPassword(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            const err = new Error("email is required");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        const user = await userModel.getUserByEmail(email);

        if (!user) {
            const err = new Error("email not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        const code_otp = Math.floor(100000 + Math.random() * 900000);

        await forgotPwdModel.createForgotRequest({
            email: user.email,
            code_otp,
        });

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "OTP generated",
            code_otp,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Handle reset password using OTP.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function resetPassword(req, res, next) {
    try {
        const { email, code_otp, newPassword } = req.body;

        if (!email || !code_otp || !newPassword) {
            const err = new Error("email, otp, and new password are required");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        const otpData = await forgotPwdModel.getDataByEmailAndCode({
            email,
            code_otp,
        });

        if (!otpData) {
            const err = new Error("invalid OTP");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        const user = await userModel.getUserByEmail(email);

        if (!user) {
            const err = new Error("user not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        const hashedPassword = await GenerateHash(newPassword);

        await userModel.updateUser(hashedPassword, user.id);

        await forgotPwdModel.deleteDataByCode({
            email,
            code_otp,
        });

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "password reset success",
        });
    } catch (error) {
        next(error);
    }
}