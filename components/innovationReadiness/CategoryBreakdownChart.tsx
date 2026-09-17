import React from 'react';
import type { CategoryScore } from '../../data/innovationReadinessPersonas';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';

const band = (v: number) => (v <= 2 ? { label: 'Weak', color: '#D97B4A' } : v === 3 ? { label: 'Mixed', color: '#C4A934' } : { label: 'Strong', color: '#38A169' });

interface CategoryBreakdownChartProps {
  categories: CategoryScore[];
}

/** Simple horizontal bar chart — one bar per scored category, 1-5 scale. */
export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => (
  <div className="space-y-4">
    {categories.map((c) => {
      const pct = (c.score / 5) * 100;
      const b = band(c.score);
      return (
        <div key={c.category}>
          <div className="flex items-baseline justify-between mb-1.5">
            <p className="text-[13px] font-semibold text-[#2D3748]">{c.label}</p>
            <p className="text-[12.5px] font-bold" style={{ color: b.color }}>
              {c.score.toFixed(1)} <span className="text-[10.5px] font-semibold text-[#A0AEC0]">/ 5 &middot; {b.label}</span>
            </p>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
          </div>
        </div>
      );
    })}
  </div>
);
