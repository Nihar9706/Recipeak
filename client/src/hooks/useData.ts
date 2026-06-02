import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService, categoryService, userService } from '../services/data.service';
import type { RecipeFilters } from '../types';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

// ─── Categories ───────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCategoryRecipes(id: string, filters: RecipeFilters = {}) {
  return useQuery({
    queryKey: ['categoryRecipes', id, filters],
    queryFn: () => categoryService.getRecipes(id, filters),
    enabled: !!id,
  });
}

// ─── Recipes ──────────────────────────────────────────────────────

export function useRecipes(filters: RecipeFilters = {}) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.getAll(filters),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getById(id),
    enabled: !!id,
  });
}

export function useFeaturedRecipes() {
  return useQuery({
    queryKey: ['featuredRecipes'],
    queryFn: recipeService.getFeatured,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── User / Saved Recipes ─────────────────────────────────────────

export function useSavedRecipes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['savedRecipes'],
    queryFn: userService.getSavedRecipes,
    enabled: !!user,
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.saveRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Recipe saved! 🔖');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUnsaveRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.unsaveRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Recipe removed from saved.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}


