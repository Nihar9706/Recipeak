import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getSavedRecipes,
  saveRecipe,
  unsaveRecipe,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security: [{ cookieAuth: [] }]
 */
router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security: [{ cookieAuth: [] }]
 */
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /api/users/saved:
 *   get:
 *     tags: [Users]
 *     summary: Get saved recipes
 *     security: [{ cookieAuth: [] }]
 */
router.get('/saved', protect, getSavedRecipes);

router.post('/saved/:recipeId', protect, saveRecipe);
router.delete('/saved/:recipeId', protect, unsaveRecipe);

export default router;
