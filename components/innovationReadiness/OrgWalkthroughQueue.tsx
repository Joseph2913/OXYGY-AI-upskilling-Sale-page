import React from 'react';
import { CheckCircle2, Circle, Users } from 'lucide-react';
import { DemoPersonaInput } from '../../data/innovationReadinessPersonas';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface OrgWalkthroughQueueProps {
  queue: DemoPersonaInput[];
  completedIds: Set<string>;
  onSelect: (persona: DemoPersonaInput) => void;
}

/** Lists the mock respondents that make up the Org View, one at a time — the aggregated dashboard
 * only appears once every respondent here has been clicked through and submitted. */
export const OrgWalkthroughQueue: React.FC<OrgWalkthroughQueueProps> = ({ queue, completedIds, onSelect }) => {
  const doneCount = queue.filter((p) => completedIds.has(p.id)).length;
  const pct = (doneCount / queue.length) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-[14.5px] font-bold text-[#1A202C]">Click through each respondent to build the Org View</p>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
          <Users size={13} /> {doneCount} of {queue.length} completed
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden mb-6" style={{ backgroundColor: '#E2E8F0' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {queue.map((persona) => {
          const done = completedIds.has(persona.id);
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelect(persona)}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: done ? hexA('#38A169', 0.06) : '#F7FAFC',
                border: done ? '1px solid #9AE6B4' : '1px solid #E2E8F0',
              }}
            >
              {done ? <CheckCircle2 size={18} style={{ color: '#38A169' }} className="shrink-0" /> : <Circle size={18} style={{ color: '#A0AEC0' }} className="shrink-0" />}
              <span className="text-[13.5px] font-semibold" style={{ color: done ? '#276749' : '#2D3748' }}>{persona.personaLabel}</span>
              {done && <span className="ml-auto text-[11px] font-bold text-[#38A169]">Redo</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
