import { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpError'; // Import custom error

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Default status code
  const statusCode = (err as HttpError).statusCode || 500;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
