import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppointmentModel } from '../models/mongoose';
import { success, error } from '../utils/response.util';
import { Types } from 'mongoose';

export async function createAppointment(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation error', 'VALIDATION_ERROR');
  }

  const {
    customerFullName,
    customerPhoneNumber,
    customerEmail,
    vehicleTypeId,
    vehicleNumberPlate,
    vehicleKmDistances,
    userAddress,
    serviceMode,
    scheduledAt,
    notes,
    serviceTypeIds,
  } = req.body;

  const created = await AppointmentModel.create({
    customerFullName,
    customerPhoneNumber,
    customerEmail,
    vehicleTypeId,
    vehicleNumberPlate,
    vehicleKmDistances,
    userAddress,
    serviceMode,
    scheduledAt,
    notes,
    status: 'PENDING',
    customerId: req.user?.sub,
    serviceTypeIds: Array.isArray(serviceTypeIds) ? serviceTypeIds : [],
  });

  return success(res, String((created as any)._id), 'Appointment created');
}

export async function getMyAppointmentHistory(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    return error(res, 401, 'Unauthorized', 'UNAUTHORIZED');
  }

  const page = Number(req.query.page ?? 0) || 0;
  const pageSize = Number(req.query.pageSize ?? 10) || 10;

  const filter: any = { customerId: userId };

  const [items, total] = await Promise.all([
    AppointmentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .populate('vehicleTypeId', 'vehicleTypeName')
      .lean(),
    AppointmentModel.countDocuments(filter),
  ]);

  // Map minimal fields for FE history list
  const data = items.map((a: any) => ({
    appointmentId: String(a._id),
    customerFullName: a.customerFullName,
    customerPhoneNumber: a.customerPhoneNumber,
    customerEmail: a.customerEmail,
    vehicleTypeId: String(a.vehicleTypeId?._id || a.vehicleTypeId),
    vehicleTypeName: a.vehicleTypeId?.vehicleTypeName,
    vehicleNumberPlate: a.vehicleNumberPlate,
    serviceMode: a.serviceMode,
    scheduledAt: a.scheduledAt,
    status: a.status,
  }));

  return success(res, { items: data, page, pageSize, total }, 'Appointment history');
}

