import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface INutritionSummary {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  imageUrl: string;
  category: mongoose.Types.ObjectId;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: IIngredient[];
  steps: string[];
  nutritionSummary: INutritionSummary;
  spoonacularId: number | null;
  createdAt: Date;
}

const ingredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    protein_g: { type: Number, default: 0 },
    carbs_g: { type: Number, default: 0 },
    fat_g: { type: Number, default: 0 },
  },
  { _id: false }
);

const nutritionSummarySchema = new Schema<INutritionSummary>(
  {
    calories: { type: Number, default: 0 },
    protein_g: { type: Number, default: 0 },
    carbs_g: { type: Number, default: 0 },
    fat_g: { type: Number, default: 0 },
    fiber_g: { type: Number, default: 0 },
    sugar_g: { type: Number, default: 0 },
  },
  { _id: false }
);

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    cookTime: {
      type: Number,
      default: 0,
    },
    servings: {
      type: Number,
      default: 1,
      min: 1,
    },
    ingredients: [ingredientSchema],
    steps: [{ type: String }],
    nutritionSummary: {
      type: nutritionSummarySchema,
      required: true,
    },
    spoonacularId: {
      type: Number,
      default: null,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient filtering and search
recipeSchema.index({ category: 1 });
recipeSchema.index({ 'nutritionSummary.calories': 1 });
recipeSchema.index({ 'nutritionSummary.protein_g': -1 });
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ spoonacularId: 1 }, { unique: true, sparse: true });

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);
