import jwt from 'jsonwebtoken';
import { config } from '#config/config.js';

const tokenGenerate = (payload, secret, expiresIn = '6h') => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const generateToken = (user) => {
  try {
    const { _id, email, fullName, phoneNumber, active } = user;

    const payload = {
      id: _id,
      email,
      fullName,
      phoneNumber,
      active,
    };

    const token = tokenGenerate(payload, config.JWT_SECRET);
    const refreshToken = tokenGenerate(
      { id: _id, type: 'refresh' },
      config.JWT_REFRESH_SECRET,
      '24h'
    );
    const tokenExpiryTime = Date.now() + 1000 * 60 * 60 * 6;
    const refreshTokenExpiryTime = Date.now() + 1000 * 60 * 60 * 24;

    const tokenResponse = {
      token,
      tokenExpiryTime,
      refreshTokenExpiryTime,
      refreshToken,
      user: { ...payload },
    };

    return { success: true, data: tokenResponse };
  } catch (err) {
    console.error('Token Generation Error:', err);
    return {
      success: false,
      message: 'An error occurred while generating the authentication token',
    };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      return { success: false, message: 'Invalid token type' };
    }

    return { success: true, data: decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, message: 'Refresh token has expired, please login again' };
    }
    return { success: false, message: 'Invalid refresh token' };
  }
};
