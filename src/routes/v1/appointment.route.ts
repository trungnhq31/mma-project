import { Router } from 'express';
import { createAppointment, getMyAppointmentHistory } from '../../controllers/appointment.controller';
import { validateCreateAppointment } from '../../validations/appointment.validation';

const router = Router();

router.post('/', validateCreateAppointment, createAppointment);
router.get('/history', getMyAppointmentHistory);

export default router;

