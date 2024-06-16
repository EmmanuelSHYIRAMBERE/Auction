import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { hashPassword } from "../utils/password.utility";
import { usersValidationSchema } from "../validation/data.validation";
import cloudinary from "../utils/cloudinary.utility";
// import { sendWelcomeEmail } from "../middleware";

export const registerUser = catchAsyncError(async (req, res, next) => {
  console.log("Received request body:", req.body);

  const { error } = usersValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    console.log("Validation error:", errorMessage);
    return next(new errorHandler(errorMessage, 400));
  }

  console.log("Validated body:", req.body);

  const { email, password, username, firstname, lastname, location, role } =
    req.body;

  const existingUserEmail = await User.findOne({ email: email });
  const existingUsername = await User.findOne({ username: username });

  if (existingUserEmail) {
    return next(
      new errorHandler(`User with the email ${email} already exists.`, 409)
    );
  }

  if (existingUsername) {
    return next(
      new errorHandler(`Username ${username} is already taken.`, 409)
    );
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    email,
    password: hashedPassword,
    username,
    firstname,
    lastname,
    location,
    role,
  });

  // sendWelcomeEmail(email, lastname);

  res.status(201).json({
    message: "User registered successfully.",
    user: { email, username, firstname, lastname, location, role },
  });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  res.status(200).json({ message: "User found successfully", user });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const { username } = req.body;

  const user = await User.findOne({
    username: username,
    _id: { $ne: userId },
  });

  if (user) {
    return next(
      new errorHandler(`Username ${username} is already taken.`, 409)
    );
  }

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path);
    req.body.photo = image.secure_url;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return next(new errorHandler(`User not found`, 404));
  }

  res.status(200).json({
    message: "User updated successfully",
    updatedUser,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return next(new errorHandler(`User not found`, 404));
  }

  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const allUsers = await User.find();

  if (allUsers.length === 0 || !allUsers) {
    return next(new errorHandler(`Users not found`, 404));
  }

  res.status(200).json({
    message: "Users found successfully",
    totalUsers: allUsers.length,
    users: allUsers,
  });
});
