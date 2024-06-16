import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    card_Name: { type: String, required: true },
    cardNumber: { type: String, required: true },
    card_CVC: { type: String, required: true },
    card_ExpMonth: { type: String, required: true },
    card_ExpYear: { type: String, required: true },
    bankName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
