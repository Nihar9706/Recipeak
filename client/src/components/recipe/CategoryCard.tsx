import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/categories/${category._id}`}
        className="group block p-6 rounded-2xl bg-bg-card border border-border
                 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
      >
        {/* Gradient glow background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${category.colorTag}12, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Icon + Type badge */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{category.icon}</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider
                           bg-accent-blue/15 text-primary">
              {category.type === 'fitness_goal' ? 'Goal' : 'Sport'}
            </span>
          </div>

          {/* Name */}
          <h3
            className="font-semibold text-lg mb-2 text-text group-hover:text-primary transition-colors duration-200"
          >
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
            {category.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {category.recipeCount !== undefined && (
              <span className="text-sm text-text-dim font-mono font-medium">
                {category.recipeCount} recipes
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-text-dim group-hover:text-primary transition-colors font-medium">
              Explore <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
