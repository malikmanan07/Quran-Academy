import AppError from '../utils/appError.js';

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Access forbidden', 403);
    }
    next();
  };
};

export default roleMiddleware;
