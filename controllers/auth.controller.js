import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { comparePassword, hashPassword } from "../utils/password.utility";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utility";

export const logIn = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new errorHandler({
        message: "Please provide username and password",
        statusCode: 400,
      })
    );
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return next(
      new errorHandler({ message: `User not found`, statusCode: 404 })
    );
  }

  let isPwdMatch = await comparePassword(req.body.password, user.password);

  if (!isPwdMatch) {
    return next(
      new errorHandler({
        message: `Incorrect password. Please try again.`,
        statusCode: 401,
      })
    );
  }

  const { _id, location, role } = user;

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
      email: email,
      username: username,
      location: location,
      photo: photo,
      role: role,
    },
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { existingPassword, newPassword } = req.body;

  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(
      new errorHandler({ message: "Please log in first!", statusCode: 400 })
    );
  }

  let pwdCheck = await comparePassword(existingPassword, user.password);

  if (!pwdCheck) {
    return next(
      new errorHandler({
        message: "Incorrect password. Please try again.",
        statusCode: 401,
      })
    );
  }

  let hashedPwd = await hashPassword(newPassword);

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
      new errorHandler({
        message: `We could not find the user with email: ${req.body.email}`,
        statusCode: 404,
      })
    );
  }

  const resetPasswordOTP = generateOTP().code;

  user.otp = resetPasswordOTP;
  user.otpexpire = generateOTP().expiresAt;

  await user.save();

  res.status(200).json({
    status: "success",
    OTP: resetPasswordOTP,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(
      new errorHandler({
        message: `user with the email: ${email} not exists, try others`,
        statusCode: 409,
      })
    );
  }

  if (user.otp !== otp) {
    return next(
      new errorHandler({
        message: `Dear user the otp entered  ${otp} is not correct`,
        statusCode: 401,
      })
    );
  }

  const { otpexpire } = user;

  const currentDateTime = new Date();

  if (otpexpire && otpexpire < currentDateTime) {
    return next(
      new errorHandler({
        message: `The provided otp: ${otp} has been expired, please try again.`,
        statusCode: 401,
      })
    );
  }

  let hashedPwd = await hashPassword(req.body.newPassword);

  user.password = hashedPwd;
  user.otp = null;
  user.otpexpire = null;

  await user.save();

  let token = generateAccessToken({ _id: user._id, email: user.email });

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
