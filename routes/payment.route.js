import express from "express";
import { admin, refreshAccessToken, verifyAccessToken } from "../middleware";
import {
  captureDonationPayment,
  createDonationPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
} from "../controllers/payment.controller";

const paymentRouter = express.Router();

paymentRouter.post("/donate/:id", createDonationPayment);
paymentRouter.post("/capture", captureDonationPayment);
paymentRouter.use(refreshAccessToken);
paymentRouter.get("/", verifyAccessToken, admin, getAllPayments);
paymentRouter.get("/:id", verifyAccessToken, getPaymentById);
paymentRouter.delete("/:id", verifyAccessToken, deletePayment);

export default paymentRouter;
