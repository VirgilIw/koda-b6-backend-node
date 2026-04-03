import { Router } from "express";
import * as mainController from "../controller/main.controller.js";
import * as profileController from "../controller/profile.controller.js";
import { constants } from "node:http2";
import docsRouter from "./docs.js";
import express from "express";
const mainRouter = Router();

mainRouter.use("/uploads", express.static("uploads/"));

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - health-check
 *     summary: Health Check
 *     description: Health Check
 *     responses:
 *       200:
 *         description: Returning JSON with success and message
 */
mainRouter.use("/docs", docsRouter);

mainRouter.get("/", function (req, res) {
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "backend is running well",
    });
});

// products
/**
 * @openapi
 * /main/product/reviews:
 *   get:
 *     tags:
 *       - products
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: Success
 */
mainRouter.get("/product/reviews", mainController.getReviews);

/**
 * @openapi
 * /main/product/search:
 *   get:
 *     tags:
 *       - products
 *     summary: Search products
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Keyword for searching products
 *     responses:
 *       200:
 *         description: Success
 */
mainRouter.get("/product/search", mainController.searchProducts);

/**
 * @openapi
 * /main/product/recommended:
 *   get:
 *     tags:
 *       - products
 *     summary: Get recommended products
 *     responses:
 *       200:
 *         description: Success
 */
mainRouter.get("/product/recommended", mainController.getRecommendedProducts);

/**
 * @openapi
 * /main/product/{id}:
 *   get:
 *     tags:
 *       - products
 *     summary: Get product detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product not found
 */
mainRouter.get("/product/:id", mainController.getDetailProductById);

mainRouter.get("/profile", profileController.getProfile);
mainRouter.get("/profile", profileController.getProfile);
export default mainRouter;
