import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { Recipe } from '../models/Recipe';
import { ApiError } from '../utils/ApiError';

export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ type: 1, name: 1 });

    // Attach recipe count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const recipeCount = await Recipe.countDocuments({
          $or: [{ category: cat._id }, { fitnessCategory: cat._id }],
        });
        return { ...cat.toObject(), recipeCount };
      })
    );

    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getRecipesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }

    const {
      sort = '-createdAt',
      difficulty,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      page = '1',
      limit = '12',
    } = req.query;

    const filter: any = {
      $or: [{ category: category._id }, { fitnessCategory: category._id }],
    };

    if (difficulty) filter.difficulty = difficulty;
    if (minCalories || maxCalories) {
      filter['nutritionSummary.calories'] = {};
      if (minCalories) filter['nutritionSummary.calories'].$gte = Number(minCalories);
      if (maxCalories) filter['nutritionSummary.calories'].$lte = Number(maxCalories);
    }
    if (minProtein || maxProtein) {
      filter['nutritionSummary.protein_g'] = {};
      if (minProtein) filter['nutritionSummary.protein_g'].$gte = Number(minProtein);
      if (maxProtein) filter['nutritionSummary.protein_g'].$lte = Number(maxProtein);
    }

    // Sort mapping
    const sortMap: Record<string, any> = {
      'highest-protein': { 'nutritionSummary.protein_g': -1 },
      'lowest-calories': { 'nutritionSummary.calories': 1 },
      'quickest': { prepTime: 1, cookTime: 1 },
      'newest': { createdAt: -1 },
    };

    const sortOption = sortMap[sort as string] || { createdAt: -1 };
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('category', 'name type icon colorTag slug')
      .populate('fitnessCategory', 'name type icon colorTag slug');

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
