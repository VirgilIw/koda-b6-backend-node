import * as userModel from "../model/users.model.js";
import { constants } from "node:http2";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllUsers(req, res) {
  const user = await userModel.getAllUsers();
  res.status(constants.HTTP_STATUS_OK).json({
    success: "success",
    message: "list all users",
    result: user,
  });
}

/**
 * Get user by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserById(req, res) {
  try {
    const { id: idStr } = req.params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "invalid user id",
      });
    }

    const user = await userModel.getUserById(id);

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "get user by id success",
      result: user,
    });
  } catch (err) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: err.message,
    });
  }
}
// kita pakai should bind di go, untuk memahami di main express.json()

/**
 * Create user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUser(req, res) {
  try {
    const data = req.body;
    console.log(req.body);
    const newUser = await userModel.createUser(data);

    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "create user success",
      result: newUser,
    });
  } catch (err) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express".Response)} res
 */
export async function updateUser(req, res) {
  try {
    const { id: idStr } = req.params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "invalid user id",
      });
    }
    const data = req.body;

    const user = await userModel.updateUser(id, data);

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "update user success",
      result: user,
    });
  } catch (err) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express".Response)} res
 */
export async function deleteUser(req, res) {
  try {
    const { id: idStr } = req.params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "invalid user id",
      });
    }

    const user = await userModel.deleteUser(id);

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "delete user success",
      result: user,
    });
  } catch (err) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: err.message,
    });
  }
}
