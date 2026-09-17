import React from 'react';
import type { CategoryScore } from '../../data/innovationReadinessPersonas';

const ACCENT = '#2B4C7E';

interface CategoryBreakdownChartProps {
  categories: CategoryScore[];
}

/** Plain horizontal bar per scored category (1–5 scale) — label above a thin track, matching the
 * "Score by category" panel from the Assessment Interface & Automation deck slide. */
export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => (
  <div className="space-y-4">
    {categories.map((c) => {
      const pct = (c.score / 5) * 100;
      return (
        <div key={c.category}>
          <div className="flex items-baseline justify-between mb-1.5">
            <p className="text-[13px] font-semibold text-[#2D3748]">{c.label}</p>
            <p className="text-[11.5px] font-semibold text-[#A0AEC0]">{c.score.toFixed(1)} / 5</p>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
          </div>
        </div>
      );
    })}
  </div>
);
