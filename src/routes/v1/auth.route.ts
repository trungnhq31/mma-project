import { Router } from 'express';
import { validateRegister } from '../../validations/auth.validation';
import { register } from '../../controllers/auth.controller';

const router = Router();

router.post('/register', validateRegister, register);

export default router;


