import { Router } from 'express';
import { createAppointment } from '../../controllers/appointment.controller';
import { validateCreateAppointment } from '../../validations/appointment.validation';

const router = Router();

router.post('/', validateCreateAppointment, createAppointment);

export default router;

