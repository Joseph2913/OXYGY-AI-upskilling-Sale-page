import React from 'react';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';

interface ProgressBarProps {
  stepIndex: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stepIndex, totalSteps, stepLabel }) => {
  const pct = ((stepIndex + 1) / totalSteps) * 100;
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: DARK }}>
          Step {stepIndex + 1} of {totalSteps} &mdash; {stepLabel}
        </p>
        <p className="text-[11px] font-semibold text-[#A0AEC0]">{Math.round(pct)}%</p>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
      </div>
    </div>
  );
};
