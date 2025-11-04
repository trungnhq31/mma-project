import { Appointment } from '../models';

export async function createAppointmentRecord(payload: any) {
  const created = await Appointment.create(payload);
  return created.id;
}

