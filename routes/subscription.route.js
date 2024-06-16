import express from "express";

import {
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAllSubscriptions,
} from "../controllers/subscribe.controller";
import { verifyAccessToken, admin, refreshAccessToken } from "../middleware";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/", createSubscription);

subscriptionRouter.use(refreshAccessToken);

subscriptionRouter.get("/:id", verifyAccessToken, getSubscriptionById);
subscriptionRouter.get("/", verifyAccessToken, admin, getAllSubscriptions);
subscriptionRouter.put("/:id", verifyAccessToken, updateSubscription);
subscriptionRouter.delete("/:id", verifyAccessToken, admin, deleteSubscription);

export default subscriptionRouter;
