import env from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  if (env.NODE_ENV !== 'production') {
    console.error('Error:', err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
    errors: err.errors || {},
  });
};

export default errorHandler;
