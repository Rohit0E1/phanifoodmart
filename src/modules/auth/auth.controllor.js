import { errorResponse, failResponse, successResponse } from '#root/src/core/response/response.js';
import { loginService, registerService, refreshTokenService } from './auth.service.js';

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

export const refreshToken = async (req, res) => {
  console.log('refresh token ');
  try {
    const { refreshToken } = req.body;

    const result = await refreshTokenService(refreshToken);

    if (!result.success) {
      return failResponse(res, result.message, 401);
    }

    return successResponse(res, 'Token refreshed successfully', 200, result.tokenData);
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return errorResponse(res, error.message || 'Internal server error', 500);
  }
};
