import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AISearchLog } from '../models/AISearchLog';
import { Recipe } from '../models/Recipe';
import { Category } from '../models/Category';
import { searchRecipesWithAI } from '../services/ai.service';
import { ApiError } from '../utils/ApiError';

export const aiSearch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw ApiError.badRequest('Please provide a search query.');
    }

    // Fetch all recipes with category info for context
    const recipes = await Recipe.find()
      .populate('category', 'name type')
      .select('title description tags nutritionSummary prepTime difficulty category');

    const categories = await Category.find();

    // Call AI service
    const aiResponse = await searchRecipesWithAI(query.trim(), recipes, categories);

    // Try to match recipe IDs from AI response
    const matchedRecipeIds: string[] = [];
    for (const recipe of recipes) {
      if (
        aiResponse.toLowerCase().includes(recipe.title.toLowerCase())
      ) {
        matchedRecipeIds.push(recipe._id.toString());
      }
    }

    // Log the search
    await AISearchLog.create({
      user: req.user!._id,
      query: query.trim(),
      responseSummary: aiResponse,
      recipeIds: matchedRecipeIds,
    });

    // Get full recipe data for matched recipes
    const matchedRecipes = await Recipe.find({
      _id: { $in: matchedRecipeIds },
    }).populate('category', 'name colorTag slug');

    res.json({
      success: true,
      data: {
        response: aiResponse,
        recipes: matchedRecipes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const history = await AISearchLog.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('recipeIds', 'title imageUrl');

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
