import { Router } from 'express';
import { validateRegister, validateLogin, validateLogout } from '../../validations/auth.validation';
import { register, login, logout } from '../../controllers/auth.controller';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', validateLogout, logout);

export default router;


