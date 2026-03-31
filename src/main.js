import express from "express";
import { constants } from "node:http2";

import userRouter from "./router/users.router.js";

const app = express();

app.use(express.json()); // global

// group
app.use("/users",userRouter)

app.get("/", function (req, res) {
  res.status(constants.HTTP_STATUS_OK).json({
    success: true,
    message: "backend is running well",
  });
});

app.listen(8888, function () {
  console.log(`app listening on port 8888`);
});
