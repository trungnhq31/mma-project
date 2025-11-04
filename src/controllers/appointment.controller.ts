import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppointmentModel } from '../models/mongoose';
import { success, error } from '../utils/response.util';

export async function createAppointment(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation error', 'VALIDATION_ERROR');
  }

  const {
    customerId,
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
  } = req.body;

  const created = await AppointmentModel.create({
    // customerId is optional & not persisted in current Appointment model
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
  });

  return success(res, String((created as any)._id), 'Appointment created');
}

