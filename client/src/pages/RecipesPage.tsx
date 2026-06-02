import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, UtensilsCrossed } from 'lucide-react';
import { useRecipes } from '../hooks/useData';
import RecipeCard from '../components/recipe/RecipeCard';
import type { RecipeFilters } from '../types';

export default function RecipesPage() {
  const [filters, setFilters] = useState<RecipeFilters>({ sort: 'newest' });
  const { data: result, isLoading } = useRecipes(filters);

  const recipes = result?.data || [];

  return (
    <div className="min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-text">All Recipes</h1>
          <p className="text-text-muted text-lg">Browse our full collection of goal-based recipes</p>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-bg-card border border-border text-text text-base
                       placeholder:text-text-dim focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-4 py-3.5 rounded-xl bg-bg-card border border-border text-text text-base
                     focus:outline-none focus:border-primary cursor-pointer min-w-[160px]"
          >
            <option value="newest">Newest</option>
            <option value="highest-protein">Highest Protein</option>
            <option value="lowest-calories">Lowest Calories</option>
            <option value="quickest">Quickest</option>
          </select>
        </div>

        {/* Difficulty filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              onClick={() => setFilters({ ...filters, difficulty: d === 'All' ? undefined : d })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${(d === 'All' && !filters.difficulty) || filters.difficulty === d
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg-card border border-border text-text-muted hover:border-primary/40 hover:text-primary'
                }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-bg-card border border-border">
            <UtensilsCrossed size={48} className="text-text-dim mx-auto mb-4" />
            <p className="text-text-muted text-lg font-medium">No recipes found.</p>
            <p className="text-text-dim text-base mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
