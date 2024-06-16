import express from "express";
import {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  getAllContacts,
} from "../controllers/contact.controller";
import { verifyAccessToken, admin, refreshAccessToken } from "../middleware";

const contactRouter = express.Router();

contactRouter.post("/", createContact);

contactRouter.use(refreshAccessToken);

contactRouter.get("/:id", verifyAccessToken, getContactById);
contactRouter.get("/", verifyAccessToken, admin, getAllContacts);
contactRouter.put("/:id", verifyAccessToken, updateContact);
contactRouter.delete("/:id", verifyAccessToken, admin, deleteContact);

export default contactRouter;
