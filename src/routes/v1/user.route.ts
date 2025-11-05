import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateUpdateProfile } from '../../validations/user.validation';
import { getMyProfile, updateMyProfile } from '../../controllers/user.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/user/profile/{id}:
 *   patch:
 *     summary: Cap nhat ho so nguoi dung
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Cap nhat thanh cong
 */
router.patch('/profile/:id', authenticate, validateUpdateProfile, updateMyProfile);

/**
 * @openapi
 * /api/v1/user/profile/{id}:
 *   get:
 *     summary: Lay ho so nguoi dung
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/profile/:id', authenticate, getMyProfile);

export default router;


