import { Router } from "express";
import * as userController from "../controller/users.controller.js";

const userRouter = Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - users
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", userController.getAllUsers);

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - users
 *     summary: Get user by ID
 *     description: Retrieve a single user by ID
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
 *         description: User not found
 */
userRouter.get("/:id", userController.getUserById);

/**
 * @openapi
 * /admin/users/test/{email}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - users
 *     summary: Get user by email
 *     description: Retrieve user by email address
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
userRouter.get("/test/:email", userController.getUserByEmail);

/**
 * @openapi
 * /admin/users:
 *   post:
 *     security:
 *       - BearerAuth: []    
 *     tags:
 *       - users
 *     summary: Create new user
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.post("", userController.createUser);


/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - users
 *     summary: Delete user
 *     description: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
userRouter.delete("/:id", userController.deleteUser);



export default userRouter;
