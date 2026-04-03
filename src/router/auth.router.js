import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import * as forgotPwdController from "../controller/forgotpwd.controller.js";

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

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Register new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *           example:
 *             fullname: John Doe
 *             email: johndoe@email.com
 *             password: password123
 *             confirmPassword: password123
 *     responses:
 *       201:
 *         description: user registered successfully
 *       400:
 *         description: bad request (validation error)
 *       409:
 *         description: email already exists
 */
authRouter.post("/register", authController.register);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Request forgot password
 *     description: Send OTP to user email for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *           example:
 *             email: user@email.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       404:
 *         description: email not found
 */
authRouter.post("/forgot-password", forgotPwdController.requestForgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Reset password
 *     description: Reset user password using OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code_otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               code_otp:
 *                 type: integer
 *               newPassword:
 *                 type: string
 *           example:
 *             email: user@email.com
 *             code_otp: 123456
 *             newPassword: newpassword123
 *     responses:
 *       200:
 *         description: password reset success
 *       400:
 *         description: invalid OTP or bad request
 *       404:
 *         description: user not found
 */
authRouter.post("/reset-password", forgotPwdController.resetPassword);

export default authRouter;
