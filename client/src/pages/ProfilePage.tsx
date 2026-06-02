import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookmarkCheck, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useSavedRecipes } from '../hooks/useData';
import { userService } from '../services/data.service';
import RecipeCard from '../components/recipe/RecipeCard';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { data: savedRecipes, isLoading } = useSavedRecipes();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [goal, setGoal] = useState(user?.selectedGoal || '');

  const handleSave = async () => {
    try {
      const updated = await userService.updateProfile({ name, selectedGoal: goal });
      setUser({ ...user!, name: updated.name, selectedGoal: updated.selectedGoal });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-bg-card border border-border p-8 sm:p-10 mb-12 shadow-sm"
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20
                          flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-primary" />
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full max-w-xs px-4 py-3 rounded-xl bg-bg border border-border text-text text-base
                               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Selected Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-bg border border-border text-text text-base
                               focus:outline-none cursor-pointer"
                    >
                      <option value="">None</option>
                      <option value="fat-loss">Fat Loss</option>
                      <option value="muscle-building">Muscle Building</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="general-wellness">General Wellness</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold
                                                           hover:bg-primary/90 transition-all">
                      <Check size={15} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm text-text-muted font-medium
                                                                       hover:border-primary/40 transition-colors">
                      <X size={15} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-3xl font-bold text-text">{user.name}</h1>
                    <button onClick={() => setEditing(true)} className="p-2 rounded-xl hover:bg-accent-blue/10 text-text-dim hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p className="text-base text-text-muted">{user.email}</p>
                  {user.selectedGoal && (
                    <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      Goal: {user.selectedGoal.replace('-', ' ')}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Saved Recipes */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-text">
            <BookmarkCheck size={24} className="text-primary" />
            Saved Recipes
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : savedRecipes && savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedRecipes.map((recipe, i) => (
                <RecipeCard key={recipe._id} recipe={recipe} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-bg-card border border-border">
              <BookmarkCheck size={44} className="text-text-dim mx-auto mb-4" />
              <p className="text-text-muted text-lg font-medium">No saved recipes yet.</p>
              <p className="text-text-dim text-base mt-2">Browse recipes and tap the bookmark to save them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
