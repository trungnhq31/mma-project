import { Router } from 'express';
import { getServiceModes } from '../../controllers/serviceMode.controller';

const router = Router();

router.get('/service-mode', getServiceModes);

export default router;

