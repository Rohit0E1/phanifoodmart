import express from 'express';
import { loginValidator, registerValidator } from './auth.validator.js';
import { login, register } from './auth.controllor.js';

const route = express.Router();

route.post('/login', loginValidator, login);

route.post('/register', registerValidator, register);

export const authRoutes = route;
