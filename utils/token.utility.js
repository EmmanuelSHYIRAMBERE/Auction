import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

export const generateAccessToken = (data) => {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
  });

  return accessToken;
};

export const generateRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
  });

  return refreshToken;
};
