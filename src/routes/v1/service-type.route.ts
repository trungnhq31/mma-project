import { Router } from 'express';
import { getServiceTypesTreeByVehicleType } from '../../controllers/serviceType.controller';

const router = Router();

router.get('/vehicle_type/:vehicleTypeId', getServiceTypesTreeByVehicleType);

export default router;

