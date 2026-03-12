import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AppError from '../utils/appError.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('Access denied', 401);

    const verified = jwt.verify(token, env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    next(new AppError('Invalid token', 401));
  }
};

export default authMiddleware;
