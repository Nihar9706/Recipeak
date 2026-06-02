import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useData';
import CategoryCard from '../components/recipe/CategoryCard';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  const fitnessGoals = categories?.filter((c) => c.type === 'fitness_goal') || [];
  const sportCats = categories?.filter((c) => c.type === 'sport') || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-text">Categories</h1>
          <p className="text-text-muted text-lg">Choose your goal or sport to find the perfect recipes</p>
        </motion.div>

        {/* Fitness Goals */}
        {fitnessGoals.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-text">
              <span className="w-1 h-8 rounded-full bg-primary" />
              Fitness Goals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {fitnessGoals.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Sport Categories */}
        {sportCats.length > 0 && (
          <section>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-text">
              <span className="w-1 h-8 rounded-full bg-accent-red" />
              Athlete Sports
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sportCats.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
