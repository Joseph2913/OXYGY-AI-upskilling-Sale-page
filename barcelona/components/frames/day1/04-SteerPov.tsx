import type { ReactNode } from 'react';
import { Frame } from '../../Frame';

/**
 * Slide 4 — The Old Playbook Is Gone
 * Four shifts that broke strategic workforce planning. 2×2 card grid with
 * custom inline icons. Each card animates in with a beat (card-break).
 */
export function SteerPov() {
  return (
    <Frame>
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-navy-900 leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4vw,3.5rem)]">
          The old playbook is gone.
        </h2>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.3em] text-teal font-medium">
          Four shifts that broke strategic workforce planning
        </p>
      </div>

      {/* 2x2 grid */}
      <div className="flex-1 grid grid-cols-2 gap-5 mt-7">
        <ShiftCard
          number="01"
          title="Collapsed capability cycles"
          desc="Skills go stale faster than the people who hold them."
          delay={150}
          accent="yellow"
          icon={<HourglassIcon />}
        />
        <ShiftCard
          number="02"
          title="AI breaks role models"
          desc="AI doesn't slot into existing roles, jobs, or org charts."
          delay={300}
          accent="lavender"
          icon={<BrokenGridIcon />}
        />
        <ShiftCard
          number="03"
          title="Pressure without definition"
          desc="Boards expect AI productivity gains they can't yet define."
          delay={450}
          accent="peach"
          icon={<GaugeIcon />}
        />
        <ShiftCard
          number="04"
          title="Data not built for this"
          desc="Workforce data was built for compliance, not strategy."
          delay={600}
          accent="teal"
          icon={<DocumentIcon />}
        />
      </div>

      {/* Footer quote */}
      <p className="mt-6 text-center font-sans italic text-navy-700 text-[clamp(0.95rem,1.2vw,1.15rem)] leading-relaxed">
        Today&rsquo;s CHRO isn&rsquo;t running a more advanced version of yesterday&rsquo;s HR function.{' '}
        <span className="text-navy-900 font-semibold not-italic">
          They&rsquo;re running a fundamentally different operation.
        </span>
      </p>
    </Frame>
  );
}

interface ShiftCardProps {
  number: string;
  title: string;
  desc: string;
  delay: number;
  accent: 'yellow' | 'lavender' | 'peach' | 'teal';
  icon: ReactNode;
}

function ShiftCard({ number, title, desc, delay, accent, icon }: ShiftCardProps) {
  const accentMap = {
    yellow: { bg: 'bg-oxygy-yellow-light', icon: 'text-yellow-700', border: 'border-oxygy-yellow' },
    lavender: { bg: 'bg-oxygy-lavender-light', icon: 'text-navy-700', border: 'border-oxygy-lavender' },
    peach: { bg: 'bg-oxygy-peach-light', icon: 'text-navy-700', border: 'border-oxygy-peach' },
    teal: { bg: 'bg-teal-pale', icon: 'text-teal-dark', border: 'border-teal/40' },
  } as const;
  const c = accentMap[accent];

  return (
    <div
      className={`card-break group relative ${c.bg} border ${c.border} rounded-xl p-7 transition-all duration-200 hover:scale-[1.005] hover:shadow-sm flex flex-col`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-sm text-teal-dark font-semibold tracking-wider">
          {number}
        </p>
        <div className={`${c.icon} opacity-80`}>{icon}</div>
      </div>

      <h3 className="mt-7 font-display font-bold text-navy-900 leading-tight text-[clamp(1.3rem,1.9vw,1.7rem)]">
        {title}
      </h3>
      <p className="mt-3 font-sans text-navy-700 leading-snug text-[clamp(0.95rem,1.1vw,1.05rem)]">
        {desc}
      </p>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────────────────────────────── */

function HourglassIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M10 6 H30 M10 34 H30 M12 6 V13 L20 20 L28 13 V6 M12 34 V27 L20 20 L28 27 V34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BrokenGridIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="6" y="6" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="6" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="6" y="22" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M24 24 L33 33 M33 24 L24 33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M6 26 A14 14 0 0 1 34 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="26" x2="29" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="26" r="2" fill="currentColor" />
      <text x="20" y="36" textAnchor="middle" fontSize="9" fontFamily="DM Sans, sans-serif" fontWeight="600" fill="currentColor">?</text>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M11 6 H24 L30 12 V32 A2 2 0 0 1 28 34 H11 A2 2 0 0 1 9 32 V8 A2 2 0 0 1 11 6 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M24 6 V12 H30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="27" cy="9" r="3" fill="#38B2AC" />
    </svg>
  );
}
