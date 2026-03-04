import express from 'express';
import { loginValidator, registerValidator, refreshTokenValidator } from './auth.validator.js';
import { login, register, refreshToken } from './auth.controllor.js';

const route = express.Router();

route.post('/login', loginValidator, login);

route.post('/register', registerValidator, register);

route.post('/refresh-token', refreshTokenValidator, refreshToken);

export const authRoutes = route;
