import { Router } from 'express';
import { getVehicleTypes } from '../../controllers/vehicleType.controller';

const router = Router();

router.get('/', getVehicleTypes);

export default router;

