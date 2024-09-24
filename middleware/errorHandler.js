const errorHandler = (err, req, res, next) => {
  // Set a generic status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Customize response based on the error type
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.details,
    });
  } else if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: err.message,
    });
  } else if (err.name === "NotFound") {
    return res.status(404).json({
      success: false,
      error: "Not Found",
      message: err.message,
    });
  }

  // Send the error response for other types of errors
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
