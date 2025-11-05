import bcrypt from 'bcryptjs';
import { UserModel } from '../models/mongoose';
import { signAccessToken, signRefreshToken } from '../utils/jwt.util';

export async function registerUser(input: {
  username: string;
  password: string;
  email: string;
  fullName: string;
  numberPhone?: string;
  avatarUrl?: string;
  provider?: string;
}) {
  const existingByUsername = await UserModel.findOne({ username: input.username });
  if (existingByUsername) {
    const err = new Error('Username already exists');
    (err as any).status = 409;
    (err as any).code = 'USERNAME_EXISTS';
    throw err;
  }

  const existingByEmail = await UserModel.findOne({ email: input.email });
  if (existingByEmail) {
    const err = new Error('Email already exists');
    (err as any).status = 409;
    (err as any).code = 'EMAIL_EXISTS';
    throw err;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const created = await UserModel.create({
    username: input.username,
    passwordHash,
    email: input.email,
    fullName: input.fullName,
    numberPhone: input.numberPhone,
    avatarUrl: input.avatarUrl,
    provider: input.provider || 'local',
    isActive: true,
  });

  const userId = String((created as any)._id);
  const payload = { sub: userId, username: created.username, email: created.email };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    userId,
    email: created.email,
    fullName: created.fullName,
    token,
    refreshToken,
  };
}


