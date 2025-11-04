import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { error } from '../utils/response.util';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error('Unhandled error', { error: err });
  return error(res, err.status || 500, err.message || 'Internal Server Error', err.code);
}

