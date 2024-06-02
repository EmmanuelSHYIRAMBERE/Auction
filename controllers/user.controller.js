import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { hashPassword } from "../utils/password.utility";
import { usersValidationSchema } from "../validation/data.validation";

export const registerUser = catchAsyncError(async (req, res, next) => {
  const { error } = usersValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(
      new errorHandler({
        message: errorMessage,
        statusCode: 400,
      })
    );
  }

  const { email, password, username, lastname, location } = req.body;

  const existingUserEmail = await User.findOne({ email: email });
  const existingUsername = await User.findOne({ username: username });

  if (existingUserEmail) {
    return next(
      new errorHandler({
        message: `User with the email ${email} already exists.`,
        statusCode: 409,
      })
    );
  }

  if (existingUsername) {
    return next(
      new errorHandler({
        message: `Username ${username} is already taken.`,
        statusCode: 409,
      })
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    lastname,
    location,
  });

  res.status(201).json({
    message: "User registered successfully.",
    user: newUser,
  });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new errorHandler({ message: `User not found`, statusCode: 404 })
    );
  }

  res.status(200).json({ message: "User found successfully", user });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const { error } = usersValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(
      new errorHandler({
        message: errorMessage,
        statusCode: 400,
      })
    );
  }

  const { username, lastname, location } = req.body;

  const existingUsername = await User.findOne({
    username: username,
    _id: { $ne: userId },
  });

  if (existingUsername) {
    return next(
      new errorHandler({
        message: `Username ${username} is already taken.`,
        statusCode: 409,
      })
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username, lastname, location },
    { new: true }
  );

  if (!updatedUser) {
    return next(
      new errorHandler({ message: `User not found`, statusCode: 404 })
    );
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
    return next(
      new errorHandler({ message: `User not found`, statusCode: 404 })
    );
  }

  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const allUsers = await User.find();

  if (allUsers.length === 0 || !allUsers) {
    return next(
      new errorHandler({ message: `Users not found`, statusCode: 404 })
    );
  }

  res.status(200).json({
    message: "Users found successfully",
    totalUsers: allUsers.length,
    users: allUsers,
  });
});
