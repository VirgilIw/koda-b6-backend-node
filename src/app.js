import express from "express";
import adminRouter from "./router/admin.router.js";
import authRouter from "./router/auth.router.js";
import mainRouter from "./router/main.router.js";
import docsRouter from "./router/docs.js";
import profileRouter from "./router/profile.router.js";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "PATCH", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// middleware
app.use(express.json());

// routes
app.use("", mainRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/profile", profileRouter);

// swagger
app.use("/swagger", docsRouter);

app.use(notFoundHandler); 
app.use(errorHandler);
export default app;
