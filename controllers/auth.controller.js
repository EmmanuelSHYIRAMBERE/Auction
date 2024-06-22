import crypto from "crypto";
import User from "../models/user.model";
import ErrorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { comparePassword, hashPassword } from "../utils/password.utility";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utility";
import { sendOTPEmail } from "../middleware";

export const logIn = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("Please provide username and password", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPwdMatch = await comparePassword(password, user.password);

  if (!isPwdMatch) {
    return next(new ErrorHandler("Incorrect password. Please try again.", 401));
  }

  const { _id, email, location, role, photo } = user;

  const accessToken = generateAccessToken({ _id, email });
  const refreshToken = generateRefreshToken({ _id, email });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 31104000000,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "User logged in successfully!",
    access_token: accessToken,
    user: {
      userId: _id,
      email,
      username,
      location,
      photo,
      role,
    },
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { existingPassword, newPassword } = req.body;

  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new ErrorHandler("Please log in first!", 400));
  }

  const pwdCheck = await comparePassword(existingPassword, user.password);

  if (!pwdCheck) {
    return next(new ErrorHandler("Incorrect password. Please try again.", 401));
  }

  const hashedPwd = await hashPassword(newPassword);

  user.password = hashedPwd;

  await user.save();

  await Notification.create({
    content: "Your password was changed.",
    recipient_id: user._id,
  });

  res.status(200).json({
    message: "Password changed successfully!",
  });
});

export const generateOTP = (expiryMinutes = 10) => {
  const otp = crypto.randomInt(100000, 999999);
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);

  return {
    code: otp.toString(),
    expiresAt: expiryTime,
  };
};

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler(
        `We could not find the user with email: ${req.body.email}`,
        404
      )
    );
  }

  const { code, expiresAt } = generateOTP();

  user.otp = code;
  user.otpexpire = expiresAt;

  await user.save();

  sendOTPEmail(user.email, code);

  res.status(200).json({
    status: "success",
    message: `An email with a verification code was just sent to ${
      user.email
    }. This code will expire at ${expiresAt.toLocaleTimeString()}. Please check your inbox and use the code to reset your password.`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorHandler(
        `User with the email: ${email} does not exist, try another.`,
        409
      )
    );
  }

  if (user.otp !== otp) {
    return next(new ErrorHandler(`The entered OTP: ${otp} is incorrect.`, 401));
  }

  const currentDateTime = new Date();

  if (user.otpexpire && user.otpexpire < currentDateTime) {
    return next(
      new ErrorHandler(
        `The provided OTP: ${otp} has expired, please try again.`,
        401
      )
    );
  }

  const hashedPwd = await hashPassword(newPassword);

  user.password = hashedPwd;
  user.otp = null;
  user.otpexpire = null;

  await user.save();

  const token = generateAccessToken({ _id: user._id, email: user.email });

  res.status(200).json({
    message: "Success, password updated!",
    access_token: token,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  req.token = {};

  res.status(200).json({
    message: "User logged out successfully!",
  });
});
