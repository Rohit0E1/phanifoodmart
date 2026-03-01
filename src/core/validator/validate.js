import { ZodError } from 'zod';
import { errorResponse } from '../response/response.js';
export const validate = (parseFn) => async (req, res, next) => {
  try {
    await parseFn(req);
    return next();
  } catch (error) {
    console.error('Validation error:', error);
    const message =
      error instanceof ZodError
        ? error.issues[0]?.message || 'Invalid input'
        : error.message || 'Server Error';
    return errorResponse(res, message, 400);
  }
};
