import api from './api';
import type { Recipe, Category, ApiResponse, RecipeFilters, AISearchResponse, AISearchLog } from '../types';

export const recipeService = {
  getAll: async (filters: RecipeFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const res = await api.get<ApiResponse<Recipe[]>>(`/recipes?${params}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ recipe: Recipe; related: Recipe[] }>>(`/recipes/${id}`);
    return res.data.data;
  },

  getFeatured: async () => {
    const res = await api.get<ApiResponse<Recipe[]>>('/recipes/featured');
    return res.data.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data.data;
  },

  getRecipes: async (id: string, filters: RecipeFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const res = await api.get<ApiResponse<Recipe[]>>(`/categories/${id}/recipes?${params}`);
    return res.data;
  },
};

export const userService = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<any>>('/users/profile');
    return res.data.data;
  },

  updateProfile: async (data: { name?: string; profilePhoto?: string; selectedGoal?: string }) => {
    const res = await api.put<ApiResponse<any>>('/users/profile', data);
    return res.data.data;
  },

  getSavedRecipes: async () => {
    const res = await api.get<ApiResponse<Recipe[]>>('/users/saved');
    return res.data.data;
  },

  saveRecipe: async (recipeId: string) => {
    await api.post(`/users/saved/${recipeId}`);
  },

  unsaveRecipe: async (recipeId: string) => {
    await api.delete(`/users/saved/${recipeId}`);
  },
};

export const aiService = {
  search: async (query: string) => {
    const res = await api.post<ApiResponse<AISearchResponse>>('/ai/search', { query });
    return res.data.data;
  },

  getHistory: async () => {
    const res = await api.get<ApiResponse<AISearchLog[]>>('/ai/history');
    return res.data.data;
  },
};
