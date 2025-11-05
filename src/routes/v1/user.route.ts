import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateUpdateProfile } from '../../validations/user.validation';
import { getMyProfile, updateMyProfile } from '../../controllers/user.controller';

const router = Router();

router.patch('/profile/:id', authenticate, validateUpdateProfile, updateMyProfile);
router.get('/profile/:id', authenticate, getMyProfile);

export default router;


