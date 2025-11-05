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

export async function loginUser(input: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) {
    const err = new Error('Invalid email or password');
    (err as any).status = 401;
    (err as any).code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid email or password');
    (err as any).status = 401;
    (err as any).code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const payload = { sub: String((user as any)._id), username: user.username, email: user.email };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    userId: String((user as any)._id),
    authenticated: true,
    token,
    refreshToken,
    isAdmin: Boolean((user as any).isAdmin),
  };
}

export async function changePassword(input: { userId: string; oldPassword: string; newPassword: string }) {
  const user = await UserModel.findById(input.userId);
  if (!user) {
    const err = new Error('User not found');
    (err as any).status = 404;
    (err as any).code = 'NOT_FOUND';
    throw err;
  }
  const ok = await bcrypt.compare(input.oldPassword, user.passwordHash);
  if (!ok) {
    const err = new Error('Old password is incorrect');
    (err as any).status = 400;
    (err as any).code = 'WRONG_OLD_PASSWORD';
    throw err;
  }
  user.passwordHash = await bcrypt.hash(input.newPassword, 10);
  await user.save();
}


