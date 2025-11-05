import { body, param } from 'express-validator';

export const validateUpdateProfile = [
  param('id').isString().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('fullName').optional().isString().trim().notEmpty(),
  body('numberPhone').optional().isString().trim(),
  body('address').optional().isString().trim(),
  body('avatarUrl').optional().isString().trim(),
  body('backgroundUrl').optional().isString().trim(),
];


