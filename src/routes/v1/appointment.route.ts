import { Router } from 'express';
import { createAppointment, getMyAppointmentHistory, getAppointmentDetail } from '../../controllers/appointment.controller';
import { validateCreateAppointment } from '../../validations/appointment.validation';

const router = Router();

router.post('/', validateCreateAppointment, createAppointment);
router.get('/history', getMyAppointmentHistory);
router.get('/:id', getAppointmentDetail);

export default router;

