import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function clearAll() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeak';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  try { await mongoose.connection.db.dropCollection('recipes'); } catch (e) {}
  try { await mongoose.connection.db.dropCollection('categories'); } catch (e) {}
  console.log('Collections dropped');
  await mongoose.disconnect();
}

clearAll().catch(console.error);
