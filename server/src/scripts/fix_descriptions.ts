import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Recipe } from '../models/Recipe';
dotenv.config();

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE = 'https://api.spoonacular.com';
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fix() {
  console.log('Connecting to DB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeak');
  
  const recipes = await Recipe.find({ description: { $regex: /\.\.\.$/ } });
  console.log(`Found ${recipes.length} recipes with truncated descriptions.`);

  let count = 0;
  for (const r of recipes) {
    if (!r.spoonacularId) continue;
    
    try {
      await delay(1200);
      const detail = await axios.get(`${BASE}/recipes/${r.spoonacularId}/information`, { 
        params: { apiKey: API_KEY } 
      });
      
      const fullText = (detail.data.summary || '').replace(/<[^>]*>/g, '');
      r.description = fullText;
      await r.save();
      console.log(`✅ Fixed: ${r.title}`);
      count++;
    } catch (err: any) {
      console.error(`❌ Failed on ${r.title}:`, err.message);
    }
  }
  
  console.log(`\n🎉 Done! Fixed ${count} recipes.`);
  await mongoose.disconnect();
  process.exit(0);
}

fix();
