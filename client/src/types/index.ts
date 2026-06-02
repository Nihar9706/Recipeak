// ─── User ─────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto: string;
  selectedGoal: string;
  savedRecipes: string[] | Recipe[];
  role: 'user' | 'admin';
  createdAt: string;
}

// ─── Category ─────────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  type: 'fitness_goal' | 'sport';
  description: string;
  icon: string;
  colorTag: string;
  slug: string;
  recipeCount?: number;
}

// ─── Ingredient ───────────────────────────────────────────────────
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

// ─── Nutrition Summary ────────────────────────────────────────────
export interface NutritionSummary {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
}

// ─── Recipe ───────────────────────────────────────────────────────
export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category | string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  nutritionSummary: NutritionSummary;
  spoonacularId: number | null;
  createdAt: string;
}

// ─── AI Search ────────────────────────────────────────────────────
export interface AISearchLog {
  _id: string;
  user: string;
  query: string;
  responseSummary: string;
  recipeIds: Recipe[] | string[];
  createdAt: string;
}

export interface AISearchResponse {
  response: string;
  recipes: Recipe[];
}

// ─── API Response ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─── Filter & Sort ────────────────────────────────────────────────
export interface RecipeFilters {
  category?: string;
  search?: string;
  difficulty?: string;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  maxPrepTime?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
