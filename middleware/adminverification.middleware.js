import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";

export const admin = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(
      new errorHandler({
        message: "Login again, your session might be ended!",
        statusCode: 404,
      })
    );
  }

  const role = user.role;

  if (role !== "admin") {
    return next(
      new errorHandler({
        message: "You are not authorized!",
        statusCode: 403,
      })
    );
  }

  next();
});
