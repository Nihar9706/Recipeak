import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, ChefHat, Zap } from 'lucide-react';
import { useCategories, useFeaturedRecipes } from '../hooks/useData';
import CategoryCard from '../components/recipe/CategoryCard';
import RecipeCard from '../components/recipe/RecipeCard';

export default function LandingPage() {
  const { data: categories } = useCategories();
  const { data: featured } = useFeaturedRecipes();

  const fitnessGoals = categories?.filter((c) => c.type === 'fitness_goal') || [];
  const sportCats = categories?.filter((c) => c.type === 'sport') || [];

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent-blue/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >

          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Eat With <span className="text-gradient">Purpose</span>.
            <br />
            Fuel Your <span className="text-gradient">Goals</span>.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover recipes tailored to your fitness goals and sport.
            Detailed nutrition breakdowns and curated meal recommendations.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/register"
              className="group px-8 py-4 rounded-2xl bg-primary text-white font-semibold text-lg
                       hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(91,163,217,0.35)]
                       flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories"
              className="px-8 py-4 rounded-2xl border-2 border-border text-text font-semibold text-lg
                       hover:border-primary hover:bg-accent-blue/10 transition-all duration-300"
            >
              Browse Recipes
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-text">How It Works</h2>
            <p className="text-text-muted text-lg max-w-lg mx-auto">Three steps to personalized nutrition</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="text-primary" size={28} />, title: 'Pick Your Goal', desc: 'Choose from fat loss, muscle building, or your specific sport category.', bg: 'bg-accent-blue/15' },
              { icon: <ChefHat className="text-accent-red" size={28} />, title: 'Discover Recipes', desc: 'Browse curated recipes with full nutrition data tailored to your needs.', bg: 'bg-secondary/30' },
              { icon: <Zap className="text-accent-green" size={28} />, title: 'Cook & Track', desc: 'Follow step-by-step instructions with adjustable servings and macro tracking.', bg: 'bg-accent-green/15' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-2xl bg-bg-card border border-border text-center
                         hover:border-primary-light/40 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mx-auto mb-5`}>
                  {step.icon}
                </div>
                <span className="absolute top-5 right-5 font-mono text-xs text-text-dim font-medium">0{i + 1}</span>
                <h3 className="font-semibold text-xl mb-3 text-text">{step.title}</h3>
                <p className="text-base text-text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Fitness Goal Categories ──────────────────────────── */}
      {fitnessGoals.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">Fitness Goals</h2>
                <p className="text-text-muted mt-2 text-base">Recipes designed for your physique targets</p>
              </div>
              <Link to="/categories" className="hidden sm:flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {fitnessGoals.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Sport Categories ─────────────────────────────────── */}
      {sportCats.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">Athlete Fuel</h2>
                <p className="text-text-muted mt-2 text-base">Sport-specific nutrition for peak performance</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sportCats.slice(0, 8).map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Recipes ─────────────────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">Featured Recipes</h2>
                <p className="text-text-muted mt-2 text-base">Handpicked meals to fuel your day</p>
              </div>
              <Link to="/recipes" className="hidden sm:flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                See all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 8).map((recipe, i) => (
                <RecipeCard key={recipe._id} recipe={recipe} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}


    </div>
  );
}
