import React from 'react';
import { QUADRANT_INFO, ProfileId } from '../../data/innovationReadinessPersonas';

const DARK = '#1E3A5F';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export interface OrgQuadrantPoint {
  id: string;
  label: string;
  strategicContext: number;
  workEnvironment: number;
  quadrant: ProfileId;
}

interface OrgQuadrantChartProps {
  points: OrgQuadrantPoint[];
  mean: { strategicContext: number; workEnvironment: number };
}

const toPosition = (strategicContext: number, workEnvironment: number) => ({
  left: ((workEnvironment - 1) / 4) * 100,
  top: (1 - (strategicContext - 1) / 4) * 100,
});

/** The 2x2 AI Innovator Profile Matrix with every filtered respondent plotted as one small dot,
 * plus a larger ringed dot for the group's average — the org-level counterpart to QuadrantChart,
 * which plots a single individual. */
export const OrgQuadrantChart: React.FC<OrgQuadrantChartProps> = ({ points, mean }) => {
  const cells: ProfileId[] = ['disconnected-antenna', 'systematic-innovator', 'sitting-duck', 'island-of-creativity'];
  const meanPos = toPosition(mean.strategicContext, mean.workEnvironment);

  return (
    <div className="w-full select-none">
      <div className="flex gap-2">
        <div className="flex flex-col items-center justify-between py-1">
          <span className="text-[10px] font-semibold text-[#A0AEC0]">Defined</span>
          <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            STRATEGIC CONTEXT
          </span>
          <span className="text-[10px] font-semibold text-[#A0AEC0]">Unclear</span>
        </div>

        <div className="relative flex-1">
          <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1 / 1' }}>
            {cells.map((id) => {
              const info = QUADRANT_INFO[id];
              return (
                <div key={id} className="relative rounded-xl p-3 sm:p-4 flex flex-col items-start text-left" style={{ backgroundColor: hexA(info.color, 0.06), border: '1px solid #E2E8F0' }}>
                  <span className="text-[12.5px] font-bold leading-tight text-[#2D3748]">{info.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.04em] leading-[1.35] text-[#A0AEC0] mt-1">{info.tag}</span>
                </div>
              );
            })}
          </div>

          {/* One dot per filtered respondent */}
          {points.map((p) => {
            const pos = toPosition(p.strategicContext, p.workEnvironment);
            const color = QUADRANT_INFO[p.quadrant].color;
            return (
              <div
                key={p.id}
                className="absolute z-10"
                style={{ left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%,-50%)' }}
                title={p.label}
              >
                <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: color, border: '1.5px solid #FFFFFF', boxShadow: `0 0 0 1.5px ${hexA(color, 0.4)}` }} />
              </div>
            );
          })}

          {/* Group average, larger and ringed so it reads distinctly from individual points */}
          {points.length > 0 && (
            <div className="absolute z-20 pointer-events-none" style={{ left: `${meanPos.left}%`, top: `${meanPos.top}%`, transform: 'translate(-50%,-50%)' }}>
              <span className="block w-5 h-5 rounded-full" style={{ backgroundColor: DARK, border: '3px solid #FFFFFF', boxShadow: `0 0 0 2px ${DARK}, 0 2px 6px rgba(30,58,95,0.35)` }} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 pl-8">
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Conventional</span>
        <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568]">WORK ENVIRONMENT</span>
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Innovative</span>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DARK }} />
          <span className="text-[11px] font-semibold text-[#4A5568]">Group average</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A0AEC0' }} />
          <span className="text-[11px] font-semibold text-[#4A5568]">Individual respondent</span>
        </div>
      </div>
    </div>
  );
};
