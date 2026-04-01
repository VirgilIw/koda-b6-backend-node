// recommended
// review
// browse
// detail

// import express from "express";
import { Router } from "express";
import * as mainController from "../controller/main.controller.js";
import { constants } from "node:http2";
import docsRouter from "./docs.js";

const mainRouter = Router();
// const app = express();

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
// mainRouter.get("/products", mainController.getProducts);
// mainRouter.get("/products/:id", mainController.getProductDetail);
mainRouter.get("/reviews", mainController.getReviews);
mainRouter.get("/products/search", mainController.searchProducts);
mainRouter.get("/products/recommended", mainController.getRecommendedProducts);

export default mainRouter;
