import { Router } from 'express';
import vehicleTypeRouter from './v1/vehicle-type.route';
import serviceModeRouter from './v1/service-mode.route';
import serviceTypeRouter from './v1/service-type.route';
import appointmentRouter from './v1/appointment.route';
import authRouter from './v1/auth.route';
import userRouter from './v1/user.route';
import paymentRouter from './v1/payment.route';
import { authenticate } from '../middlewares/auth.middleware';

export const v1Router = Router();

// Public auth routes
v1Router.use('/auth', authRouter);
// Public payment webhook
v1Router.use('/payment', paymentRouter);

// Protected routes
v1Router.use('/vehicle-type', authenticate, vehicleTypeRouter);
v1Router.use('/appointment', authenticate, serviceModeRouter); // for /appointment/service-mode
v1Router.use('/service-type', authenticate, serviceTypeRouter);
v1Router.use('/appointment', authenticate, appointmentRouter);
v1Router.use('/user', userRouter);

