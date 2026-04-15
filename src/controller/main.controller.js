import * as mainModel from "../model/main.model.js";

import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getReviews(req, res, next) {
    try {
        const result = await mainModel.getReviews();

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success get all reviews",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRecommendedProducts(req, res, next) {
    try {
        const result = await mainModel.getRecommendedProducts();

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success get recommend products",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}