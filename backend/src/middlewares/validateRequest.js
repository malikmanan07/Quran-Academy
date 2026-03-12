import { sendError } from '../utils/apiResponse.js';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((e) => {
        const key = e.path.join('.');
        errors[key] = e.message;
      });
      return sendError(res, 'Validation failed', errors, 422);
    }
    req.body = result.data;
    next();
  };
};

export default validateRequest;
