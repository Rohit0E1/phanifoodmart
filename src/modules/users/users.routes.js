import { Router } from 'express';
import { createUserController } from './users.controller.js';

export const userRoutes = Router();

userRoutes.post('/', createUserController);
