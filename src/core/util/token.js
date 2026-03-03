import jwt from 'jsonwebtoken';
import { config } from '#config/config.js';
const tokenGenerate = (payload, expiresIn = '6h') => {
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn });
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

    const token = tokenGenerate(payload);
    const refreshToken = tokenGenerate({ id: _id, type: 'refresh' }, '24h');
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
