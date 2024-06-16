import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String, required: false },
    customer_id: {
      type: String,
      required: false,
    },
    card_id: {
      type: String,
      required: false,
    },
    receipt_id: {
      type: String,
      required: false,
    },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
