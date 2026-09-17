import React from 'react';
import { Sparkles, User, Building2, Clock, MapPin } from 'lucide-react';
import type { AssessmentResult } from '../../data/innovationReadinessPersonas';
import { QUADRANT_INFO } from '../../data/innovationReadinessPersonas';
import { QuadrantChart } from './QuadrantChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const band = (v: number) => (v <= 2 ? { label: 'Weak', color: '#D97B4A' } : v === 3 ? { label: 'Mixed', color: '#C4A934' } : { label: 'Strong', color: '#38A169' });

const AxisTile: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => {
  const b = band(value);
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: hexA(accent, 0.07), border: `1px solid ${hexA(accent, 0.22)}` }}>
      <p className="text-[10.5px] uppercase tracking-[0.06em] text-[#A0AEC0] font-bold">{label}</p>
      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className="text-[26px] font-bold" style={{ color: accent }}>{value.toFixed(1)}</span>
        <span className="text-[12px] text-[#A0AEC0]">/ 5</span>
      </div>
      <p className="text-[12.5px] font-bold mt-1" style={{ color: b.color }}>{b.label}</p>
    </div>
  );
};

const RespondentChip: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#4A5568]" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
    {icon} {text}
  </span>
);

interface ResultsDashboardProps {
  result: AssessmentResult;
  onBack: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onBack }) => {
  const quadrant = QUADRANT_INFO[result.quadrant];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-1">Results</p>
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#1A202C]">{result.personaLabel}</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-semibold px-4 py-2 rounded-full transition-colors"
          style={{ color: DARK, border: `1px solid ${PALE_BORDER}` }}
        >
          &larr; Back
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <RespondentChip icon={<User size={13} />} text={result.respondent.roleLevel} />
        <RespondentChip icon={<Building2 size={13} />} text={result.respondent.department} />
        <RespondentChip icon={<Clock size={13} />} text={result.respondent.tenure} />
        <RespondentChip icon={<MapPin size={13} />} text={result.respondent.location} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-8">
        {/* Left: axis scores + quadrant matrix */}
        <div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <AxisTile label="Strategic Context" value={result.axisScores.strategicContext} accent={ACCENT} />
            <AxisTile label="Work Environment" value={result.axisScores.workEnvironment} accent={ACCENT} />
          </div>
          <QuadrantChart
            strategicContext={result.axisScores.strategicContext}
            workEnvironment={result.axisScores.workEnvironment}
            quadrant={result.quadrant}
          />
          <div className="rounded-xl p-4 mt-4 flex items-start gap-3" style={{ backgroundColor: hexA(quadrant.color, 0.06), border: `1px solid ${hexA(quadrant.color, 0.22)}` }}>
            <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(quadrant.color, 0.15) }}>
              <Sparkles size={16} style={{ color: quadrant.color }} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-[#1A202C]">{quadrant.name}</p>
              <p className="text-[12px] text-[#718096]">{quadrant.tag}</p>
            </div>
          </div>
        </div>

        {/* Right: per-category breakdown */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-4">Category breakdown</p>
          <CategoryBreakdownChart categories={result.categoryScores} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Recommendations</p>
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
            Draft &mdash; will be agent-generated per response
          </span>
        </div>
        <ul className="space-y-2.5">
          {result.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-[#2D3748] leading-[1.55]">
              <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
