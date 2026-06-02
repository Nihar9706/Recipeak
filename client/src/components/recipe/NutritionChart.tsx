import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { NutritionSummary } from '../../types';

interface NutritionChartProps {
  nutrition: NutritionSummary;
  servings?: number;
}

const MACRO_COLORS = {
  protein: '#5BA3D9',   // primary blue
  carbs: '#FFCB8E',     // warm peach
  fat: '#E57373',       // soft red
};

// Daily recommended values
const DAILY_RECOMMENDED = {
  calories: 2000,
  protein_g: 50,
  carbs_g: 300,
  fat_g: 65,
  fiber_g: 25,
  sugar_g: 50,
};

export default function NutritionChart({ nutrition, servings = 1 }: NutritionChartProps) {
  const scaled = useMemo(() => ({
    calories: Math.round(nutrition.calories * servings),
    protein_g: Math.round(nutrition.protein_g * servings * 10) / 10,
    carbs_g: Math.round(nutrition.carbs_g * servings * 10) / 10,
    fat_g: Math.round(nutrition.fat_g * servings * 10) / 10,
    fiber_g: Math.round(nutrition.fiber_g * servings * 10) / 10,
    sugar_g: Math.round(nutrition.sugar_g * servings * 10) / 10,
  }), [nutrition, servings]);

  const pieData = [
    { name: 'Protein', value: scaled.protein_g, color: MACRO_COLORS.protein },
    { name: 'Carbs', value: scaled.carbs_g, color: MACRO_COLORS.carbs },
    { name: 'Fat', value: scaled.fat_g, color: MACRO_COLORS.fat },
  ];

  const totalMacroGrams = scaled.protein_g + scaled.carbs_g + scaled.fat_g;

  const nutrients = [
    { label: 'Calories', value: scaled.calories, unit: 'kcal', daily: DAILY_RECOMMENDED.calories, color: '#2C2825' },
    { label: 'Protein', value: scaled.protein_g, unit: 'g', daily: DAILY_RECOMMENDED.protein_g, color: MACRO_COLORS.protein },
    { label: 'Carbs', value: scaled.carbs_g, unit: 'g', daily: DAILY_RECOMMENDED.carbs_g, color: MACRO_COLORS.carbs },
    { label: 'Fat', value: scaled.fat_g, unit: 'g', daily: DAILY_RECOMMENDED.fat_g, color: MACRO_COLORS.fat },
    { label: 'Fiber', value: scaled.fiber_g, unit: 'g', daily: DAILY_RECOMMENDED.fiber_g, color: '#7BC9A4' },
    { label: 'Sugar', value: scaled.sugar_g, unit: 'g', daily: DAILY_RECOMMENDED.sugar_g, color: '#C8A2E8' },
  ];

  return (
    <div className="rounded-2xl bg-bg-card border border-border p-8">
      <h3 className="font-display text-2xl font-bold mb-8 text-text">Nutrition Facts</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex flex-col items-center">
          <div className="w-52 h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold text-text">{scaled.calories}</span>
              <span className="text-sm text-text-muted font-medium">kcal</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-5">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-text-muted">{entry.name}</span>
                <span className="font-mono font-semibold text-text">
                  {totalMacroGrams > 0 ? Math.round((entry.value / totalMacroGrams) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {nutrients.map((n, i) => {
            const percentage = Math.min((n.value / n.daily) * 100, 100);
            return (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-text">{n.label}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: n.color }}>
                    {n.value}{n.unit}
                    <span className="text-text-dim text-xs font-normal"> / {n.daily}{n.unit}</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-border/40 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: n.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
