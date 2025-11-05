import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { success, error } from '../utils/response.util';
import { registerUser } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation error', 'VALIDATION_ERROR');
  }

  try {
    const { username, password, email, fullName, numberPhone, avatarUrl, provider } = req.body;
    const result = await registerUser({
      username,
      password,
      email,
      fullName,
      numberPhone,
      avatarUrl,
      provider,
    });
    return success(res, result, 'Registered successfully');
  } catch (err: any) {
    return error(res, err.status || 500, err.message || 'Internal Server Error', err.code);
  }
}


