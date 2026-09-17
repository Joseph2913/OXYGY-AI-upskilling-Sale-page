import React from 'react';
import { AlertTriangle, RadioTower, Lightbulb, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { QUADRANT_INFO, ProfileId } from '../../data/innovationReadinessPersonas';

const DARK = '#1E3A5F';

const QUADRANT_ICON: Record<ProfileId, LucideIcon> = {
  'sitting-duck': AlertTriangle,
  'disconnected-antenna': RadioTower,
  'island-of-creativity': Lightbulb,
  'systematic-innovator': Trophy,
};

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface QuadrantChartProps {
  strategicContext: number; // 1-5
  workEnvironment: number; // 1-5
  quadrant: ProfileId;
}

/** The 2x2 AI Innovator Profile Matrix, with the respondent's own point plotted on it. */
export const QuadrantChart: React.FC<QuadrantChartProps> = ({ strategicContext, workEnvironment, quadrant }) => {
  const active = QUADRANT_INFO[quadrant];
  const left = ((workEnvironment - 1) / 4) * 100;
  const top = (1 - (strategicContext - 1) / 4) * 100;

  const cells: ProfileId[] = ['disconnected-antenna', 'systematic-innovator', 'sitting-duck', 'island-of-creativity'];

  return (
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

        <div className="relative flex-1">
          <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1 / 1' }}>
            {cells.map((id) => {
              const info = QUADRANT_INFO[id];
              const Icon = QUADRANT_ICON[id];
              const isActive = id === quadrant;
              return (
                <div
                  key={id}
                  className="relative rounded-xl p-3 sm:p-4 flex flex-col items-start text-left transition-all"
                  style={{
                    backgroundColor: hexA(info.color, isActive ? 0.22 : 0.06),
                    border: isActive ? `2px solid ${info.color}` : '1px solid #E2E8F0',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon size={16} style={{ color: info.color }} className="shrink-0" />
                    <span className="text-[12.5px] font-bold leading-tight" style={{ color: isActive ? DARK : '#2D3748' }}>
                      {info.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.04em] leading-[1.35] text-[#A0AEC0]">{info.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Plotted point for this individual's actual scores */}
          <div
            className="absolute pointer-events-none z-20"
            style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)' }}
          >
            <span
              className="block w-4 h-4 rounded-full"
              style={{ backgroundColor: active.color, border: '2.5px solid #FFFFFF', boxShadow: `0 0 0 4px ${hexA(active.color, 0.25)}` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 pl-8">
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Conventional</span>
        <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568]">WORK ENVIRONMENT</span>
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Innovative</span>
      </div>
    </div>
  );
};
