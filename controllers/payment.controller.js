import Payment from "../models/payment.model";
import User from "../models/user.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utility";
import { paymentsValidationSchema } from "../validation/data.validation";

export const createPayment = catchAsyncError(async (req, res, next) => {
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

  const { firstname, lastname, email, amount } = user;

  const customer = await stripe.customers.create({
    email: email,
    name: firstname + " " + lastname,
  });

  req.body.firstname = firstname;
  req.body.lastname = lastname;

  const { card_Name, card_ExpYear, card_ExpMonth, card_CVC, card_Number } =
    req.body;

  try {
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
      amount: parseInt(Math.round(totalAmount)),
      currency: "RWF",
      card: card.id,
      customer: customer.id,
    });

    user.customer_id = customer.id;
    user.card_id = card.id;
    user.receipt_id = paymentMade.id;
    user.role = "customer";

    await user.save();

    const paymentData = {
      success: true,
      itemsPaid: itemCount,
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
        _id: user._id,
        email: user.email,
        fullNames: user.fullNames,
        phoneNo: user.phoneNo,
        location: user.location,
        role: user.role,
      },
    };

    const paymentDetails = {
      items: itemCount,
      amount: paymentMade.amount,
      currency: paymentMade.currency,
      payment_method: paymentMade.payment_method_details.type,
    };

    paymentRequestConfirmationEmail(email, user.fullNames, paymentDetails);

    res.status(201).json(paymentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }

  const newPayment = await Payment.create(req.body);

  res.status(201).json({
    message: "Payment created successfully.",
    payment: newPayment,
  });
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
