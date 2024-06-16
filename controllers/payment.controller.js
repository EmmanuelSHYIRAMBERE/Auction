import Stripe from "stripe";
import dotenv from "dotenv";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { paymentsValidationSchema } from "../validation/data.validation";
import User from "../models/user.model";
import Donation from "../models/donation.model";
import Payment from "../models/payment.model";

dotenv.config();

const stripe = new Stripe(process.env.stripeSecret);

export const createPayment = catchAsyncError(async (req, res, next) => {
  try {
    const email = req.user.email;
    const donationId = req.params.id;

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new errorHandler(`User not found`, 404));
    }

    const { firstname, lastname } = user;

    req.body.firstname = firstname;
    req.body.lastname = lastname;
    req.body.email = email;

    const { error } = paymentsValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return next(new errorHandler(errorMessage, 400));
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return next(new errorHandler(`Donation not found`, 404));
    }

    const { amount } = donation;

    const customer = await stripe.customers.create({
      email: email,
      name: firstname + " " + lastname,
    });

    req.body.firstname = firstname;
    req.body.lastname = lastname;

    const { card_Name, card_ExpYear, card_ExpMonth, card_CVC, card_Number } =
      req.body;

    const card_token = await stripe.tokens.create({
      card: {
        name: card_Name,
        exp_year: card_ExpYear,
        exp_month: card_ExpMonth,
        cvc: card_CVC,
        number: card_Number,
      },
    });

    // Use the test token to add a card to the customer
    const card = await stripe.customers.createSource(customer.id, {
      source: card_token.id,
    });

    const paymentMade = await stripe.charges.create({
      receipt_email: email,
      amount: parseInt(Math.round(amount)) * 1000,
      currency: "RWF",
      card: card.id,
      customer: customer.id,
    });

    user.customer_id = customer.id;
    user.card_id = card.id;
    user.receipt_id = paymentMade.id;
    user.role = "donator";

    await user.save();

    const paymentData = {
      success: true,
      paymentMade: {
        id: paymentMade.id,
        amount: paymentMade.amount,
        currency: paymentMade.currency,
        payment_method: paymentMade.payment_method_details.type,
        receipt_email: paymentMade.receipt_email,
        receipt_url: paymentMade.receipt_url,
        status: paymentMade.status,
      },
      user: {
        email: email,
        fullNames: firstname + " " + lastname,
      },
    };

    const newPayment = await Payment.create(req.body);

    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error in createPayment:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
});

export const getPaymentById = catchAsyncError(async (req, res, next) => {
  const paymentId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return next(new errorHandler(`Payment not found`, 404));
  }

  res.status(200).json({ message: "Payment found successfully", payment });
});

export const updatePayment = catchAsyncError(async (req, res, next) => {
  const paymentId = req.params.id;
  const userId = req.user._id;

  const { error } = paymentsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new errorHandler(errorMessage, 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const updatedPayment = await Payment.findByIdAndUpdate(paymentId, req.body, {
    new: true,
  });

  if (!updatedPayment) {
    return next(new errorHandler(`Payment not found`, 404));
  }

  res.status(200).json({
    message: "Payment updated successfully",
    updatedPayment,
  });
});

export const deletePayment = catchAsyncError(async (req, res, next) => {
  const paymentId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  const deletedPayment = await Payment.findByIdAndDelete(paymentId);

  if (!deletedPayment) {
    return next(new errorHandler(`Payment not found`, 404));
  }

  res.status(200).json({
    message: "Payment deleted successfully",
    deletedPayment,
  });
});

export const getAllPayments = catchAsyncError(async (req, res, next) => {
  const allPayments = await Payment.find();
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  if (allPayments.length === 0 || !allPayments) {
    return next(new errorHandler(`Payments not found`, 404));
  }

  res.status(200).json({
    message: "Payments found successfully",
    totalPayments: allPayments.length,
    payments: allPayments,
  });
});
