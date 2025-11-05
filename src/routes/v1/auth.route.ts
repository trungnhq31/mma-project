import { Router } from 'express';
import { validateRegister, validateLogin, validateLogout, validateChangePassword } from '../../validations/auth.validation';
import { register, login, logout, changePasswordController } from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Dang ky tai khoan
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               fullName: { type: string }
 *             required: [username, email, password, fullName]
 *     responses:
 *       201:
 *         description: Tao tai khoan thanh cong
 */
router.post('/register', validateRegister, register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Dang nhap
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *             required: [username, password]
 *     responses:
 *       200:
 *         description: Dang nhap thanh cong
 */
router.post('/login', validateLogin, login);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Dang xuat
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Dang xuat thanh cong
 */
router.post('/logout', validateLogout, logout);
router.patch('/change-password', authenticate, validateChangePassword, changePasswordController);

export default router;


