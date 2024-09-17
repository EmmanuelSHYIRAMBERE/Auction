import { sendNewSubscriptionEmail } from "../middleware";
import Subscribe from "../models/subscription.model";
import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { subscriptionsValidationSchema } from "../validation/data.validation";

export const createSubscription = catchAsyncError(async (req, res, next) => {
  const { error } = subscriptionsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new errorHandler(errorMessage, 400));
  }

  const userSubscribed = await Subscribe.findOne({ email: req.body.email });

  if (userSubscribed) {
    return next(new errorHandler("User already subscribed", 400));
  }

  const newSubscription = await Subscribe.create(req.body);

  sendNewSubscriptionEmail(req.body.email);

  res.status(201).json({
    message: "Subscription created successfully.",
    subscription: newSubscription,
  });
});

export const getSubscriptionById = catchAsyncError(async (req, res, next) => {
  const subscriptionId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const subscription = await Subscribe.findById(subscriptionId);

  if (!subscription) {
    return next(new errorHandler(`Subscription not found`, 404));
  }

  res
    .status(200)
    .json({ message: "Subscription found successfully", subscription });
});

export const updateSubscription = catchAsyncError(async (req, res, next) => {
  const subscriptionId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const updatedSubscription = await Subscribe.findByIdAndUpdate(
    subscriptionId,
    req.body,
    { new: true }
  );

  if (!updatedSubscription) {
    return next(new errorHandler(`Subscription not found`, 404));
  }

  res.status(200).json({
    message: "Subscription updated successfully",
    updatedSubscription,
  });
});

export const deleteSubscription = catchAsyncError(async (req, res, next) => {
  const subscriptionId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const deletedSubscription = await Subscribe.findByIdAndDelete(subscriptionId);

  if (!deletedSubscription) {
    return next(new errorHandler(`Subscription not found`, 404));
  }

  res.status(200).json({
    message: "Subscription deleted successfully",
    deletedSubscription,
  });
});

export const getAllSubscriptions = catchAsyncError(async (req, res, next) => {
  const allSubscriptions = await Subscribe.find();
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  if (allSubscriptions.length === 0 || !allSubscriptions) {
    return next(new errorHandler(`Subscriptions not found`, 404));
  }

  res.status(200).json({
    message: "Subscriptions found successfully",
    totalSubscriptions: allSubscriptions.length,
    subscriptions: allSubscriptions,
  });
});
