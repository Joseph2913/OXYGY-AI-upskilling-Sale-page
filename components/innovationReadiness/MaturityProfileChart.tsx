import React from 'react';
import { QUADRANT_INFO, ProfileId } from '../../data/innovationReadinessPersonas';

const DARK = '#1E3A5F';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

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

const CELLS: ProfileId[] = ['disconnected-antenna', 'systematic-innovator', 'sitting-duck', 'island-of-creativity'];

/** The 2x2 AI Innovator Profile Matrix, full width, with quadrant names/tags shown inside each
 * cell and every point plotted at its actual strategic-context/work-environment score. */
export const MaturityProfileChart: React.FC<MaturityProfileChartProps> = ({ points }) => (
  <div className="w-full select-none">
    <div className="flex gap-2">
      {/* Y axis */}
      <div className="flex flex-col items-center justify-between py-1">
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Defined</span>
        <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          STRATEGIC CONTEXT
        </span>
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Unclear</span>
      </div>

      <div className="relative flex-1" style={{ maxWidth: 320 }}>
        <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1 / 1' }}>
          {CELLS.map((id) => {
            const info = QUADRANT_INFO[id];
            return (
              <div key={id} className="relative rounded-lg p-3 flex flex-col items-start text-left" style={{ backgroundColor: hexA(info.color, 0.06), border: '1px solid #E2E8F0' }}>
                <span className="text-[11px] font-bold leading-tight text-[#2D3748]">{info.name}</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.03em] leading-[1.3] text-[#A0AEC0] mt-0.5">{info.tag}</span>
              </div>
            );
          })}
        </div>

        {points.map((p) => {
          const pos = toPosition(p.strategicContext, p.workEnvironment);
          const size = p.size === 'lg' ? 22 : 7;
          return (
            <span
              key={p.id}
              className="absolute z-10"
              title={p.title}
              style={{ left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%,-50%)' }}
            >
              <span
                className="block rounded-full"
                style={{ width: size, height: size, backgroundColor: p.color, border: '2px solid #FFFFFF', boxShadow: `0 0 0 1px ${hexA(p.color, 0.4)}` }}
              />
            </span>
          );
        })}
      </div>
    </div>

    <div className="flex justify-between items-center mt-2 pl-8">
      <span className="text-[10px] font-semibold text-[#A0AEC0]">Conventional</span>
      <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568]">WORK ENVIRONMENT</span>
      <span className="text-[10px] font-semibold text-[#A0AEC0]">Innovative</span>
    </div>
  </div>
);
