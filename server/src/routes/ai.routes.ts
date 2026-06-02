import { Router } from 'express';
import { aiSearch, getSearchHistory } from '../controllers/ai.controller';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/ai/search:
 *   post:
 *     tags: [AI]
 *     summary: AI-powered recipe search
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query: { type: string }
 */
router.post('/search', protect, aiSearch);

/**
 * @swagger
 * /api/ai/history:
 *   get:
 *     tags: [AI]
 *     summary: Get AI search history
 *     security: [{ cookieAuth: [] }]
 */
router.get('/history', protect, getSearchHistory);

export default router;
