import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    res.status(400).json({
      success: false,
      error: `Duplicate value for field: ${field}`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map(
      (e: any) => e.message
    );
    res.status(400).json({
      success: false,
      error: messages.join(', '),
    });
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid resource ID format.',
    });
    return;
  }

  // Fallback
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};
