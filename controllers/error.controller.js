import errorHandler from "../utils/errorhandler.utlity";

export const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "CastError") err = handCastError(err);
  if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  console.log("Error occurred:", err);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}`;
  return new errorHandler(message, 400);
};

export const handCastError = (err) => {
  const message = `Invalid input data ${err.stringValue} because of ${err.reason}`;
  return new errorHandler(message, 400);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    return `Invalid input data: "${el.value}" at path "${el.path}"`;
  });

  const message = errors.join(". ").replace(/\\"/g, '"');
  return new errorHandler(message, 400);
};
