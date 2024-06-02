import express from "express";

import errorHandler from "../utils/errorhandler.utlity";
import { globalErrorController } from "../controllers/error.controller";
import { refreshAccessToken } from "../middleware/tokenverification.middleware";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use(refreshAccessToken);

apiRouter.use("/users", userRouter);

apiRouter.all("*", (req, res, next) => {
  next(
    new errorHandler({
      message: `Failure connecting to the server!`,
      statusCode: 404,
    })
  );
});

apiRouter.use(globalErrorController);

export default apiRouter;
