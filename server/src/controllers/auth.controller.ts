import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const signToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

const sendTokenResponse = (res: Response, user: any, statusCode: number) => {
  const token = signToken(user._id.toString());

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user: userObj },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.badRequest('Email already registered.');
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Please provide email and password.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    sendTokenResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};

export const logout = (
  _req: Request,
  res: Response
): void => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate('savedRecipes');
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};
