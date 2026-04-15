import { Router } from "express";
import * as mainController from "../controller/main.controller.js";
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
 * /reviews:
 *   get:
 *     tags:
 *       - products
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: Success
 */
mainRouter.get("/reviews", mainController.getReviews);


/**
 * @openapi
 * /recommended-products:
 *   get:
 *     tags:
 *       - products
 *     summary: Get recommended products
 *     responses:
 *       200:
 *         description: Success
 */
mainRouter.get("/recommended-products", mainController.getRecommendedProducts);

export default mainRouter;
