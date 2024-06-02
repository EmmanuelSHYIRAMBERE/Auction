import express from "express";
import { refreshAccessToken, verifyAccessToken } from "../middleware";
import {
  logIn,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/", logIn);
authRouter.post("/logout", verifyAccessToken, logout);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/resetpassword", resetPassword);

authRouter.use(refreshAccessToken);
authRouter.post("/changepassword", verifyAccessToken, changePassword);

export default authRouter;
