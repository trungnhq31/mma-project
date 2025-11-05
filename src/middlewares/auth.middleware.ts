import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { error } from '../utils/response.util';

export interface AuthUser {
  sub: string;
  username?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return error(res, 401, 'Unauthorized', 'UNAUTHORIZED');
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return error(res, 500, 'JWT_SECRET is not configured', 'SERVER_CONFIG');
  }
  try {
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = payload;
    return next();
  } catch {
    return error(res, 401, 'Invalid or expired token', 'UNAUTHORIZED');
  }
}


