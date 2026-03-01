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
    const existingUser = await User.countDocuments({
      $or: [{ email: email }, { phoneNumber: phone }],
      isDeleted: false,
    });

    if (existingUser > 0) return { success: false, message: 'user already exists' };

    return { success: true, message: 'new user' };
  } catch (error) {
    console.log('isExistingUser server error: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) return { success: false, message: 'user not found' };

    return { success: true, data: user };
  } catch (error) {
    console.error('getUserById error: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = '',
  role,
  active,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  try {
    const query = { isDeleted: false };

    if (role) query.role = role;
    if (active !== undefined) query.active = active === 'true' || active === true;

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phoneNumber: regex },
      ];
    }

    const allowedSortFields = ['firstName', 'lastName', 'email', 'role', 'createdAt', 'active'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)).sort(sort),
      User.countDocuments(query),
    ]);

    const appliedFilters = {};
    if (search) appliedFilters.search = search;
    if (role) appliedFilters.role = role;
    if (active !== undefined) appliedFilters.active = active === 'true' || active === true;
    appliedFilters.sortBy = sortField;
    appliedFilters.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    return {
      success: true,
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      appliedFilters,
    };
  } catch (error) {
    console.error('getAllUsers error: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const updateUserById = async (id, body) => {
  try {
    const payload = {};
    if (body.firstName !== undefined) payload.firstName = body.firstName;
    if (body.lastName !== undefined) payload.lastName = body.lastName;
    if (body.phoneNumber !== undefined) payload.phoneNumber = body.phoneNumber;
    if (body.email !== undefined) payload.email = body.email;
    if (body.role !== undefined) payload.role = body.role;
    if (body.active !== undefined) payload.active = body.active;

    if (Object.keys(payload).length === 0) {
      return { success: false, message: 'no valid fields to update' };
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return { success: false, message: 'user not found' };

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('updateUserById error: ', error.message);
    return { success: false, message: 'server error' };
  }
};

export const deleteUserById = async (id) => {
  try {
    const deletedUser = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, active: false } },
      { new: true }
    );

    if (!deletedUser) return { success: false, message: 'user not found' };

    return { success: true, message: 'user deleted successfully' };
  } catch (error) {
    console.error('deleteUserById error: ', error.message);
    return { success: false, message: 'server error' };
  }
};
