import { Router } from 'express';
import { createAppointment, getMyAppointmentHistory, getAppointmentDetail } from '../../controllers/appointment.controller';
import { validateCreateAppointment } from '../../validations/appointment.validation';

const router = Router();

/**
 * @openapi
 * /api/v1/appointment:
 *   post:
 *     summary: Tao cuoc hen
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Tao thanh cong
 */
router.post('/', validateCreateAppointment, createAppointment);

/**
 * @openapi
 * /api/v1/appointment/history:
 *   get:
 *     summary: Lich su cuoc hen cua toi
 *     tags: [Appointment]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/history', getMyAppointmentHistory);

/**
 * @openapi
 * /api/v1/appointment/{id}:
 *   get:
 *     summary: Chi tiet cuoc hen
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', getAppointmentDetail);

export default router;

