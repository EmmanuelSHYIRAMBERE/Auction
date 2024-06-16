import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";

export const admin = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(
      new errorHandler("Login again, your session might be ended!", 404)
    );
  }

  const role = user.role;

  if (role !== "admin") {
    return next(new errorHandler("You are not authorized!", 403));
  }

  next();
});
