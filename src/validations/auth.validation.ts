import { body } from 'express-validator';

export const validateRegister = [
  body('username').isString().trim().notEmpty(),
  body('password').isString().isLength({ min: 6 }),
  body('email').isEmail().normalizeEmail(),
  body('fullName').isString().trim().notEmpty(),
  body('numberPhone').optional().isString().trim(),
  body('avatarUrl').optional().isString().trim(),
  body('provider').optional().isString().trim(),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
];

export const validateLogout = [
  body('userId').isString().trim().notEmpty(),
];

export const validateChangePassword = [
  body('oldPassword').isString().isLength({ min: 6 }),
  body('newPassword').isString().isLength({ min: 8 }),
];


