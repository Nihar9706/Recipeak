import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .populate({
        path: 'savedRecipes',
        populate: { path: 'category', select: 'name colorTag slug' },
      });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, profilePhoto, selectedGoal } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;
    if (selectedGoal !== undefined) updates.selectedGoal = selectedGoal;

    const user = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getSavedRecipes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate({
      path: 'savedRecipes',
      populate: { path: 'category', select: 'name colorTag slug' },
    });
    res.json({ success: true, data: user?.savedRecipes || [] });
  } catch (error) {
    next(error);
  }
};

export const saveRecipe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user!._id);

    if (!user) throw ApiError.notFound('User not found.');

    const alreadySaved = user.savedRecipes.some(
      (id) => id.toString() === recipeId
    );

    if (alreadySaved) {
      res.json({ success: true, message: 'Recipe already saved.' });
      return;
    }

    user.savedRecipes.push(recipeId as any);
    await user.save();

    res.json({ success: true, message: 'Recipe saved!' });
  } catch (error) {
    next(error);
  }
};

export const unsaveRecipe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;
    await User.findByIdAndUpdate(req.user!._id, {
      $pull: { savedRecipes: recipeId },
    });
    res.json({ success: true, message: 'Recipe removed from saved.' });
  } catch (error) {
    next(error);
  }
};
