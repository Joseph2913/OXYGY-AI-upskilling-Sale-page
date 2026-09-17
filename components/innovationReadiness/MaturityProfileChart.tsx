import React from 'react';

const BORDER = '#CBD5E0';

export interface MaturityPoint {
  id: string;
  strategicContext: number;
  workEnvironment: number;
  color: string;
  size?: 'sm' | 'lg';
  title?: string;
}

interface MaturityProfileChartProps {
  points: MaturityPoint[];
}

const toPosition = (strategicContext: number, workEnvironment: number) => ({
  left: ((workEnvironment - 1) / 4) * 100,
  top: (1 - (strategicContext - 1) / 4) * 100,
});

/** A scatter of strategic-context/work-environment placements over a 2x2 grid — quadrant
 * boundaries visible as gridlines, dots marking where each point actually lands. Matches the
 * "Maturity profile" panel from the Assessment Interface & Automation deck slide; the quadrant
 * name itself is called out separately by whichever dashboard renders this, since the deck panel
 * is a layout mock, not a legend. */
export const MaturityProfileChart: React.FC<MaturityProfileChartProps> = ({ points }) => (
  <div className="rounded-xl p-5" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-5">Maturity profile</p>
    <div className="relative mx-auto" style={{ aspectRatio: '1 / 1', maxWidth: 280, border: `1px solid ${BORDER}` }}>
      {/* Quadrant midlines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: BORDER }} />
      <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: BORDER }} />
      {points.map((p) => {
        const pos = toPosition(p.strategicContext, p.workEnvironment);
        const size = p.size === 'lg' ? 16 : 8;
        return (
          <span
            key={p.id}
            className="absolute rounded-full"
            title={p.title}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              width: size,
              height: size,
              transform: 'translate(-50%,-50%)',
              backgroundColor: p.color,
              border: '2px solid #FFFFFF',
              boxShadow: `0 0 0 1px ${BORDER}`,
            }}
          />
        );
      })}
    </div>
    <p className="text-[11px] font-semibold text-[#A0AEC0] text-center mt-4">Strategic context &times; work environment</p>
  </div>
);
