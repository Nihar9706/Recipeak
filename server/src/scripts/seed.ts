/**
 * Recipeak Database Seed Script
 * 
 * Fetches recipes from Spoonacular API, transforms them into our schema,
 * and seeds MongoDB. Re-runnable safely (checks for duplicate spoonacularId).
 * 
 * Usage: npm run seed
 * Requires: SPOONACULAR_API_KEY and MONGODB_URI in .env
 */

import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category, ICategory } from '../models/Category';
import { Recipe } from '../models/Recipe';

dotenv.config();

const SPOONACULAR_BASE = 'https://api.spoonacular.com';
const API_KEY = process.env.SPOONACULAR_API_KEY;

// ─── Category Definitions ──────────────────────────────────────────────

interface CategorySeed {
  name: string;
  type: 'fitness_goal' | 'sport';
  description: string;
  icon: string;
  colorTag: string;
  slug: string;
  searchParams: Record<string, any>;
}

const CATEGORIES: CategorySeed[] = [
  // Fitness Goals
  {
    name: 'Fat Loss',
    type: 'fitness_goal',
    description: 'Low calorie, high fiber, lean protein recipes designed to support healthy fat loss while keeping you full and satisfied.',
    icon: '🔥',
    colorTag: '#FF6B35',
    slug: 'fat-loss',
    searchParams: { diet: 'gluten free', maxCalories: 500, type: 'main course', number: 5 },
  },
  {
    name: 'Muscle Building',
    type: 'fitness_goal',
    description: 'High protein, complex carb recipes with calorie surplus to fuel muscle growth and recovery.',
    icon: '💪',
    colorTag: '#E8FF47',
    slug: 'muscle-building',
    searchParams: { minProtein: 30, type: 'main course', number: 5 },
  },
  {
    name: 'Maintenance',
    type: 'fitness_goal',
    description: 'Balanced macros and everyday healthy eating to maintain your current physique and energy levels.',
    icon: '⚖️',
    colorTag: '#4ECDC4',
    slug: 'maintenance',
    searchParams: { diet: 'whole30', type: 'main course', number: 5 },
  },
  {
    name: 'General Wellness',
    type: 'fitness_goal',
    description: 'Clean eating, anti-inflammatory, and gut health focused recipes for overall wellbeing.',
    icon: '🧘',
    colorTag: '#A78BFA',
    slug: 'general-wellness',
    searchParams: { diet: 'vegetarian', type: 'main course', number: 5 },
  },
  // Sport Categories
  {
    name: 'Swimmers',
    type: 'sport',
    description: 'High carb, endurance fuel with anti-cramp minerals for peak swimming performance.',
    icon: '🏊',
    colorTag: '#38BDF8',
    slug: 'swimmers',
    searchParams: { type: 'main course', query: 'pasta', number: 4 },
  },
  {
    name: 'Runners',
    type: 'sport',
    description: 'Quick energy, glycogen replenishment, and electrolyte-rich recipes for runners.',
    icon: '🏃',
    colorTag: '#FB923C',
    slug: 'runners',
    searchParams: { type: 'main course', query: 'rice', number: 4 },
  },
  {
    name: 'Weightlifters',
    type: 'sport',
    description: 'Maximum protein, creatine-rich foods, and heavy calorie meals for strength athletes.',
    icon: '🏋️',
    colorTag: '#EF4444',
    slug: 'weightlifters',
    searchParams: { minProtein: 40, type: 'main course', number: 4 },
  },
  {
    name: 'Cricket Players',
    type: 'sport',
    description: 'Sustained energy, light pre-match meals, and hydration focused recipes for cricketers.',
    icon: '🏏',
    colorTag: '#34D399',
    slug: 'cricket-players',
    searchParams: { type: 'main course', query: 'salad', number: 4 },
  },
  {
    name: 'Football Players',
    type: 'sport',
    description: 'Endurance + explosive energy mix for football athletes needing sustained performance.',
    icon: '⚽',
    colorTag: '#60A5FA',
    slug: 'football-players',
    searchParams: { type: 'main course', query: 'chicken', number: 4 },
  },
  {
    name: 'Cyclists',
    type: 'sport',
    description: 'Carb loading, long-duration fuel, and recovery meals for cycling enthusiasts.',
    icon: '🚴',
    colorTag: '#FBBF24',
    slug: 'cyclists',
    searchParams: { type: 'main course', query: 'potato', number: 4 },
  },
  {
    name: 'Track & Field',
    type: 'sport',
    description: 'Explosive power, lean muscle, and joint health recipes for track and field athletes.',
    icon: '🤸',
    colorTag: '#F472B6',
    slug: 'track-and-field',
    searchParams: { type: 'main course', query: 'beef', number: 4 },
  },
];

