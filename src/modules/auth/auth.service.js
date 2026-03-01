import { generateToken } from '#root/src/core/util/token.js';
import { findUserByEmail, isExistingUser, saveUserData } from '../users/users.service.js';

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
    const { email, password, firstName, lastName, phoneNumber, active = true, role } = body;

    const existingUserCheck = await isExistingUser(email, phoneNumber);

    if (!existingUserCheck.success) return { success: false, message: existingUserCheck.message };

    const payload = {
      email: email,
      password: password,
      firstName,
      lastName,
      phoneNumber,
      active,
      role,
    };

    const user = await saveUserData(payload);

    if (!user.success) return { success: false, message: user.message };

    return { success: true, data: user.data };
  } catch (error) {
    console.error('server error on registerService : ', error.message);
    return { success: false, message: 'server error' };
  }
};
