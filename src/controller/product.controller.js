import * as productModel from "../model/product.model.js";
import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getProducts(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;

        const result = await productModel.getProducts(page);

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Get products success",
            data: result,
            page,
        });

    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
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
    } catch (error) {
        next(error);
    }
}

/**
 * Search products with filters, pagination, and flags
 *
 *
 * @param {import("express").Request} req
 * @param {Object} req.query
 * @param {number} [req.query.page] - Page number (default: 1)
 * @param {string} [req.query.name] - Search by product name
 * @param {string} [req.query.category] - Filter by category name
 * @param {number} [req.query.minPrice] - Minimum price filter
 * @param {number} [req.query.maxPrice] - Maximum price filter
 * @param {boolean} [req.query.isFlashSale] - Filter flash sale products
 * @param {boolean} [req.query.isBuy1Get1] - Filter buy 1 get 1 products
 * @param {boolean} [req.query.isBirthdayPackage] - Filter birthday package products
 * @param {boolean} [req.query.cheap] - Filter cheap products (<= 20000)
 * @param {boolean} [req.query.recommended] - Filter recommended products (rating >= 4.7)
 * @param {import("express").Response} res
 *
 */
export async function searchProducts(req, res, next) {
    try {
        const result = await productModel.searchProducts(req.query);

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success search products",
            data: result.products,
            total: result.totalCount,
        });
    } catch (error) {
        next(error);
    }
}
/**
 * Get detail product by it ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getDetailProductById(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "invalid product id",
            });
        }

        const result = await productModel.getDetailProductById(id);

        if (!result) {
            const err = new Error("Product not found");
            err.statusCode = constants.HTTP_STATUS_NOT_FOUND;
            err.isOperational = true;
            throw err;
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
