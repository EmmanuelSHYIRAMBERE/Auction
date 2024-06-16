import Donation from "../models/donation.model";
import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { donationsValidationSchema } from "../validation/data.validation";

export const createDonation = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findOne({
    _id: userId,
  });

  console.log("user:---", user);

  if (!user) {
    return next(new errorHandler(`User not found.`, 404));
  }

  req.body.firstname = user.firstname;
  req.body.lastname = user.lastname;
  req.body.email = user.email;

  const { error } = donationsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new errorHandler(errorMessage, 400));
  }

  const newDonation = await Donation.create(req.body);

  res.status(201).json({
    message: "Donation created successfully.",
    donation: newDonation,
  });
});

export const getDonationById = catchAsyncError(async (req, res, next) => {
  const donationId = req.params.id;

  const donation = await Donation.findById(donationId);

  if (!donation) {
    return next(new errorHandler(`Donation not found`, 404));
  }

  res.status(200).json({ message: "Donation found successfully", donation });
});

export const updateDonation = catchAsyncError(async (req, res, next) => {
  const donationId = req.params.id;

  const { error } = donationsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new errorHandler(errorMessage, 400));
  }

  const { firstname, lastname, phone, email, amount } = req.body;

  const updatedDonation = await Donation.findByIdAndUpdate(
    donationId,
    {
      firstname,
      lastname,
      phone,
      email,
      amount,
    },
    { new: true }
  );

  if (!updatedDonation) {
    return next(new errorHandler(`Donation not found`, 404));
  }

  res.status(200).json({
    message: "Donation updated successfully",
    updatedDonation,
  });
});

export const deleteDonation = catchAsyncError(async (req, res, next) => {
  const donationId = req.params.id;

  const deletedDonation = await Donation.findByIdAndDelete(donationId);

  if (!deletedDonation) {
    return next(new errorHandler(`Donation not found`, 404));
  }

  res
    .status(200)
    .json({ message: "Donation deleted successfully", deletedDonation });
});

export const getAllDonations = catchAsyncError(async (req, res, next) => {
  const allDonations = await Donation.find();

  if (allDonations.length === 0 || !allDonations) {
    return next(new errorHandler(`Donations not found`, 404));
  }

  res.status(200).json({
    message: "Donations found successfully",
    totalDonations: allDonations.length,
    donations: allDonations,
  });
});
