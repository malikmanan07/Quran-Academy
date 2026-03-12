export const sendSuccess = (res, message = 'Success', data = {}, meta = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendCreated = (res, message = 'Created', data = {}) => {
  return sendSuccess(res, message, data, {}, 201);
};

export const sendError = (res, message = 'Error', errors = {}, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