// ─── Helper: Delay to respect rate limits ────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Helper: Get nutrition value from Spoonacular nutrients array ────

function getNutrientValue(nutrients: any[], name: string): number {
  const n = nutrients?.find(
    (nut: any) => nut.name.toLowerCase() === name.toLowerCase()
  );
  return n ? Math.round(n.amount * 100) / 100 : 0;
}

// ─── Helper: Determine difficulty from prep + cook time ──────────────

function getDifficulty(prepTime: number, cookTime: number): 'Easy' | 'Medium' | 'Hard' {
  const total = prepTime + cookTime;
  if (total <= 30) return 'Easy';
  if (total <= 60) return 'Medium';
  return 'Hard';
}

// ─── Fetch recipe IDs from complex search ────────────────────────────

async function searchRecipes(params: Record<string, any>): Promise<number[]> {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE}/recipes/complexSearch`, {
      params: {
        ...params,
        apiKey: API_KEY,
        addRecipeNutrition: false,
        fillIngredients: false,
      },
    });
    return response.data.results.map((r: any) => r.id);
  } catch (error: any) {
    console.error(`  ⚠️  Search failed: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

// ─── Fetch full recipe details with nutrition ────────────────────────

async function fetchRecipeDetails(id: number): Promise<any | null> {
  try {
    const response = await axios.get(
      `${SPOONACULAR_BASE}/recipes/${id}/information`,
      {
        params: {
          apiKey: API_KEY,
          includeNutrition: true,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(`  ⚠️  Failed to fetch recipe ${id}: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// ─── Transform Spoonacular data to our schema ────────────────────────

function transformRecipe(data: any, categoryId: mongoose.Types.ObjectId) {
  const nutrients = data.nutrition?.nutrients || [];

  const ingredients = (data.extendedIngredients || []).map((ing: any) => {
    // Per-ingredient nutrition from Spoonacular (estimated from whole recipe)
    const ingNutrients = ing.nutrition?.nutrients || [];
    return {
      name: ing.name || ing.originalName || 'Unknown',
      quantity: ing.amount || 0,
      unit: ing.unit || '',
      calories: getNutrientValue(ingNutrients, 'Calories'),
      protein_g: getNutrientValue(ingNutrients, 'Protein'),
      carbs_g: getNutrientValue(ingNutrients, 'Carbohydrates'),
      fat_g: getNutrientValue(ingNutrients, 'Fat'),
    };
  });

  const steps: string[] = [];
  if (data.analyzedInstructions?.[0]?.steps) {
    for (const step of data.analyzedInstructions[0].steps) {
      steps.push(step.step);
    }
  } else if (data.instructions) {
    // Fallback: split HTML instructions
    const clean = data.instructions.replace(/<[^>]*>/g, '').trim();
    if (clean) steps.push(clean);
  }

  return {
    title: data.title,
    description: data.summary
      ? data.summary.replace(/<[^>]*>/g, '')
      : '',
    imageUrl: data.image || '',
    category: categoryId,
    tags: [
      ...(data.diets || []),
      ...(data.dishTypes || []),
      ...(data.cuisines || []),
    ].slice(0, 10),
    difficulty: getDifficulty(data.preparationMinutes || 15, data.cookingMinutes || data.readyInMinutes || 30),
    prepTime: data.preparationMinutes || Math.max(10, Math.floor((data.readyInMinutes || 30) * 0.4)),
    cookTime: data.cookingMinutes || Math.max(10, Math.ceil((data.readyInMinutes || 30) * 0.6)),
    servings: data.servings || 1,
    ingredients,
    steps: steps.length > 0 ? steps : ['Follow the recipe instructions as described.'],
    nutritionSummary: {
      calories: getNutrientValue(nutrients, 'Calories'),
      protein_g: getNutrientValue(nutrients, 'Protein'),
      carbs_g: getNutrientValue(nutrients, 'Carbohydrates'),
      fat_g: getNutrientValue(nutrients, 'Fat'),
      fiber_g: getNutrientValue(nutrients, 'Fiber'),
      sugar_g: getNutrientValue(nutrients, 'Sugar'),
    },
    spoonacularId: data.id,
  };
}

// ─── Main Seed Function ──────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 Recipeak Database Seeder');
  console.log('══════════════════════════════════════\n');

  if (!API_KEY) {
    console.error('❌ SPOONACULAR_API_KEY is not set in .env file.');
    process.exit(1);
  }

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeak';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  let totalRecipesAdded = 0;
  let totalSkipped = 0;

  for (const catDef of CATEGORIES) {
    console.log(`\n📂 Category: ${catDef.icon} ${catDef.name} (${catDef.type})`);
    console.log('─'.repeat(40));

    // Upsert category
    let category = await Category.findOne({ slug: catDef.slug });
    if (!category) {
      category = await Category.create({
        name: catDef.name,
        type: catDef.type,
        description: catDef.description,
        icon: catDef.icon,
        colorTag: catDef.colorTag,
        slug: catDef.slug,
      });
      console.log(`  ✅ Created category: ${catDef.name}`);
    } else {
      console.log(`  ℹ️  Category already exists: ${catDef.name}`);
    }

    // Search for recipe IDs
    console.log(`  🔍 Searching Spoonacular...`);
    const recipeIds = await searchRecipes(catDef.searchParams);
    console.log(`  📋 Found ${recipeIds.length} recipes`);

    if (recipeIds.length === 0) {
      console.log(`  ⚠️  No recipes found for ${catDef.name}, skipping.`);
      continue;
    }

    // Fetch and save each recipe
    for (const recipeId of recipeIds) {
      // Check if already seeded
      const exists = await Recipe.findOne({ spoonacularId: recipeId });
      if (exists) {
        console.log(`  ⏭️  Skipped (already exists): ${exists.title}`);
        totalSkipped++;
        continue;
      }

      await delay(1200); // Rate limit: ~1 request per second

      const details = await fetchRecipeDetails(recipeId);
      if (!details) continue;

      const recipeData = transformRecipe(details, category._id as mongoose.Types.ObjectId);

      try {
        const saved = await Recipe.create(recipeData);
        console.log(`  ✅ Added: ${saved.title} (${recipeData.nutritionSummary.calories} cal, ${recipeData.nutritionSummary.protein_g}g protein)`);
        totalRecipesAdded++;
      } catch (err: any) {
        if (err.code === 11000) {
          console.log(`  ⏭️  Duplicate, skipped: ${recipeData.title}`);
          totalSkipped++;
        } else {
          console.error(`  ❌ Error saving: ${err.message}`);
        }
      }
    }
  }

  console.log('\n══════════════════════════════════════');
  console.log(`🎉 Seeding complete!`);
  console.log(`   ✅ Added: ${totalRecipesAdded} recipes`);
  console.log(`   ⏭️  Skipped: ${totalSkipped} duplicates`);
  console.log('══════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed script failed:', err);
  process.exit(1);
});
