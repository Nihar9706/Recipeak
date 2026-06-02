import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const searchRecipesWithAI = async (
  query: string,
  recipes: any[],
  categories: any[]
): Promise<string> => {
  // Build recipe context for the system prompt
  const recipeContext = recipes
    .map(
      (r) =>
        `- "${r.title}" [${r.category?.name || 'Unknown'}] — ${r.nutritionSummary.calories} cal, ${r.nutritionSummary.protein_g}g protein, ${r.nutritionSummary.carbs_g}g carbs, ${r.nutritionSummary.fat_g}g fat | Prep: ${r.prepTime}min | ${r.difficulty} | Tags: ${r.tags.join(', ')}`
    )
    .join('\n');

  const categoryList = categories
    .map((c) => `${c.name} (${c.type})`)
    .join(', ');

  const systemPrompt = `You are Recipeak AI — a smart recipe assistant for athletes and fitness-focused people.

Your database contains the following categories: ${categoryList}

Here are all available recipes:
${recipeContext}

INSTRUCTIONS:
1. When a user asks for recipe recommendations, ONLY recommend recipes from the list above.
2. Always mention the exact recipe title in quotes so the system can link to it.
3. Explain WHY each recipe fits their goal (nutrition breakdown, timing, sport benefit).
4. Be concise, enthusiastic, and knowledgeable about sports nutrition.
5. If no recipe matches perfectly, suggest the closest options and explain tradeoffs.
6. Format your response with clear sections and bullet points.
7. Limit recommendations to 3-5 recipes per query.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  });

  // Extract text from response
  const textContent = message.content.find((block) => block.type === 'text');
  return textContent?.text || 'Sorry, I could not generate a response. Please try again.';
};
