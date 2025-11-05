import { Router } from 'express';
import { getVehicleTypes } from '../../controllers/vehicleType.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/vehicle-type:
 *   get:
 *     summary: Lay danh sach loai xe
 *     tags: [VehicleType]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', getVehicleTypes);

export default router;

