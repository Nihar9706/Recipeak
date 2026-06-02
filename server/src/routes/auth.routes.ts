import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 */
router.post(
  '/register',
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    })
  ),
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 */
router.post(
  '/login',
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    })
  ),
  login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security: [{ cookieAuth: [] }]
 */
router.get('/me', protect, getMe);

export default router;
