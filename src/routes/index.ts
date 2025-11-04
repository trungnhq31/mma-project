import { Router } from 'express';
import vehicleTypeRouter from './v1/vehicle-type.route';
import serviceModeRouter from './v1/service-mode.route';
import serviceTypeRouter from './v1/service-type.route';
import appointmentRouter from './v1/appointment.route';

export const v1Router = Router();

v1Router.use('/vehicle-type', vehicleTypeRouter);
v1Router.use('/appointment', serviceModeRouter); // for /appointment/service-mode
v1Router.use('/service-type', serviceTypeRouter);
v1Router.use('/appointment', appointmentRouter);

