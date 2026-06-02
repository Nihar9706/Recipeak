import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { useCategory, useCategoryRecipes } from '../hooks/useData';
import RecipeCard from '../components/recipe/RecipeCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest-protein', label: 'Highest Protein' },
  { value: 'lowest-calories', label: 'Lowest Calories' },
  { value: 'quickest', label: 'Quickest' },
];

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category } = useCategory(id!);
  const [sort, setSort] = useState('newest');
  const [difficulty, setDifficulty] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    sort,
    difficulty: difficulty || undefined,
    maxCalories: maxCalories ? Number(maxCalories) : undefined,
    minProtein: minProtein ? Number(minProtein) : undefined,
  };

  const { data: result, isLoading } = useCategoryRecipes(id!, filters);
  const recipes = result?.data || [];

  return (
    <div className="min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{category.icon}</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                             bg-accent-blue/15 text-primary">
                {category.type === 'fitness_goal' ? 'Fitness Goal' : 'Sport'}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-text">
              {category.name}
            </h1>
            <p className="text-text-muted text-lg max-w-2xl leading-relaxed">{category.description}</p>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bg-card border border-border text-base text-text
                     focus:outline-none focus:border-primary cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors
                      ${showFilters ? 'border-primary text-primary bg-primary/5' : 'border-border text-text-muted hover:border-primary/40'}`}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          {/* Difficulty pills */}
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => {
              const isActive = (d === 'All' && !difficulty) || difficulty === d;
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d === 'All' ? '' : d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-bg-card border border-border text-text-muted hover:border-primary/40 hover:text-primary'
                            }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-6 rounded-2xl bg-bg-card border border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Max Calories</label>
                <input
                  type="number"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-base text-text
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Min Protein (g)</label>
                <input
                  type="number"
                  value={minProtein}
                  onChange={(e) => setMinProtein(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-base text-text
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-bg-card border border-border">
            <p className="text-text-muted text-lg font-medium">No recipes found matching your filters.</p>
            <p className="text-text-dim text-base mt-2">Try adjusting your filters or sort.</p>
          </div>
        )}

        {/* Pagination info */}
        {result?.pagination && result.pagination.pages > 1 && (
          <div className="text-center mt-10">
            <p className="text-sm text-text-dim font-mono">
              Page {result.pagination.page} of {result.pagination.pages} · {result.pagination.total} recipes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
