import express from "express";

import {
  registerUser,
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
} from "../controllers/user.controller";
import { admin, refreshAccessToken, verifyAccessToken } from "../middleware";
import imageUpload from "../middleware/uploadimage.middleware";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.use(refreshAccessToken);

userRouter.get("/:id", verifyAccessToken, getUserById);
userRouter.get("/", verifyAccessToken, admin, getAllUsers);
userRouter.put("/", verifyAccessToken, imageUpload, updateUser);
userRouter.delete("/:id", verifyAccessToken, admin, deleteUser);

export default userRouter;
