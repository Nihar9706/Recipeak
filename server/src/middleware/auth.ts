import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.token;

    // Also check Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Not authenticated. Please log in.');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized('User no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid or expired token.'));
    }
  }
};

export const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    next(ApiError.forbidden('Admin access required.'));
    return;
  }
  next();
};
