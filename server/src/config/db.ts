import mongoose from 'mongoose';
import { env } from './env';

// Cache connection for serverless environments
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    if (env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};
