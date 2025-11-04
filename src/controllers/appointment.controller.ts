import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Appointment } from '../models';
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

  const created = await Appointment.create({
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

  return success(res, created.id, 'Appointment created');
}

