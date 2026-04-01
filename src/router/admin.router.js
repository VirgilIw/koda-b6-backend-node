import { Router } from "express";
import userRouter from "./users.router.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/rbac.js";

const adminRouter = Router();

adminRouter.use(auth, authorize("admin"));

adminRouter.use("/users", userRouter);

export default adminRouter;