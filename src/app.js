import express from "express";
import adminRouter from "./router/admin.router.js";
import authRouter from "./router/auth.router.js";
import { constants } from "node:http2";

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.get("/", function (req, res) {
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "backend is running well",
    });
});

export default app;