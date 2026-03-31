import {Router} from "express"
import * as userController from "../controller/users.controller.js"

const userRouter = Router()

userRouter.get("", userController.getAllUsers)
userRouter.get("/:id", userController.getUserById)
userRouter.patch("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)
userRouter.post("", userController.createUser)

export default userRouter