import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateUpdateProfile } from '../../validations/user.validation';
import { updateMyProfile } from '../../controllers/user.controller';

const router = Router();

router.patch('/profile/:id', authenticate, validateUpdateProfile, updateMyProfile);

export default router;


