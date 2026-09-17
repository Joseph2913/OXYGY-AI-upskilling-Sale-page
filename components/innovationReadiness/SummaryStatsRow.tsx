import React from 'react';

const BORDER = '#CBD5E0';

export interface SummaryStat {
  label: string;
  value: string;
}

/** Top stat strip on a results dashboard — matches the "Overall score / Strongest area /
 * Biggest gap / Response rate" tile row from the Assessment Interface & Automation deck slide. */
export const SummaryStatsRow: React.FC<{ stats: SummaryStat[] }> = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
    {stats.map((s) => (
      <div key={s.label} className="rounded-xl p-4" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
        <p className="text-[15px] font-bold text-[#1A202C] leading-tight mb-1 truncate">{s.value}</p>
        <p className="text-[11px] font-semibold text-[#718096]">{s.label}</p>
      </div>
    ))}
  </div>
);
