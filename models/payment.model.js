import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    ref_id: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Succeed", "Pending", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
