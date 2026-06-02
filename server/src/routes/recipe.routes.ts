import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
} from '../controllers/recipe.controller';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: Get all recipes with filtering, sorting, and pagination
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [highest-protein, lowest-calories, quickest, newest] }
 */
router.get('/', getAllRecipes);

/**
 * @swagger
 * /api/recipes/featured:
 *   get:
 *     tags: [Recipes]
 *     summary: Get featured recipes (random selection)
 */
router.get('/featured', getFeaturedRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     tags: [Recipes]
 *     summary: Get recipe by ID with related recipes
 */
router.get('/:id', getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     tags: [Recipes]
 *     summary: Create a recipe (admin only)
 *     security: [{ cookieAuth: [] }]
 */
router.post('/', protect, adminOnly, createRecipe);

router.put('/:id', protect, adminOnly, updateRecipe);
router.delete('/:id', protect, adminOnly, deleteRecipe);

export default router;
