import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    customer_id: { type: String, required: false },
    card_id: { type: String, required: false },
    receipt_id: { type: String, required: false },
    paymentStatus: {
      type: String,
      enum: ["Successful", "Pending", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
