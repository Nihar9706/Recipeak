/**
 * Recipeak — Indian Food Dataset Seeder
 *
 * Imports recipes from:
 *   e:\Nihar\Projects\Recipeak\dataset\Indian_Food_Ingredients_Nutrition_CookingMethods.csv
 *
 * CSV Columns:
 *   recipe_original, final_food_name, TotalTimeInMins, Cuisine,
 *   TranslatedInstructions, TranslatedIngredients, Cleaned-Ingredients,
 *   Calories (kcal), Carbohydrates (g), Protein (g), Fats (g),
 *   Free Sugar (g), Fibre (g), Sodium (mg), ...
 *
 * Usage:
 *   npm run seed:kaggle          # import all ~6500 recipes
 *   npm run seed:kaggle:test     # import first 50 per category
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';
import { Recipe } from '../models/Recipe';

dotenv.config();

// ─── CLI Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT_PER_CATEGORY = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const BATCH_SIZE = 50;

// ─── Dataset path ─────────────────────────────────────────────────────────────
const CSV_PATH = path.resolve('E:/Nihar/Projects/Recipeak/dataset/Indian_Food_Ingredients_Nutrition_CookingMethods.csv');

// ─── Category definitions derived from Cuisine column ─────────────────────────
// Maps Cuisine values from dataset → category slugs
const CUISINE_CATEGORY_MAP: Record<string, string> = {
  'North Indian Recipes':      'north-indian',
  'South Indian Recipes':      'south-indian',
  'Chinese':                   'chinese',
  'Continental':               'continental',
  'Bengali Recipes':           'bengali',
  'Maharashtrian Recipes':     'maharashtrian',
  'Punjabi':                   'north-indian',
  'Rajasthani':                'north-indian',
  'Gujarati Recipes':          'gujarati',
  'Kerala Recipes':            'south-indian',
  'Tamil Nadu':                'south-indian',
  'Karnataka':                 'south-indian',
  'Andhra':                    'south-indian',
  'Hyderabadi':                'south-indian',
  'Mughlai':                   'north-indian',
  'Indo Chinese':              'chinese',
  'Italian Recipes':           'continental',
  'Mexican':                   'continental',
  'Thai':                      'continental',
  'Middle Eastern':            'continental',
};

// Category definitions to seed in MongoDB
interface CategoryDef {
  name: string;
  type: 'fitness_goal' | 'sport';
  description: string;
  icon: string;
  colorTag: string;
  slug: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    name: 'North Indian',
    type: 'cuisine',
    description: 'Rich, aromatic curries and breads from the heartland of India — Punjabi, Mughlai, Rajasthani and more.',
    icon: '🍛',
    colorTag: '#FF6B35',
    slug: 'north-indian',
  },
  {
    name: 'South Indian',
    type: 'cuisine',
    description: 'Light, nutritious and flavour-packed dishes from Kerala, Tamil Nadu, Karnataka and Andhra Pradesh.',
    icon: '🥘',
    colorTag: '#34D399',
    slug: 'south-indian',
  },
  {
    name: 'Chinese',
    type: 'cuisine',
    description: 'Indo-Chinese fusion classics — Manchurian, fried rice, noodles and soups with an Indian twist.',
    icon: '🍜',
    colorTag: '#F87171',
    slug: 'chinese',
  },
  {
    name: 'Continental',
    type: 'cuisine',
    description: 'European-style and international dishes — Italian, Mexican, Thai and other world cuisines.',
    icon: '🍝',
    colorTag: '#60A5FA',
    slug: 'continental',
  },
  {
    name: 'Bengali',
    type: 'cuisine',
    description: 'Delicate, fish-forward and sweet-tinged dishes from West Bengal and Bangladesh.',
    icon: '🐟',
    colorTag: '#A78BFA',
    slug: 'bengali',
  },
  {
    name: 'Maharashtrian',
    type: 'cuisine',
    description: 'Wholesome and spicy cuisine from Maharashtra — Pav Bhaji, Vada Pav, Misal and more.',
    icon: '🌶️',
    colorTag: '#FB923C',
    slug: 'maharashtrian',
  },
  {
    name: 'Gujarati',
    type: 'cuisine',
    description: 'Vegetarian-centric, mildly sweet and nutritious dishes from the state of Gujarat.',
    icon: '🫙',
    colorTag: '#FBBF24',
    slug: 'gujarati',
  },
];

const FITNESS_CATEGORIES: CategoryDef[] = [
  {
    name: 'Fat Loss',
    type: 'fitness_goal',
    description: 'Low-calorie recipes designed to help you shed body fat effectively.',
    icon: '🔥',
    colorTag: '#EF4444',
    slug: 'fat-loss',
  },
  {
    name: 'Muscle Gain',
    type: 'fitness_goal',
    description: 'High-calorie, high-protein recipes to support muscle hypertrophy.',
    icon: '💪',
    colorTag: '#3B82F6',
    slug: 'muscle-gain',
  },
  {
    name: 'Maintenance',
    type: 'fitness_goal',
    description: 'Balanced macros and everyday healthy eating to maintain your current physique.',
    icon: '⚖️',
    colorTag: '#4ECDC4',
    slug: 'maintenance',
  },
];

const ALL_CATEGORIES = [...CATEGORIES, ...FITNESS_CATEGORIES];

// ─── Difficulty from minutes ───────────────────────────────────────────────────
function getDifficulty(minutes: number): 'Easy' | 'Medium' | 'Hard' {
  if (minutes <= 30) return 'Easy';
  if (minutes <= 60) return 'Medium';
  return 'Hard';
}

// ─── Safe parse number ────────────────────────────────────────────────────────
function safeNum(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

// ─── Parse ingredients string → array ────────────────────────────────────────
function parseIngredients(raw: string): { name: string; quantity: number; unit: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }[] {
  if (!raw) return [{ name: 'See instructions', quantity: 1, unit: '', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map(name => ({ name, quantity: 1, unit: 'portion', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }));
}

// ─── Parse instructions → steps array ────────────────────────────────────────
function parseSteps(raw: string): string[] {
  if (!raw) return ['Follow the recipe instructions as described.'];
  // Split on sentence endings or numbered steps
  const steps = raw
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 30);
  return steps.length > 0 ? steps : [raw.trim().slice(0, 500)];
}

// ─── Row interface ────────────────────────────────────────────────────────────
interface Row {
  recipe_original: string;
  final_food_name: string;
  TotalTimeInMins: string;
  Cuisine: string;
  TranslatedInstructions: string;
  TranslatedIngredients: string;
  'Cleaned-Ingredients': string;
  'Calories (kcal)': string;
  'Carbohydrates (g)': string;
  'Protein (g)': string;
  'Fats (g)': string;
  'Free Sugar (g)': string;
  'Fibre (g)': string;
  [key: string]: string;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Recipeak — Indian Food Dataset Seeder');
  console.log('═══════════════════════════════════════════════\n');

  if (LIMIT_PER_CATEGORY !== Infinity) {
    console.log(`⚡ Test mode: max ${LIMIT_PER_CATEGORY} recipes per category\n`);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ Dataset not found at: ${CSV_PATH}`);
    process.exit(1);
  }
  console.log(`📂 Dataset: ${CSV_PATH}`);

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeak';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  // ── Upsert all categories ──
  console.log('📂 Creating categories...');
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();

  for (const cat of ALL_CATEGORIES) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await Category.create(cat);
      console.log(`   ✅ Created: ${cat.icon} ${cat.name}`);
    } else {
      console.log(`   ℹ️  Exists:  ${cat.icon} ${cat.name}`);
    }
    categoryMap.set(cat.slug, existing._id as mongoose.Types.ObjectId);
  }

  // Default fallback = north-indian
  const fallbackId = categoryMap.get('north-indian')!;

  // ── Ensure kaggleId index ──
  try {
    await Recipe.collection.createIndex({ kaggleId: 1 }, { unique: true, sparse: true });
  } catch { /* already exists */ }

  // ── Stream CSV ──
  console.log('\n📥 Importing recipes...\n');

  const categoryCounts = new Map<string, number>();
  let totalInserted = 0;
  let totalSkipped = 0;
  let rowIndex = 0;
  let batch: any[] = [];

  const flushBatch = async () => {
    if (batch.length === 0) return;
    try {
      const result = await Recipe.insertMany(batch, { ordered: false });
      totalInserted += result.length;
    } catch (err: any) {
      if (err.insertedDocs) totalInserted += err.insertedDocs.length;
      const dupes = (err.writeErrors || []).filter((e: any) => e.code === 11000).length;
      totalSkipped += dupes;
    }
    batch = [];
  };

  await new Promise<void>((resolve, reject) => {
    const fileStream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' });
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
    });

    parser.on('readable', async () => {
      let row: Row;
      while ((row = parser.read()) !== null) {
        rowIndex++;

        const cuisine = row.Cuisine?.trim() || '';
        const slug = CUISINE_CATEGORY_MAP[cuisine] || 'north-indian';
        const categoryId = categoryMap.get(slug) || fallbackId;

        // Enforce per-category limit
        const count = categoryCounts.get(slug) ?? 0;
        if (count >= LIMIT_PER_CATEGORY) continue;
        categoryCounts.set(slug, count + 1);

        const minutes = Math.min(safeNum(row.TotalTimeInMins) || 30, 480);
        const prepTime = Math.max(5, Math.floor(minutes * 0.35));
        const cookTime = Math.max(5, minutes - prepTime);

        const calories = safeNum(row['Calories (kcal)']);
        const protein = safeNum(row['Protein (g)']);
        const carbs = safeNum(row['Carbohydrates (g)']);
        
        let fitnessSlug = 'maintenance';
        if (calories > 0 && calories < 400) {
          fitnessSlug = 'fat-loss';
        } else if (calories >= 400 && calories <= 600) {
          fitnessSlug = 'maintenance';
        } else if (calories > 600) {
          fitnessSlug = 'muscle-gain';
        }
        
        const fitnessCategoryId = categoryMap.get(fitnessSlug) || null;

        const title = (row.recipe_original || row.final_food_name || 'Untitled').replace(/Recipe/ig, '').split('(')[0].trim();

        const doc = {
          title,
          description: `A delicious ${cuisine} recipe${minutes ? ` that takes ${minutes} minutes to prepare` : ''}.`,
          imageUrl: '',
          category: categoryId,
          fitnessCategory: fitnessCategoryId,
          tags: [cuisine, slug].filter(Boolean).map(t => t.toLowerCase()),
          difficulty: getDifficulty(minutes),
          prepTime,
          cookTime,
          servings: 4,
          ingredients: parseIngredients(row.TranslatedIngredients || row['Cleaned-Ingredients']),
          steps: parseSteps(row.TranslatedInstructions),
          nutritionSummary: {
            calories:   safeNum(row['Calories (kcal)']),
            protein_g:  safeNum(row['Protein (g)']),
            carbs_g:    safeNum(row['Carbohydrates (g)']),
            fat_g:      safeNum(row['Fats (g)']),
            fiber_g:    safeNum(row['Fibre (g)']),
            sugar_g:    safeNum(row['Free Sugar (g)']),
          },
          kaggleId: rowIndex, // Use row index as unique ID
        };

        batch.push(doc);

        if (batch.length >= BATCH_SIZE) {
          parser.pause();
          await flushBatch();
          if (totalInserted % 500 === 0 && totalInserted > 0) {
            console.log(`   📊 ${totalInserted.toLocaleString()} inserted so far...`);
          }
          parser.resume();
        }
      }
    });

    parser.on('error', reject);
    parser.on('end', async () => {
      await flushBatch();
      resolve();
    });

    fileStream.pipe(parser);
  });

  // ── Summary ──
  console.log('\n' + '═'.repeat(50));
  console.log('🎉 Import Complete!');
  console.log(`   ✅ Inserted:  ${totalInserted.toLocaleString()} recipes`);
  console.log(`   ⏭️  Skipped:   ${totalSkipped.toLocaleString()} duplicates`);
  console.log(`   📋 Total rows: ${rowIndex.toLocaleString()}`);
  console.log('═'.repeat(50));

  console.log('\n📂 Category Breakdown:');
  for (const [slug, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])) {
    const cat = ALL_CATEGORIES.find(c => c.slug === slug);
    console.log(`   ${cat?.icon ?? '•'} ${(cat?.name ?? slug).padEnd(20)} ${count.toLocaleString()} recipes`);
  }

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
  process.exit(0);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
