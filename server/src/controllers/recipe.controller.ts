import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe';
import { ApiError } from '../utils/ApiError';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      search,
      difficulty,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      maxPrepTime,
      sort = 'newest',
      page = '1',
      limit = '12',
    } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
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

    if (maxPrepTime) {
      filter.prepTime = { $lte: Number(maxPrepTime) };
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

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
      .populate('category', 'name type icon colorTag slug');

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

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('category', 'name type icon colorTag slug');

    if (!recipe) {
      throw ApiError.notFound('Recipe not found.');
    }

    // Get related recipes from same category
    const related = await Recipe.find({
      category: recipe.category,
      _id: { $ne: recipe._id },
    })
      .limit(4)
      .select('title imageUrl nutritionSummary prepTime cookTime difficulty category')
      .populate('category', 'name colorTag slug');

    res.json({
      success: true,
      data: { recipe, related },
    });
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      throw ApiError.notFound('Recipe not found.');
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      throw ApiError.notFound('Recipe not found.');
    }
    res.json({ success: true, message: 'Recipe deleted.' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedRecipes = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Return a diverse set — one from each category where available
    const recipes = await Recipe.aggregate([
      { $sample: { size: 8 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
    ]);

    res.json({ success: true, data: recipes });
  } catch (error) {
    next(error);
  }
};
