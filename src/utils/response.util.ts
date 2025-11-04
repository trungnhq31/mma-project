import { Response } from 'express';

export function success<T>(res: Response, data: T, message = 'Success') {
  return res.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    errorCode: null,
  });
}

export function error(res: Response, status: number, message: string, errorCode?: string) {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    timestamp: new Date().toISOString(),
    errorCode: errorCode || null,
  });
}

