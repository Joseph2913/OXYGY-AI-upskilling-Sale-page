import React from 'react';
import { QUADRANT_INFO } from '../data/innovationReadinessPersonas';
import type { ProfileId } from '../data/innovationReadinessPersonas';

/* Small flat spot illustrations for the homepage offerings.
   Brand palette only, no gradients or shadows. viewBox is 160 × 140. */

const NAVY = '#1E3A5F';
const TEAL = '#38B2AC';
const TEAL_DARK = '#2C9A94';

interface IllustrationProps {
  className?: string;
}

const Svg: React.FC<React.PropsWithChildren<IllustrationProps>> = ({ className, children }) => (
  <svg viewBox="0 0 160 140" className={className} aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/* ── AI Readiness: mini version of the AI Innovator Profile Matrix ── */
const CELL_W = 50;
const CELL_H = 46;
const CELL_GAP = 4;
const GRID_X = 38;
const GRID_Y = 16;

/* Same quadrant order and colours as MaturityProfileChart: top row = defined strategy. */
const MATRIX_CELLS: { id: ProfileId; col: number; row: number }[] = [
  { id: 'disconnected-antenna', col: 0, row: 0 },
  { id: 'systematic-innovator', col: 1, row: 0 },
  { id: 'sitting-duck', col: 0, row: 1 },
  { id: 'island-of-creativity', col: 1, row: 1 },
];

const MATRIX_DOTS = [
  { x: 58, y: 44, id: 'disconnected-antenna' },
  { x: 70, y: 90, id: 'sitting-duck' },
  { x: 122, y: 94, id: 'island-of-creativity' },
] as const;

const GRID_CENTER_X = GRID_X + CELL_W + CELL_GAP / 2;
const GRID_CENTER_Y = GRID_Y + CELL_H + CELL_GAP / 2;
const AXIS_LABEL = { fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.6px', fill: '#4A5568' };

export const ReadinessIllustration: React.FC<IllustrationProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="8" y="8" width="144" height="124" rx="16" fill="#EEF2FC" />
    {MATRIX_CELLS.map(({ id, col, row }) => (
      <rect
        key={id}
        x={GRID_X + col * (CELL_W + CELL_GAP)}
        y={GRID_Y + row * (CELL_H + CELL_GAP)}
        width={CELL_W}
        height={CELL_H}
        rx="5"
        fill={QUADRANT_INFO[id].color}
        fillOpacity="0.14"
        stroke="#E2E8F0"
      />
    ))}
    {MATRIX_DOTS.map((d) => (
      <circle key={d.id} cx={d.x} cy={d.y} r="3" fill={QUADRANT_INFO[d.id].color} stroke="#FFFFFF" strokeWidth="1" />
    ))}
    {/* "your organisation" — plotted in the Systematic AI Innovator quadrant */}
    <circle cx="116" cy="38" r="7" fill={QUADRANT_INFO['systematic-innovator'].color} stroke="#FFFFFF" strokeWidth="2" />
    <text x={GRID_CENTER_X} y="127" textAnchor="middle" style={AXIS_LABEL}>WORK ENVIRONMENT</text>
    <text
      x="0"
      y="0"
      textAnchor="middle"
      transform={`translate(28 ${GRID_CENTER_Y}) rotate(-90)`}
      style={AXIS_LABEL}
    >
      STRATEGIC CONTEXT
    </text>
  </Svg>
);

/* ── AI Sandbox: idea → proof of concept → pilot inside a sandbox ── */
const SANDBOX_BLOCKS = [
  { x: 34, y: 88, h: 22, fill: '#FBE8A6' },
  { x: 68, y: 72, h: 38, fill: '#E8C547' },
  { x: 102, y: 52, h: 58, fill: '#C4A934' },
];

export const SandboxIllustration: React.FC<IllustrationProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="8" y="8" width="144" height="124" rx="16" fill="#FFFBEA" />
    <rect x="20" y="24" width="120" height="96" rx="12" fill="none" stroke="#E8C547" strokeWidth="1.5" strokeDasharray="5 4" />
    <line x1="28" y1="110" x2="132" y2="110" stroke="#D9C27A" strokeWidth="1.5" strokeLinecap="round" />
    {SANDBOX_BLOCKS.map((b) => (
      <rect key={b.x} x={b.x} y={b.y} width="24" height={b.h} rx="4" fill={b.fill} />
    ))}
    <path d="M46 80 Q63 66 80 64 Q97 56 112 42" fill="none" stroke={TEAL} strokeWidth="1.75" strokeDasharray="3 3" strokeLinecap="round" />
    <path d="M106 41 L113 41 L112 48" fill="none" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    {/* sparkle */}
    <path d="M128 30 L130 35 L135 37 L130 39 L128 44 L126 39 L121 37 L126 35 Z" fill={NAVY} />
  </Svg>
);

/* ── AI Upskilling: five-level staircase with a learner on top ───── */
const STAIR_COLORS = ['#B2F5EA', '#81E6D9', '#4FD1C5', TEAL, TEAL_DARK];
const STAIR_BASE_Y = 116;
const STAIR_WIDTH = 22;
const STAIR_STEP = 12;

export const UpskillingIllustration: React.FC<IllustrationProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="8" y="8" width="144" height="124" rx="16" fill="#E6FFFA" />
    {STAIR_COLORS.map((fill, i) => {
      const h = 14 + i * STAIR_STEP;
      return (
        <rect key={fill} x={24 + i * STAIR_WIDTH} y={STAIR_BASE_Y - h} width={STAIR_WIDTH - 2} height={h} rx="3" fill={fill} />
      );
    })}
    {/* learner on the top step */}
    <circle cx="122" cy="38" r="5.5" fill={NAVY} />
    <path d="M113 54 C113 47 117 45 122 45 C127 45 131 47 131 54 Z" fill={NAVY} />
    {/* sparkle */}
    <path d="M44 34 L46 39 L51 41 L46 43 L44 48 L42 43 L37 41 L42 39 Z" fill={NAVY} />
  </Svg>
);

export const OFFERING_ILLUSTRATIONS: Record<string, React.FC<IllustrationProps>> = {
  'ai-readiness': ReadinessIllustration,
  'ai-sandbox': SandboxIllustration,
  upskilling: UpskillingIllustration,
};
