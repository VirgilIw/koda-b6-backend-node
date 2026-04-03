import { Router } from "express";
import * as profileController from "../controller/profile.controller.js";
import auth from "../middleware/auth.middleware.js";

const profileRouter = Router();

profileRouter.use(auth);
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [profile]
 *     responses:
 *       200:
 *         description: Success get profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
profileRouter.get("", profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [profile]
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Updated"
 *               email:
 *                 type: string
 *                 example: "johnupdated@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "update user success"
 *                 result:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
profileRouter.patch("/:id", profileController.updateProfile);

export default profileRouter;
