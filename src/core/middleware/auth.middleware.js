import jwt from 'jsonwebtoken';
import { config } from '#config/config.js';
import { failResponse } from '../response/response.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return failResponse(res, 'Not authorized, no token', 401);
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return failResponse(res, 'Token expired, please refresh your token', 401);
    }

    return failResponse(res, 'Not authorized, token failed', 401);
  }
};
