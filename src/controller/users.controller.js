import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllUsers(req, res, next) {
    try {
        const result = await userModel.getAllUsers();

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success get all data",
            result: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserById(req, res, next) {
    try {
        const { id: idStr } = req.params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            const err = new Error("invalid user id");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        const user = await userModel.getUserById(id);

        if (!user) {
            const err = new Error("user not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "get user by id success",
            result: user,
        });
    } catch (err) {
        next(err);
    }
}
// kita pakai should bind di go, untuk memahami di main express.json()

/**
 * get user by email
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserByEmail(req, res, next) {
    try {
        const email = req.params.email;

        const data = await userModel.getUserByEmail(email);

        if (!data) {
            const err = new Error("user not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        return res.json({
            success: true,
            message: "success get data by email",
            result: data,
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Create user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUser(req, res, next) {
    try {
        const data = req.body;

        const newUser = await userModel.createUser(data);

        return res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "create user success",
            result: newUser,
        });
    } catch (err) {
        next(err);
    }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUser(req, res, next) {
    try {
        const { id: idStr } = req.params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            const err = new Error("invalid user id");
            err.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
            err.isOperational = true;
            throw err;
        }

        const user = await userModel.deleteUser(id);

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "delete user success",
            result: user,
        });
    } catch (err) {
        next(err);
    }
}