import dotenv from "dotenv";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { paymentsValidationSchema } from "../validation/data.validation";
import User from "../models/user.model";
import Donation from "../models/donation.model";
import Payment from "../models/payment.model";
import { sendDonationThankYouEmail } from "../middleware";
import { sendNotificationEmail } from "../middleware/sendNotificationEmail";

dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PLATFORM_EMAIL } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrder = async (data) => {
  try {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const { firstname, lastname, email, phone, amount } = data.donation;

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          firstname: firstname,
          lastname: lastname,
          phone: phone,
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json();

    await Payment.create({
      ref_id: jsonResponse.id,
      firstname,
      lastname,
      email,
      phone,
      amount,
    });

    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();

    const { id, status } = jsonResponse;

    const payment = await Payment.findOne({ ref_id: id });

    if (!payment) {
      return next(new errorHandler(`Payment not found`, 404));
    }

    const { firstname, lastname, email, amount } = payment;

    if (status === "COMPLETED") {
      payment.status = "Succeed";
      await payment.save();

      sendDonationThankYouEmail(email, firstname + " " + lastname);

      // Send notification email to the platform
      const subject = "New Donation Payment Completed";
      sendNotificationEmail(
        email,
        `${firstname} ${lastname}`,
        subject,
        `A new donation of ${amount} amount has been successfully completed.`,
        PLATFORM_EMAIL
      );
    }

    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    console.log("Failed to parse response body as JSON:", err);
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

export const createDonationPayment = catchAsyncError(async (req, res, next) => {
  try {
    const donationId = req.params.id;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return next(new errorHandler(`Donation not found`, 404));
    }

    const { jsonResponse, httpStatusCode } = await createOrder({ donation });
    if (httpStatusCode !== 201) {
      throw new Error(`Failed to create order. Status code: ${httpStatusCode}`);
    }
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

export const captureDonationPayment = catchAsyncError(
  async (req, res, next) => {
    try {
      const { orderID } = req.body;
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to capture order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  }
);

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
