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

export default productRouter;
