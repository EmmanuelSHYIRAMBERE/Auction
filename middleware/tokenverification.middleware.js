import jwt from "jsonwebtoken";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { generateAccessToken } from "../utils/token.utility";

export const refreshAccessToken = catchAsyncError(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(
      new errorHandler({
        message: "Your session has expired, you need to log in again.",
        statusCode: 401,
      })
    );
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return next(
          new errorHandler({
            message: "Your session has expired, you need to log in again.",
            statusCode: 403,
          })
        );
      }

      if (!decoded || typeof decoded !== "object") {
        return next(
          new errorHandler({
            message: "Your session has expired, you need to log in again.",
            statusCode: 401,
          })
        );
      }

      const verified = decoded;

      const newAccessToken = generateAccessToken({
        _id: verified._id,
        email: verified.email,
      });

      res.cookie("accessToken", newAccessToken, {
        maxAge: 30000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      if (!req.token) {
        req.token = {};
      }

      req.token.accessToken = newAccessToken;

      next();
    }
  );
});

export const verifyAccessToken = async (req, res, next) => {
  try {
    const { accessToken: tokenFromCookie } = req.cookies;
    const tokenFromRequest = req.token?.accessToken;
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const token =
      tokenFromRequest ||
      tokenFromCookie ||
      (authorization ? authorization.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        message: "Please provide a valid access token.",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid access token.",
        });
      }

      if (!decoded || typeof decoded !== "object") {
        return res.status(401).json({
          message: "Invalid access token data.",
        });
      }

      const verified = decoded;

      req.user = {
        _id: verified._id,
        email: verified.email,
      };

      next();
    });
  } catch (error) {
    next(
      new errorHandler({
        message: "Failed to verify token.",
        statusCode: 500,
      })
    );
  }
};
