import jwt from 'jsonwebtoken';

type JwtPayload = Record<string, any>;

const ACCESS_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '7d';

export function signAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES_IN });
}


