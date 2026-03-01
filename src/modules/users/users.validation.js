import { validate } from '#core/validator/validate.js';
import { z } from 'zod';
import { USER_ROLES } from '#root/src/core/constants/common.js';

const allowedRoles = Object.values(USER_ROLES);

const phoneSchema = z
  .string({ invalid_type_error: 'Phone number must be a string' })
  .min(1, 'Phone number is required')
  .max(10, 'Phone number must not exceed 10 digits')
  .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format')
  .trim();

const nameSchema = (field) =>
  z
    .string({ invalid_type_error: `${field} must be a string` })
    .min(1, `${field} must be at least 1 character long`)
    .max(50, `${field} must not exceed 50 characters`)
    .trim();

export const updateUserValidator = validate(async (req) => {
  const bodySchema = z
    .object({
      firstName: nameSchema('First name').optional(),
      lastName: nameSchema('Last name').optional(),
      email: z.string().email('Invalid email address format').toLowerCase().trim().optional(),
      phoneNumber: phoneSchema.optional(),
      role: z
        .enum(allowedRoles, {
          invalid_type_error: `Invalid role. Please select one of: ${allowedRoles.join(', ')}`,
        })
        .optional(),
      active: z.boolean({ invalid_type_error: 'Active must be a boolean' }).optional(),
    })
    .strict();

  bodySchema.parse(req.body);
});

export const paramIdValidator = validate(async (req) => {
  const paramsSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  });

  paramsSchema.parse(req.params);
});
