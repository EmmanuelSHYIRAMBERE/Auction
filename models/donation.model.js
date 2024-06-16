import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
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
