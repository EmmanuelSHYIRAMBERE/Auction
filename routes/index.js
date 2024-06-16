import express from "express";

import errorHandler from "../utils/errorhandler.utlity";
import { globalErrorController } from "../controllers/error.controller";
import { refreshAccessToken } from "../middleware/tokenverification.middleware";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import contactRouter from "./contact.route";
import subscriptionRouter from "./subscription.route";
import donationRouter from "./donation.route";
import paymentRouter from "./payment.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/contacts", contactRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/subscriptions", subscriptionRouter);

apiRouter.use(refreshAccessToken);

apiRouter.use("/donations", donationRouter);
apiRouter.use("/payments", paymentRouter);

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
