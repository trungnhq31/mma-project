import { Router } from 'express';
import { validateRegister, validateLogin, validateLogout, validateChangePassword } from '../../validations/auth.validation';
import { register, login, logout, changePasswordController } from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', validateLogout, logout);
router.patch('/change-password', authenticate, validateChangePassword, changePasswordController);

export default router;


