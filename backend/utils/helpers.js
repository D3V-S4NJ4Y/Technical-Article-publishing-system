// Async error wrapper to catch async errors automatically
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Response helper functions
export const sendResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: 'error',
    message
  });
};