import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cvc: { type: String, required: true },
    bankName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
