import { Request, Response } from 'express';
import { success } from '../utils/response.util';
import { ServiceMode } from '../models/enums/ServiceMode';

export async function getServiceModes(_req: Request, res: Response) {
  return success(res, Object.values(ServiceMode), 'Service modes retrieved');
}

