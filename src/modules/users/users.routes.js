import { Router } from 'express';
import { protect } from '#root/src/core/middleware/auth.middleware.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from './users.controller.js';
import { updateUserValidator, paramIdValidator } from './users.validation.js';

export const userRoutes = Router();

userRoutes.get('/', protect, getAllUsers);
userRoutes.get('/:id', protect, paramIdValidator, getUserById);
userRoutes.patch('/:id', protect, paramIdValidator, updateUserValidator, updateUser);
userRoutes.delete('/:id', protect, paramIdValidator, deleteUser);
