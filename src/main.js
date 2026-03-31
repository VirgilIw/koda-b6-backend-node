import express from "express";
import { constants } from "node:http2";

import userRouter from "./router/users.router.js";
import authRouter from "./router/auth.router.js";

const app = express();

app.use(express.json()); // global

// group
app.use("/auth",authRouter)
app.use("/users",userRouter)

app.get("/", function (req, res) {
  res.status(constants.HTTP_STATUS_OK).json({
    success: true,
    message: "backend is running well",
  });
});

const PORT = process.env.PORT

app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}`);
});
