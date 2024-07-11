import express from "express";
import { admin, refreshAccessToken, verifyAccessToken } from "../middleware";
import {
  createPayment,
  deletePayment,
  getAllDonators,
  getAllPayments,
  getPaymentById,
  PaymentWebhook,
} from "../controllers/payment.controller";

const paymentRouter = express.Router();

paymentRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  PaymentWebhook
);
paymentRouter.post("/:id", createPayment);
paymentRouter.use(refreshAccessToken);
paymentRouter.get("/", verifyAccessToken, admin, getAllPayments);
paymentRouter.get("/:id", verifyAccessToken, getPaymentById);
paymentRouter.delete("/:id", verifyAccessToken, deletePayment);
paymentRouter.post("/donators", verifyAccessToken, getAllDonators);

export default paymentRouter;
