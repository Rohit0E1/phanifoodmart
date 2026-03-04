import { generateToken, verifyRefreshToken } from '#root/src/core/util/token.js';
import { findUserByEmail, isExistingUser, saveUserData } from '../users/users.service.js';
import { getUserById } from '../users/users.service.js';

export const loginService = async (email, password) => {
  try {
    const userResult = await findUserByEmail(email);

    if (!userResult.success) return { success: false, message: userResult.message };

    const userData = userResult.data;

    const isMatch = await userData.comparePassword(password);

    if (!isMatch) return { success: false, message: 'invalid credentials' };

    const tokenResult = generateToken(userData.toObject());

    if (!tokenResult.success) {
      return { success: false, message: tokenResult.message };
    }

    return { success: true, tokenData: tokenResult.data };
  } catch (error) {
    console.error('Login Service Error:', error);
    return { success: false, message: 'server error' };
  }
};

export const registerService = async (body) => {
  try {
    const { email, password, fullName, phoneNumber, active = true, role } = body;

    const existingUserCheck = await isExistingUser(email, phoneNumber);

    if (!existingUserCheck.success) return { success: false, message: existingUserCheck.message };

    const payload = {
      email: email,
      password: password,
      fullName,
      phoneNumber,
      active,
      role,
    };

    const user = await saveUserData(payload);

    if (!user.success) return { success: false, message: user.message };

    const tokenResult = generateToken(payload);

    if (!tokenResult.success) {
      return { success: false, message: tokenResult.message };
    }

    return { success: true, data: tokenResult };
  } catch (error) {
    console.error('server error on registerService : ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const refreshTokenService = async (refreshToken) => {
  try {
    const verifyResult = verifyRefreshToken(refreshToken);

    if (!verifyResult.success) {
      return { success: false, message: verifyResult.message };
    }

    const userId = verifyResult.data.id;

    const userResult = await getUserById(userId);

    if (!userResult.success) {
      return { success: false, message: 'User not found' };
    }

    const userData = userResult.data;

    if (!userData.active) {
      return { success: false, message: 'User account is deactivated' };
    }

    const tokenResult = generateToken(userData.toObject());

    if (!tokenResult.success) {
      return { success: false, message: tokenResult.message };
    }

    return { success: true, tokenData: tokenResult.data };
  } catch (error) {
    console.error('Refresh Token Service Error:', error);
    return { success: false, message: 'server error' };
  }
};
