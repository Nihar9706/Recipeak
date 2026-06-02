import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';
import { Recipe } from '../models/Recipe';

dotenv.config();

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE = 'https://api.spoonacular.com';
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function getNutrient(nutrients: any[], name: string): number {
  const n = nutrients?.find((x: any) => x.name.toLowerCase() === name.toLowerCase());
  return n ? Math.round(n.amount * 100) / 100 : 0;
}

function getDifficulty(prep: number, cook: number): 'Easy' | 'Medium' | 'Hard' {
  const t = prep + cook;
  return t <= 30 ? 'Easy' : t <= 60 ? 'Medium' : 'Hard';
}

const NEW_CATEGORIES = [
  { name: 'Pre-Workout Meals', type: 'sport' as const, description: 'Quick energy meals before training sessions.', icon: '⚡', colorTag: '#FBBF24', slug: 'pre-workout', searchParams: { type: 'snack', maxReadyTime: 30, minCarbs: 20, number: 5 } },
  { name: 'Post-Workout Recovery', type: 'sport' as const, description: 'Protein-rich recovery meals after exercise.', icon: '🏆', colorTag: '#34D399', slug: 'post-workout', searchParams: { type: 'main course', minProtein: 30, number: 5 } },
  { name: 'Keto Friendly', type: 'fitness_goal' as const, description: 'Low carb, high fat ketogenic recipes.', icon: '🥑', colorTag: '#84CC16', slug: 'keto', searchParams: { diet: 'ketogenic', number: 5 } },
  { name: 'Quick & Easy', type: 'fitness_goal' as const, description: 'Delicious meals ready in under 30 minutes.', icon: '⏱️', colorTag: '#F97316', slug: 'quick-easy', searchParams: { maxReadyTime: 30, type: 'main course', number: 5 } },
  { name: 'High Protein Snacks', type: 'fitness_goal' as const, description: 'Protein-packed snacks to fuel your day.', icon: '💥', colorTag: '#EF4444', slug: 'high-protein-snacks', searchParams: { type: 'snack', minProtein: 10, number: 5 } },
  { name: 'Smoothies & Shakes', type: 'sport' as const, description: 'Nutritious blended drinks for any time of day.', icon: '🥤', colorTag: '#A78BFA', slug: 'smoothies', searchParams: { type: 'beverage', query: 'smoothie protein', number: 5 } },
];

async function seed() {
  console.log('\n🌱 Adding 6 new categories with Spoonacular recipes\n');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeak');
  console.log('✅ Connected to MongoDB\n');

  let totalAdded = 0;

  for (const cat of NEW_CATEGORIES) {
    console.log(`\n📂 ${cat.icon} ${cat.name}`);
    console.log('─'.repeat(40));

    let category = await Category.findOne({ slug: cat.slug });
    if (!category) {
      category = await Category.create({ name: cat.name, type: cat.type, description: cat.description, icon: cat.icon, colorTag: cat.colorTag, slug: cat.slug });
      console.log('  ✅ Category created');
    } else {
      console.log('  ℹ️  Already exists');
    }

    // Search
    const { searchParams } = cat;
    try {
      const res = await axios.get(`${BASE}/recipes/complexSearch`, { params: { ...searchParams, apiKey: API_KEY, addRecipeNutrition: false } });
      const ids: number[] = res.data.results.map((r: any) => r.id);
      console.log(`  🔍 Found ${ids.length} recipes`);

      for (const id of ids) {
        const exists = await Recipe.findOne({ spoonacularId: id });
        if (exists) { console.log(`  ⏭️  Skip: ${exists.title}`); continue; }

        await delay(1200);
        const detail = await axios.get(`${BASE}/recipes/${id}/information`, { params: { apiKey: API_KEY, includeNutrition: true } });
        const d = detail.data;
        const nutrients = d.nutrition?.nutrients || [];
        const ingredients = (d.extendedIngredients || []).map((ing: any) => ({
          name: ing.name || 'Unknown', quantity: ing.amount || 0, unit: ing.unit || '',
          calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0,
        }));
        const steps: string[] = d.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) || (d.instructions ? [d.instructions.replace(/<[^>]*>/g, '')] : ['Follow recipe instructions.']);

        const recipe = {
          title: d.title, description: (d.summary || '').replace(/<[^>]*>/g, '').substring(0, 300) + '...',
          imageUrl: d.image || '', category: category._id, tags: [...(d.diets || []), ...(d.dishTypes || [])].slice(0, 8),
          difficulty: getDifficulty(d.preparationMinutes || 15, d.cookingMinutes || d.readyInMinutes || 30),
          prepTime: d.preparationMinutes || Math.max(10, Math.floor((d.readyInMinutes || 30) * 0.4)),
          cookTime: d.cookingMinutes || Math.max(10, Math.ceil((d.readyInMinutes || 30) * 0.6)),
          servings: d.servings || 1, ingredients, steps,
          nutritionSummary: { calories: getNutrient(nutrients, 'Calories'), protein_g: getNutrient(nutrients, 'Protein'), carbs_g: getNutrient(nutrients, 'Carbohydrates'), fat_g: getNutrient(nutrients, 'Fat'), fiber_g: getNutrient(nutrients, 'Fiber'), sugar_g: getNutrient(nutrients, 'Sugar') },
          spoonacularId: d.id,
        };

        try { await Recipe.create(recipe); console.log(`  ✅ ${d.title}`); totalAdded++; }
        catch (e: any) { console.log(`  ⚠️  ${e.code === 11000 ? 'Duplicate' : e.message}`); }
      }
    } catch (e: any) {
      console.log(`  ❌ Search failed: ${e.response?.data?.message || e.message}`);
    }
  }

  console.log(`\n🎉 Done! Added ${totalAdded} new recipes.\n`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error('❌', e.message); process.exit(1); });
