import { errorResponse, failResponse, successResponse } from '#root/src/core/response/response.js';
import { loginService, registerService } from './auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return failResponse(res, "email or password can't be empty");

    const result = await loginService(email, password);

    if (!result.success) {
      return failResponse(res, result.message);
    }

    return successResponse(res, 'Login successful', 200, result.tokenData);
  } catch (error) {
    console.error('Login Error:', error);
    return errorResponse(res, error.message || 'Internal server error', 500);
  }
};

export const register = async (req, res) => {
  try {
    const savedUser = await registerService(req.body);

    if (!savedUser.success) return failResponse(res, savedUser.message);

    return successResponse(res, 'user created successfully', 200, savedUser.data);
  } catch (error) {
    console.error(error.message);
    return errorResponse(res, error.message);
  }
};
