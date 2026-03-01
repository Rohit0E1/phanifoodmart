import { User } from './users.model.js';

export const createUserService = async (userData) => {
  return { id: 1, ...userData };
};

export const findUserByEmail = async (email) => {
  try {
    const userData = await User.findOne({ email: email, isDeleted: false }).select('+password');

    if (!userData) return { success: false, message: 'user not found' };

    return { success: true, data: userData };
  } catch (error) {
    console.log('user.service findUserByEmail failed: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const saveUserData = async (payload) => {
  try {
    const user = new User(payload);
    const newUser = await user.save();

    if (!newUser) return { success: false, message: 'unable to save user data' };

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return { success: true, message: 'user saved successfully', data: userResponse };
  } catch (error) {
    console.error('saveUserData service error: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const isExistingUser = async (email, phone) => {
  try {
    const exitingUser = User.countDocuments({ $or: { email: email, phoneNumber: phone } }).lean();

    if (exitingUser > 0) return { success: false, message: 'user already exists' };

    return { success: true, message: 'new user' };
  } catch (error) {
    console.log(' isExistingUser server error: ', error.message);
    return { success: false, message: 'server error' };
  }
};
