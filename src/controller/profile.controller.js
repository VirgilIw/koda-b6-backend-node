import { GenerateHash } from "../lib/hash.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import * as profileModel from "../model/profile.model.js";
import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";
import fs from "fs";
import path from "path";

/**
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware
 *
 * @returns {Promise<void>}
 */
export async function getProfile(req, res, next) {
    try {
        const userId = res.locals.userId;

        const data = await userModel.getUserById(userId);

        if (!data) {
            const err = new Error("data not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            result: data,
        });
    } catch (error) {
        next(error);
    }
}
export async function getProfile(req, res, next) {
    try {
        const userId = res.locals.userId;

        const data = await userModel.getUserById(userId);

        if (!data) {
            const err = new Error("data not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            result: data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next - Express next middleware
 * @returns {void}
 */
export function updateProfile(req, res, next) {
    const upload = uploadMiddleware("uploads/profile").single("picture");

    upload(req, res, async function (err) {
        try {
            if (err) {
                err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
                err.isOperational = true;
                return next(err);
            }

            const id = res.locals.userId;

            const existingUser = await userModel.getUserById(id);

            if (!existingUser) {
                const error = new Error("user not found");
                error.statusCode = constants.HTTP_STATUS_NOT_FOUND;
                error.isOperational = true;
                throw error;
            }

            const data = req.body;

            // upload gambar baru
            if (req.file) {
                if (existingUser.picture) {
                    const oldPath = path.join(
                        "uploads/profile",
                        existingUser.picture
                    );

                    try {
                        await fs.promises.unlink(oldPath);
                    } catch {
                        // silent (biar gak ganggu flow)
                    }
                }

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
        } catch (error) {
            next(error);
        }
    });
}
