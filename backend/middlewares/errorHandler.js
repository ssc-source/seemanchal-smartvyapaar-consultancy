/**
 * Global Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  // Set default status code and status if they don't exist
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for developers
  console.error('🔥 [Error Handler]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Handle specific known errors (like Sequelize Validation)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  // Send generic response for production, detailed for development
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Production: Don't leak error details
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.isOperational ? err.message : 'Something went wrong on the server',
    });
  }
};
