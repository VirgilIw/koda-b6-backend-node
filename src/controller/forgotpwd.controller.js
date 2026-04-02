import * as forgotPwdModel from "../model/forgotpwd.model.js";
import { constants } from "node:http2";
import * as userModel from "../model/users.model.js";
import { GenerateHash } from "../lib/hash.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function requestForgotPassword(req, res) {
    try {
        const { email } = req.body;

        // validasi email
        if (!email) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "email is required",
            });
        }

        // cek user
        const user = await userModel.getUserByEmail(email);
        
        // generate OTP (6 digit)
        const code_otp = Math.floor(100000 + Math.random() * 900000);

        // simpan ke DB
        await forgotPwdModel.createForgotRequest({
            email: user.email,
            code_otp,
        });

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "OTP generated",
            code_otp,
        });
    } catch {
        res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "email not found",
        });
    }
}

/**
 * Handle reset password using OTP.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function resetPassword(req, res) {
    try {
        const { email, code_otp, newPassword } = req.body;

        // validasi input
        if (!email || !code_otp || !newPassword) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "email, otp, and new password are required",
            });
        }

        // 1. cek OTP
        const otpData = await forgotPwdModel.getDataByEmailAndCode({
            email,
            code_otp,
        });

        if (!otpData) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "invalid OTP",
            });
        }

        // 2. cek user
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "user not found",
            });
        }

        // 3. hash password baru
        const hashedPassword = await GenerateHash(newPassword);

        // 4. update password
        await userModel.updateUser(hashedPassword, user.id);

        // 5. hapus OTP
        await forgotPwdModel.deleteDataByCode({
            email,
            code_otp,
        });

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "password reset success",
        });
    } catch {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "internal server error",
        });
    }
}
