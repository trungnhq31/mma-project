import { Router } from 'express';
import { getServiceTypesTreeByVehicleType } from '../../controllers/serviceType.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/service-type/vehicle_type/{vehicleTypeId}:
 *   get:
 *     summary: Lay cay dich vu theo loai xe
 *     tags: [ServiceType]
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/vehicle_type/:vehicleTypeId', getServiceTypesTreeByVehicleType);

export default router;

