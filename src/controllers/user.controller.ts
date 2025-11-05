import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/mongoose';
import { success, error } from '../utils/response.util';

export async function updateMyProfile(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation error', 'VALIDATION_ERROR');
  }

  const authUserId = req.user?.sub;
  const { id } = req.params as { id: string };
  if (!authUserId || authUserId !== id) {
    return error(res, 403, 'Forbidden', 'FORBIDDEN');
  }

  const { email, fullName, numberPhone, address, avatarUrl } = req.body as Partial<{
    email: string;
    fullName: string;
    numberPhone: string;
    address: string;
    avatarUrl: string;
  }>;

  const update: any = {};
  if (email !== undefined) update.email = email;
  if (fullName !== undefined) update.fullName = fullName;
  if (numberPhone !== undefined) update.numberPhone = numberPhone;
  if (address !== undefined) update.address = address;
  if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;

  const updated = await UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) {
    return error(res, 404, 'User not found', 'NOT_FOUND');
  }

  const data = {
    userId: String(updated._id),
    email: updated.email,
    fullName: updated.fullName,
    numberPhone: updated.numberPhone,
    address: (updated as any).address,
    avatarUrl: updated.avatarUrl,
  };

  return success(res, data, 'Profile updated');
}

export async function getMyProfile(req: Request, res: Response) {
  const authUserId = req.user?.sub;
  const { id } = req.params as { id: string };
  if (!authUserId || authUserId !== id) {
    return error(res, 403, 'Forbidden', 'FORBIDDEN');
  }

  const found = await UserModel.findById(id).lean();
  if (!found) {
    return error(res, 404, 'User not found', 'NOT_FOUND');
  }

  const data = {
    userId: String(found._id),
    email: found.email,
    fullName: found.fullName,
    numberPhone: found.numberPhone,
    address: (found as any).address,
    avatarUrl: found.avatarUrl,
  };

  return success(res, data, 'Profile');
}


