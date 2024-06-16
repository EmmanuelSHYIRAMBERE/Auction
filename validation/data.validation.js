import Joi from "joi";

// Joi validation schema for user registration properties
export const usersValidationSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  location: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "donator", "user").default("user"),
});

export const contactsValidationSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
});

export const donationsValidationSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  amount: Joi.number().required(),
  paymentStatus: Joi.string()
    .valid("Successful", "Pending", "Failed")
    .default("Pending"),
});

export const subscriptionsValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const paymentsValidationSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  card_Name: Joi.string().required(),
  card_Number: Joi.number().required(),
  card_CVC: Joi.string().required(),
  card_ExpYear: Joi.number().required(),
  card_ExpMonth: Joi.string().required(),
});
