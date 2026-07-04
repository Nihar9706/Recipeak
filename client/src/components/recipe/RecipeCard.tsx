import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, Dumbbell } from 'lucide-react';
import type { Recipe, Category } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const category = recipe.category as Category;
  const fitnessCategory = recipe.fitnessCategory as Category;

  const difficultyStyle = {
    Easy: 'text-accent-green bg-accent-green/10',
    Medium: 'text-primary bg-primary/10',
    Hard: 'text-accent-red bg-accent-red/10',
  }[recipe.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/recipes/${recipe._id}`}
        className="group block rounded-2xl bg-bg-card border border-border overflow-hidden
                 hover:border-primary-light/50 hover:shadow-lg
                 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={recipe.imageUrl || '/placeholder-recipe.jpg'}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Difficulty badge */}
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold
                          backdrop-blur-sm bg-white/90 ${difficultyStyle}`}>
            {recipe.difficulty}
          </span>

          {/* Category tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {category?.name && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold
                         backdrop-blur-sm bg-white/90 text-text shadow-sm"
              >
                {category.icon} {category.name}
              </span>
            )}
            {fitnessCategory?.name && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold
                         backdrop-blur-sm bg-white/90 text-text shadow-sm"
              >
                {fitnessCategory.icon} {fitnessCategory.name}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-base text-text group-hover:text-primary transition-colors duration-200 
                       line-clamp-2 mb-3 leading-snug">
            {recipe.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-text-dim" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1.5">
              <Flame size={14} className="text-accent-red" />
              <span className="font-mono font-medium">{Math.round(recipe.nutritionSummary.calories)}</span> cal
            </span>
            <span className="flex items-center gap-1.5">
              <Dumbbell size={14} className="text-primary" />
              <span className="font-mono font-medium">{Math.round(recipe.nutritionSummary.protein_g)}</span>g
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
