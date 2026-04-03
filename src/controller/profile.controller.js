import multer from "multer";
import { GenerateHash } from "../lib/hash.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import * as profileModel from "../model/profile.model.js";
import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";
import fs from "fs";
import path from "path";

export async function getProfile(req, res) {
    try {
        const userId = res.locals.userId;

        const data = await userModel.getUserById(userId);

        if (!data) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "data not found",
            });
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            result: data,
        });
    } catch (error) {
        console.error("getProfile error:", error);

        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "internal server error",
        });
    }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateProfile(req, res) {
    const upload = uploadMiddleware("uploads/profile").single("picture");

    upload(req, res, async function (err) {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "failed to upload picture",
                    errors: err.message,
                });
            }

            if (err) {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "failed to upload picture",
                    errors: err.message,
                });
            }

            const id = res.locals.userId;

            // ambil user lama
            const existingUser = await userModel.getUserById(id);

            if (!existingUser) {
                return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                    success: false,
                    message: "user not found",
                });
            }

            const data = req.body;

            // kalau upload gambar baru
            if (req.file) {
                // hapus gambar lama
                if (existingUser.picture) {
                    const oldPath = path.join(
                        "uploads/profile",
                        existingUser.picture,
                    );

                    try {
                        await fs.promises.unlink(oldPath);
                    } catch (err) {
                        console.log(
                            err,
                            "file lama tidak ada / sudah terhapus",
                        );
                    }
                }

                // simpan gambar baru
                data.picture = req.file.filename;
            }

            if (data.password) {
                data.password = await GenerateHash(data.password);
            }

            const user = await profileModel.updateProfile(id, data);

            return res.status(constants.HTTP_STATUS_OK).json({
                success: true,
                message: "update user success",
                result: user,
            });
        } catch (err) {
            console.error("updateProfile error:", err);

            return res
                .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
                .json({
                    success: false,
                    message: err.message,
                });
        }
    });
}
