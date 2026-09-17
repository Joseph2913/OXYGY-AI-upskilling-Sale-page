import React from 'react';
import { User, Building2, Clock, MapPin } from 'lucide-react';
import type { AssessmentResult } from '../../data/innovationReadinessPersonas';
import { QUADRANT_INFO } from '../../data/innovationReadinessPersonas';
import { MaturityProfileChart } from './MaturityProfileChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { SummaryStatsRow } from './SummaryStatsRow';

const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';
const BORDER = '#CBD5E0';

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
  const overall = (result.axisScores.strategicContext + result.axisScores.workEnvironment) / 2;
  const strongest = result.categoryScores.reduce((a, b) => (b.score > a.score ? b : a));
  const gap = result.categoryScores.reduce((a, b) => (b.score < a.score ? b : a));

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

      <div className="flex flex-wrap gap-2 mb-6">
        <RespondentChip icon={<User size={13} />} text={result.respondent.roleLevel} />
        <RespondentChip icon={<Building2 size={13} />} text={result.respondent.department} />
        <RespondentChip icon={<Clock size={13} />} text={result.respondent.tenure} />
        <RespondentChip icon={<MapPin size={13} />} text={result.respondent.location} />
      </div>

      <SummaryStatsRow
        stats={[
          { label: 'Overall score', value: `${overall.toFixed(1)} / 5` },
          { label: 'Strongest area', value: strongest.label },
          { label: 'Biggest gap', value: gap.label },
          { label: 'Profile', value: quadrant.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl p-5" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-4">Score by category</p>
          <CategoryBreakdownChart categories={result.categoryScores} />
        </div>

        <div className="rounded-xl p-5" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-4">Maturity profile</p>
          <MaturityProfileChart
            points={[{ id: result.id, strategicContext: result.axisScores.strategicContext, workEnvironment: result.axisScores.workEnvironment, color: quadrant.color, size: 'lg', title: quadrant.name }]}
          />
        </div>
      </div>
    </div>
  );
};
