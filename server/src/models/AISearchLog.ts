import mongoose, { Schema, Document } from 'mongoose';

export interface IAISearchLog extends Document {
  user: mongoose.Types.ObjectId;
  query: string;
  responseSummary: string;
  recipeIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const aiSearchLogSchema = new Schema<IAISearchLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    responseSummary: {
      type: String,
      default: '',
    },
    recipeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  {
    timestamps: true,
  }
);

aiSearchLogSchema.index({ user: 1, createdAt: -1 });

export const AISearchLog = mongoose.model<IAISearchLog>('AISearchLog', aiSearchLogSchema);
