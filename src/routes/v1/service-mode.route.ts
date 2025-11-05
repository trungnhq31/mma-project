import { Router } from 'express';
import { getServiceModes } from '../../controllers/serviceMode.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/appointment/service-mode:
 *   get:
 *     summary: Lay danh sach service mode
 *     tags: [ServiceMode]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/service-mode', getServiceModes);

export default router;

