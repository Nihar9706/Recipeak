import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'fitness_goal' | 'sport';
  description: string;
  icon: string;
  colorTag: string;
  slug: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['fitness_goal', 'sport'],
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    colorTag: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
