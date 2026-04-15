import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import auth from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.use(auth);
/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @openapi
 * /admin/products:
 *   get:
 *     summary: Get products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success get products
 */
productRouter.get("/", productController.getProducts);

/**
 * @openapi
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 */
productRouter.delete("/:id", productController.deleteProduct);

/**
 * @openapi
 * /admin/products/search:
 *   get:
 *     tags:
 *       - products
 *     summary: Search products with filters
 *     description: Search products with keyword, category, price range, and flags
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Keyword for searching products
 *         example: "coffee"
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *         example: "beverage"
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *         example: 10000
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *         example: 50000
 *
 *       - in: query
 *         name: isFlashSale
 *         schema:
 *           type: boolean
 *         description: Filter flash sale products
 *
 *       - in: query
 *         name: isBuy1Get1
 *         schema:
 *           type: boolean
 *         description: Filter buy 1 get 1 products
 *
 *       - in: query
 *         name: isBirthdayPackage
 *         schema:
 *           type: boolean
 *         description: Filter birthday package products
 *
 *       - in: query
 *         name: cheap
 *         schema:
 *           type: boolean
 *         description: Filter cheap products (<= 20000)
 *
 *       - in: query
 *         name: recommended
 *         schema:
 *           type: boolean
 *         description: Filter recommended products (rating >= 4.7)
 *
 *     responses:
 *       200:
 *         description: Success get products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalCount:
 *                   type: integer
 *                   example: 20
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Cappuccino"
 *                       description:
 *                         type: string
 *                         example: "Hot coffee with milk foam"
 *                       price:
 *                         type: number
 *                         example: 25000
 *                       is_flash_sale:
 *                         type: boolean
 *                         example: false
 *                       is_buy1get1:
 *                         type: boolean
 *                         example: false
 *                       is_birthday_package:
 *                         type: boolean
 *                         example: false
 *                       rating:
 *                         type: number
 *                         example: 4.8
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["coffee", "hot"]
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["img1.jpg", "img2.jpg"]
 *
 *       400:
 *         description: Bad request
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
productRouter.get("/search", productController.searchProducts);

/**
 * @openapi
 * /admin/products/{id}:
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
productRouter.get("/:id", productController.getDetailProductById);

export default productRouter;
