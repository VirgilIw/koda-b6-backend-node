import * as productModel from "../model/product.model.js";
import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getProducts(req, res) {
    try {
        const page = Number(req.query.page) || 1;

        const result = await productModel.getProducts(page);

        return res.status(200).json({
            success: true,
            message: "Get products success",
            data: result,
            page,
        });
    } catch (err) {
        console.error("ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "invalid product id",
            });
        }

        await productModel.deleteProduct(id);

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "delete product success",
        });
    } catch (err) {
        console.error(err);

        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "failed delete product",
        });
    }
}
