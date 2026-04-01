import { Router } from "express";
import * as authController from "../controller/auth.controller.js";

const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login user
 *     description: Login into system with registered users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: user@email.com
 *             password: password123
 *     responses:
 *       200:
 *         description: login success
 *       403:
 *         description: wrong password
 */
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);

export default authRouter;
