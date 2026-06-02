import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  getRecipesByCategory,
} from '../controllers/category.controller';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories with recipe counts
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get a single category
 */
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /api/categories/{id}/recipes:
 *   get:
 *     tags: [Categories]
 *     summary: Get recipes by category with filters
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [highest-protein, lowest-calories, quickest, newest] }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [Easy, Medium, Hard] }
 *       - in: query
 *         name: minCalories
 *         schema: { type: number }
 *       - in: query
 *         name: maxCalories
 *         schema: { type: number }
 */
router.get('/:id/recipes', getRecipesByCategory);

export default router;
