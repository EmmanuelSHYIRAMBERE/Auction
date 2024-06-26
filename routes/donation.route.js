import express from "express";
import {
  createDonation,
  getDonationById,
  updateDonation,
  deleteDonation,
  getAllDonations,
} from "../controllers/donation.controller";
import { admin, verifyAccessToken } from "../middleware";

const donationRouter = express.Router();

donationRouter.post("/", createDonation);
donationRouter.get("/", verifyAccessToken, admin, getAllDonations);
donationRouter.get("/:id", verifyAccessToken, getDonationById);
donationRouter.put("/:id", verifyAccessToken, updateDonation);
donationRouter.delete("/:id", verifyAccessToken, deleteDonation);

export default donationRouter;
