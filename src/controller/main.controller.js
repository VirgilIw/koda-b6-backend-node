import * as mainModel from "../model/main.model.js";

import { constants } from "node:http2";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getReviews(req, res) {
    try {
        const result = await mainModel.getReviews();

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success get all reviews",
            data: result,
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "internal server error",
            error: error.message,
        });
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRecommendedProducts(req, res) {
    try {
        const result = await mainModel.getRecommendedProducts();
        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success get recommend products",
            data: result,
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "internal server error",
            error: error.message,
        });
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
export async function searchProducts(req, res) {
    try {
        const result = await mainModel.searchProducts(req.query);

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "success search products",
            data: result,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
}

/**
 * Get detail product by it ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getDetailProductById(req, res) {
    try {
        const id = parseInt(req.params.id);

        const result = await mainModel.getDetailProductById(id);

        if (!result) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.json({
            success: true,
            data: result,
        });
    } catch {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
}
