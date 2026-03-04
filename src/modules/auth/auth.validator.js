import { validate } from '#core/validator/validate.js';
import { z } from 'zod';
import { USER_ROLES } from '#root/src/core/constants/common.js';

const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .nonempty('Email cannot be empty')
  .email('Invalid email address format')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .nonempty('Password cannot be empty')
  .min(6, 'Password must be at least 6 characters long')
  .max(128, 'Password must not exceed 128 characters');

const phoneSchema = z
  .string({
    invalid_type_error: 'Phone number must be a string',
  })
  .optional();

const nameSchema = (field) =>
  z
    .string({
      required_error: `${field} is required`,
      invalid_type_error: `${field} must be a string`,
    })
    .nonempty(`${field} cannot be empty`)
    .min(1, `${field} must be at least 1 character long`)
    .max(50, `${field} must not exceed 50 characters`)
    .trim();

export const loginValidator = validate(async (req) => {
  const bodySchema = z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })
    .strict();

  bodySchema.parse(req.body);
});

export const registerValidator = validate(async (req) => {
  const allowedRoles = Object.values(USER_ROLES);

  const bodySchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    fullName: nameSchema('Full name'),
    phoneNumber: phoneSchema,
    role: z
      .enum(allowedRoles, {
        invalid_type_error: `Invalid role. Please select one of: ${allowedRoles.join(', ')}`,
      })
      .optional()
      .default('customer'),
    active: z.boolean({ invalid_type_error: 'Active must be a boolean' }).optional().default(true),
  });

  bodySchema.parse(req.body);
});

export const refreshTokenValidator = validate(async (req) => {
  const bodySchema = z
    .object({
      refreshToken: z
        .string({
          required_error: 'Refresh token is required',
          invalid_type_error: 'Refresh token must be a string',
        })
        .nonempty('Refresh token cannot be empty'),
    })
    .strict();

  bodySchema.parse(req.body);
});
