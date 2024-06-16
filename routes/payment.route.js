import express from "express";
import { admin, refreshAccessToken, verifyAccessToken } from "../middleware";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
} from "../controllers/payment.controller";

const paymentRouter = express.Router();

paymentRouter.post("/:id", verifyAccessToken, createPayment);
paymentRouter.get("/", verifyAccessToken, admin, getAllPayments);
paymentRouter.get("/:id", verifyAccessToken, getPaymentById);
paymentRouter.delete("/:id", verifyAccessToken, deletePayment);

export default paymentRouter;
