import { errorResponse, failResponse, successResponse } from '#root/src/core/response/response.js';
import {
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  updateUserById as updateUserByIdService,
  deleteUserById as deleteUserByIdService,
} from './users.service.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role, active, sortBy, sortOrder } = req.query;

    const result = await getAllUsersService({
      page,
      limit,
      search,
      role,
      active,
      sortBy,
      sortOrder,
    });

    if (!result.success) return failResponse(res, result.message);

    return successResponse(res, 'Users fetched successfully', 200, {
      users: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      appliedFilters: result.appliedFilters,
    });
  } catch (error) {
    console.error('getAllUsers controller error:', error.message);
    return errorResponse(res, 'server error');
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getUserByIdService(id);

    if (!result.success) return failResponse(res, result.message);

    return successResponse(res, 'User fetched successfully', 200, result.data);
  } catch (error) {
    console.error('getUserById controller error:', error.message);
    return errorResponse(res, 'server error');
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateUserByIdService(id, req.body);

    if (!result.success) return failResponse(res, result.message);

    return successResponse(res, 'User updated successfully', 200, result.data);
  } catch (error) {
    console.error('updateUser controller error:', error.message);
    return errorResponse(res, 'server error');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteUserByIdService(id);

    if (!result.success) return failResponse(res, result.message);

    return successResponse(res, result.message, 200);
  } catch (error) {
    console.error('deleteUser controller error:', error.message);
    return errorResponse(res, 'server error');
  }
};
