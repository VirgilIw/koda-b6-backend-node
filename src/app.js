import express from "express";
import adminRouter from "./router/admin.router.js";
import authRouter from "./router/auth.router.js";
import mainRouter from "./router/main.router.js";

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/main", mainRouter);
app.use("/auth", authRouter);
// app.use("/admin", auth, adminRouter);
app.use("/admin", adminRouter);


export default app;
