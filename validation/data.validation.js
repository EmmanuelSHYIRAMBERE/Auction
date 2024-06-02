import Joi from "joi";

// Joi validation schema for user registration properties
export const usersValidationSchema = Joi.object({
  username: Joi.string().required(),
  lastname: Joi.string().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().required(),
  email: Joi.string().email().required(),
});
