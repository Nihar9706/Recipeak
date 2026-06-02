import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Flame, ChefHat, Bookmark, BookmarkCheck, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useRecipe, useSaveRecipe, useUnsaveRecipe } from '../hooks/useData';
import { useAuth } from '../store/AuthContext';
import NutritionChart from '../components/recipe/NutritionChart';
import RecipeCard from '../components/recipe/RecipeCard';
import type { Category, Recipe } from '../types';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useRecipe(id!);
  const { user } = useAuth();
  const saveRecipe = useSaveRecipe();
  const unsaveRecipe = useUnsaveRecipe();
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-text-muted text-lg">Recipe not found.</p>
      </div>
    );
  }

  const { recipe, related } = data;
  const category = recipe.category as Category;
  const isSaved = user?.savedRecipes?.some(
    (r) => (typeof r === 'string' ? r : (r as Recipe)._id) === recipe._id
  );

  const toggleStep = (i: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleIngredient = (i: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleSave = () => {
    if (!user) return;
    if (isSaved) {
      unsaveRecipe.mutate(recipe._id);
    } else {
      saveRecipe.mutate(recipe._id);
    }
  };

  const difficultyStyle = {
    Easy: 'text-accent-green bg-accent-green/10',
    Medium: 'text-primary bg-primary/10',
    Hard: 'text-accent-red bg-accent-red/10',
  }[recipe.difficulty];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[55vh] overflow-hidden">
        <img
          src={recipe.imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary mb-4 transition-colors font-medium">
              <ArrowLeft size={15} /> Back
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {category?.name && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-text">
                  {category.icon} {category.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 ${difficultyStyle}`}>
                {recipe.difficulty}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-text">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted font-medium">
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {recipe.prepTime}m prep · {recipe.cookTime}m cook
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} /> {recipe.servings} servings
              </span>
              <span className="flex items-center gap-1.5">
                <Flame size={16} className="text-accent-red" />
                <span className="font-mono">{Math.round(recipe.nutritionSummary.calories)}</span> cal/serving
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Save + Serving Slider */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted font-medium">Servings:</span>
            <div className="flex items-center gap-2">
              {[0.5, 1, 2, 3, 4].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setServingMultiplier(mult)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-mono font-medium transition-all
                            ${servingMultiplier === mult
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-bg-card border border-border text-text-muted hover:border-primary/40 hover:text-primary'}`}
                >
                  {mult === 1 ? recipe.servings : Math.round(recipe.servings * mult)}
                </button>
              ))}
            </div>
          </div>

          {user && (
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold
                        transition-all duration-200
                        ${isSaved
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-border text-text-muted hover:border-primary/40 hover:text-primary'}`}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {isSaved ? 'Saved' : 'Save Recipe'}
            </button>
          )}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-text-muted text-base leading-relaxed mb-10">{recipe.description}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Ingredients — left */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-5 flex items-center gap-2 text-text">
              <ChefHat size={20} className="text-primary" />
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => {
                const qty = Math.round(ing.quantity * servingMultiplier * 100) / 100;
                const isChecked = checkedIngredients.has(i);
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all
                              ${isChecked ? 'bg-primary/5' : 'hover:bg-accent-blue/10'}`}
                    onClick={() => toggleIngredient(i)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                                   transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-border'}`}>
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-base ${isChecked ? 'line-through text-text-dim' : 'text-text-muted'}`}>
                      <span className="font-mono font-medium text-text">{qty} {ing.unit}</span> {ing.name}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Steps — right */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-bold mb-5 text-text">Instructions</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => {
                const isChecked = checkedSteps.has(i);
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-4 p-5 rounded-2xl cursor-pointer transition-all
                              ${isChecked ? 'bg-primary/5 border border-primary/20' : 'bg-bg-card border border-border hover:border-primary-light/40'}`}
                    onClick={() => toggleStep(i)}
                  >
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-mono font-medium
                                   transition-colors ${isChecked ? 'bg-primary text-white' : 'bg-accent-blue/15 text-primary'}`}>
                      {isChecked ? <Check size={14} /> : i + 1}
                    </div>
                    <p className={`text-base leading-relaxed pt-1.5
                                 ${isChecked ? 'line-through text-text-dim' : 'text-text-muted'}`}>
                      {step}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Nutrition Chart */}
        <div className="mt-14">
          <NutritionChart nutrition={recipe.nutritionSummary} servings={servingMultiplier} />
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {recipe.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-sm text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Recipes */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-text">Related Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r, i) => (
                <RecipeCard key={r._id} recipe={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
