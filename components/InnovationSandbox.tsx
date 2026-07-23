import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Cpu,
  Building2,
  GitBranch,
  Users,
  UsersRound,
  Stethoscope,
  Search,
  FlaskConical,
  Gauge,
  Rocket,
  Landmark,
  SlidersHorizontal,
  Flag,
  Map,
  Shield,
  ScrollText,
  FileText,
  Hammer,
  ClipboardCheck,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { HeroFunnel } from './sandbox/HeroFunnel';
import { UseCasePrioritiser } from './sandbox/UseCasePrioritiser';
import {
  SBX_ACCENT,
  SBX_DARK,
  SBX_TEAL,
  SBX_PALE_BORDER,
  hexA,
  REDUCED_MOTION,
  FUNNEL_STATS,
  LAYER_CARDS,
  FORMULA_TILES,
  METHOD_STAGES,
  GOVERNANCE_TIERS,
  SANDBOX_PARTNERS,
  GOVERNANCE_OUTCOME,
  COMPLIANCE_CHIPS,
  PROOF_STATS,
  PROOF_FOOTNOTE,
  type LayerIconName,
  type StageIconName,
  type TierIconName,
  type MethodStage,
} from './sandboxData';

/* ---------------------------------------------------------------------------
   Icon maps (string names in data -> Lucide components)
   --------------------------------------------------------------------------- */
const LAYER_ICON: Record<LayerIconName, LucideIcon> = {
  cpu: Cpu,
  building: Building2,
  gitBranch: GitBranch,
  users: Users,
};

const STAGE_ICON: Record<StageIconName, LucideIcon> = {
  stethoscope: Stethoscope,
  search: Search,
  flask: FlaskConical,
  gauge: Gauge,
  rocket: Rocket,
};

const TIER_ICON: Record<TierIconName, LucideIcon> = {
  landmark: Landmark,
  sliders: SlidersHorizontal,
  flag: Flag,
};

/* ---------------------------------------------------------------------------
   Shared building blocks
   --------------------------------------------------------------------------- */

/* Scroll-reveal wrapper: fade + 24px rise, staggered via delay. Reduced motion
   renders content visible immediately. */
const Reveal: React.FC<{ delay?: number; className?: string; children: React.ReactNode }> = ({
  delay = 0,
  className = '',
  children,
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, triggerOnce: true });
  const shown = REDUCED_MOTION || isIntersecting;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(24px)',
        transition: REDUCED_MOTION
          ? 'none'
          : `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* Numbered section eyebrow + heading — the visible spine of the narrative */
const SectionHeading: React.FC<{ n: string; eyebrow: string; title: React.ReactNode; lede?: string }> = ({
  n,
  eyebrow,
  title,
  lede,
}) => (
  <Reveal className="text-center mb-8">
    <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: SBX_ACCENT }}>
      {n} — {eyebrow}
    </p>
    <h2 className="text-[26px] md:text-[34px] font-bold text-[#1A202C] leading-[1.2]">{title}</h2>
    {lede && <p className="text-[15px] md:text-[16px] text-[#4A5568] leading-[1.65] max-w-[680px] mx-auto mt-4">{lede}</p>}
  </Reveal>
);

/* The recurring use-case pill motif: hero funnel -> method stage 3 -> prioritiser -> phase strip */
export const UseCaseChip: React.FC<{ label: string; status: 'idea' | 'scored' | 'live' }> = ({ label, status }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap"
    style={
      status === 'live'
        ? { backgroundColor: SBX_TEAL, border: `1.5px solid ${SBX_TEAL}`, color: '#FFFFFF' }
        : status === 'scored'
          ? { backgroundColor: hexA(SBX_ACCENT, 0.06), border: `1.5px solid ${SBX_ACCENT}`, color: SBX_DARK }
          : { backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E0', color: '#4A5568' }
    }
  >
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: status === 'live' ? '#FFFFFF' : status === 'scored' ? SBX_ACCENT : '#A0AEC0' }}
    />
    {label}
  </span>
);

/* Count-up number driven by requestAnimationFrame; snaps to target under reduced motion */
function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(REDUCED_MOTION ? target : 0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || REDUCED_MOTION) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

/* ---------------------------------------------------------------------------
   Section 01 — the problem
   --------------------------------------------------------------------------- */

const FunnelBarRow: React.FC<{ label: string; sublabel: string; pct: number; active: boolean; index: number }> = ({
  label,
  sublabel,
  pct,
  active,
  index,
}) => {
  const shown = useCountUp(pct, active);
  const opacity = [0.85, 0.55, 0.3][index] ?? 0.3;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
      <div className="sm:w-[210px] shrink-0">
        <p className="text-[14px] font-bold text-[#1A202C] leading-tight">{label}</p>
        <p className="text-[11.5px] text-[#A0AEC0] leading-[1.4]">{sublabel}</p>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-9 rounded-full relative overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(REDUCED_MOTION || active ? pct : 0)}%`,
              backgroundColor: hexA(SBX_ACCENT, opacity),
              transition: REDUCED_MOTION ? 'none' : `width 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${index * 150}ms`,
            }}
          />
        </div>
        <span className="w-[52px] text-right text-[17px] font-bold tabular-nums" style={{ color: index === 2 ? SBX_TEAL : SBX_DARK }}>
          {shown}%
        </span>
      </div>
    </div>
  );
};

const LayerFlipCard: React.FC<{ icon: LayerIconName; title: string; hook: string; trap: string }> = ({
  icon,
  title,
  hook,
  trap,
}) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = LAYER_ICON[icon];
  const faceBase: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };
  return (
    <button
      type="button"
      className="relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E] focus-visible:ring-offset-2 rounded-xl"
      style={{ perspective: '900px', height: 168 }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      aria-label={`${title} — see the trap`}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: REDUCED_MOTION ? 'none' : flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: REDUCED_MOTION ? 'none' : 'transform 0.5s ease',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl p-4 flex flex-col"
          style={{
            ...faceBase,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            opacity: REDUCED_MOTION ? (flipped ? 0 : 1) : undefined,
            transition: REDUCED_MOTION ? 'opacity 0.2s ease' : undefined,
          }}
        >
          <span className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: hexA(SBX_ACCENT, 0.1) }}>
            <Icon size={19} style={{ color: SBX_ACCENT }} />
          </span>
          <p className="text-[15px] font-bold text-[#1A202C] leading-tight">{title}</p>
          <p className="text-[12.5px] text-[#718096] mt-1 leading-[1.45]">{hook}</p>
          <span className="mt-auto text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#A0AEC0]">The trap →</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl p-4 flex flex-col"
          style={{
            ...faceBase,
            transform: REDUCED_MOTION ? 'none' : 'rotateY(180deg)',
            backgroundColor: hexA(SBX_ACCENT, 0.06),
            border: `1.5px solid ${SBX_ACCENT}`,
            opacity: REDUCED_MOTION ? (flipped ? 1 : 0) : undefined,
            transition: REDUCED_MOTION ? 'opacity 0.2s ease' : undefined,
            pointerEvents: 'none',
          }}
        >
          <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: SBX_ACCENT }}>
            {title} — the trap
          </p>
          <p className="text-[12.5px] text-[#2D3748] leading-[1.55]">{trap}</p>
        </div>
      </div>
    </button>
  );
};

const ProblemSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.4, triggerOnce: true });
  return (
    <section className="mb-20">
      <SectionHeading
        n="01"
        eyebrow="The problem"
        title={
          <>
            Most AI use cases die between
            <br className="hidden md:block" /> pilot and production
          </>
        }
        lede="Organisations are not short of AI ideas. They are short of a system that turns ideas into deployed, adopted, value-producing tools. We call the gap the status quo trap."
      />

      <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
        {/* Funnel bars */}
        <div ref={ref} className="space-y-4 mb-10">
          {FUNNEL_STATS.map((stat, i) => (
            <FunnelBarRow key={stat.label} label={stat.label} sublabel={stat.sublabel} pct={stat.pct} active={isIntersecting} index={i} />
          ))}
          <p className="text-[11.5px] text-[#A0AEC0] pt-1">Illustrative pattern seen across enterprise AI portfolios.</p>
        </div>

        {/* Four layers */}
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">
          It's rarely the technology — it's the system around it
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {LAYER_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <LayerFlipCard icon={card.icon} title={card.title} hook={card.hook} trap={card.trap} />
            </Reveal>
          ))}
        </div>

        {/* Formula */}
        <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-3">
          {FORMULA_TILES.map((tile, i) => (
            <React.Fragment key={tile.symbol}>
              {i > 0 && (
                <Reveal delay={i * 130} className="flex items-center">
                  <span className="text-[26px] font-bold text-[#A0AEC0] px-0.5">{i === 1 ? '+' : i === 2 ? '×' : '='}</span>
                </Reveal>
              )}
              <Reveal delay={i * 130 + (tile.isResult ? 120 : 0)}>
                <div
                  className="rounded-xl px-4 py-3 text-center h-full flex flex-col justify-center min-w-[120px]"
                  style={
                    tile.isResult
                      ? { backgroundColor: hexA(SBX_TEAL, 0.1), border: `1.5px solid ${SBX_TEAL}` }
                      : { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }
                  }
                >
                  <p className="text-[24px] font-bold leading-none mb-1" style={{ color: tile.isResult ? SBX_TEAL : SBX_DARK }}>
                    {tile.symbol}
                  </p>
                  <p className="text-[11px] text-[#718096] leading-[1.35] max-w-[130px] mx-auto">{tile.label}</p>
                </div>
              </Reveal>
            </React.Fragment>
          ))}
        </div>
        <p className="text-[12.5px] text-[#718096] text-center mt-4 leading-[1.6] max-w-[560px] mx-auto">
          Good systems and a fit-for-purpose organisation only compound when people are engaged.{' '}
          <span className="font-semibold text-[#2D3748]">Engagement is the multiplier</span> — and it is exactly what a sandbox is built to create.
        </p>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
   Section 02 — the method (5-stage stepper)
   --------------------------------------------------------------------------- */

/* Static mini 2x2 shown in stage 4, teasing the prioritiser below */
const MiniMatrix: React.FC = () => {
  const dots = [
    { left: '72%', top: '22%', color: SBX_TEAL },
    { left: '30%', top: '34%', color: SBX_ACCENT },
    { left: '64%', top: '70%', color: '#C4A934' },
    { left: '24%', top: '78%', color: '#A0AEC0' },
  ];
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', aspectRatio: '4 / 3', backgroundColor: '#FFFFFF' }}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div style={{ borderRight: '1px dashed #E2E8F0', borderBottom: '1px dashed #E2E8F0' }} />
        <div style={{ borderBottom: '1px dashed #E2E8F0', backgroundColor: hexA(SBX_TEAL, 0.05) }} />
        <div style={{ borderRight: '1px dashed #E2E8F0' }} />
        <div />
      </div>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{ left: d.left, top: d.top, transform: 'translate(-50%,-50%)', backgroundColor: d.color, border: '2px solid #FFFFFF', boxShadow: `0 0 0 3px ${hexA(d.color, 0.2)}` }}
        />
      ))}
      <span className="absolute top-1.5 right-2 text-[9px] font-bold uppercase tracking-[0.05em]" style={{ color: SBX_TEAL }}>
        Quick wins
      </span>
    </div>
  );
};

/* Stage 2 visual: bottom-up + top-down streams converging into a chartered list */
const DefineVisual: React.FC = () => (
  <div className="rounded-xl p-4" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
    <div className="grid grid-cols-2 gap-2.5">
      <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <UsersRound size={16} className="mx-auto mb-1.5" style={{ color: SBX_ACCENT }} />
        <p className="text-[11.5px] font-bold text-[#1A202C] leading-tight">Bottom-up</p>
        <p className="text-[10.5px] text-[#718096] leading-[1.4] mt-0.5">Ideas from the people doing the work</p>
      </div>
      <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <GitBranch size={16} className="mx-auto mb-1.5" style={{ color: SBX_ACCENT }} />
        <p className="text-[11.5px] font-bold text-[#1A202C] leading-tight">Top-down</p>
        <p className="text-[10.5px] text-[#718096] leading-[1.4] mt-0.5">Opportunities from process mapping</p>
      </div>
    </div>
    <div className="flex justify-center py-1.5">
      <ArrowDown size={16} className="text-[#A0AEC0]" />
    </div>
    <div className="rounded-lg p-3" style={{ backgroundColor: hexA(SBX_ACCENT, 0.05), border: `1.5px solid ${SBX_ACCENT}` }}>
      <div className="flex items-center gap-1.5 mb-2">
        <FileText size={13} style={{ color: SBX_ACCENT }} />
        <p className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: SBX_ACCENT }}>
          One charter per use case
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <UseCaseChip label="Contract review" status="idea" />
        <UseCaseChip label="Invoice triage" status="idea" />
        <UseCaseChip label="Lead scoring" status="idea" />
      </div>
      <p className="text-[10.5px] text-[#718096] mt-2 leading-[1.4]">The problem, the user, the data it needs.</p>
    </div>
  </div>
);

/* Stage 3 visual: the build → test → refine clinic loop, with survivors and a park-out */
const PrototypeVisual: React.FC = () => {
  const steps = [
    { icon: Hammer, label: 'Build' },
    { icon: ClipboardCheck, label: 'Test' },
    { icon: RefreshCw, label: 'Refine' },
  ];
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <ArrowRight size={13} className="text-[#A0AEC0] shrink-0" />}
            <div className="rounded-lg px-3 py-2 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <s.icon size={15} className="mx-auto mb-1" style={{ color: SBX_ACCENT }} />
              <p className="text-[11px] font-bold text-[#1A202C] leading-none">{s.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="text-[10px] text-center font-semibold uppercase tracking-[0.08em] text-[#A0AEC0] mb-3">
        &#8635; every week, in the clinic
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2">After three rounds</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <UseCaseChip label="Contract review" status="scored" />
        <UseCaseChip label="Invoice triage" status="scored" />
        <UseCaseChip label="SOP assistant" status="scored" />
      </div>
      <p className="text-[10.5px] text-[#A0AEC0] leading-[1.4]">
        <span className="line-through">Lead scoring</span> — parked after testing. Failing fast here is cheap; failing in production isn't.
      </p>
    </div>
  );
};

/* Stage 5 visual: sequenced lanes feeding the production pipeline */
const ScaleVisual: React.FC = () => {
  const lanes = [
    { label: 'Now', chip: 'Contract review', color: SBX_TEAL },
    { label: 'Next', chip: 'Invoice triage', color: '#C4A934' },
    { label: 'Later', chip: 'SOP assistant', color: SBX_ACCENT },
  ];
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <div className="flex items-stretch gap-2.5">
        <div className="flex-1 space-y-2">
          {lanes.map((lane) => (
            <div key={lane.label} className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.06em] w-9 shrink-0" style={{ color: lane.color }}>
                {lane.label}
              </span>
              <span className="text-[11.5px] font-semibold text-[#2D3748] truncate">{lane.chip}</span>
              <ArrowRight size={12} className="ml-auto shrink-0 text-[#A0AEC0]" />
            </div>
          ))}
        </div>
        <div className="w-[92px] shrink-0 rounded-lg flex flex-col items-center justify-center gap-1.5 relative" style={{ backgroundColor: hexA(SBX_TEAL, 0.08), border: `1.5px solid ${SBX_TEAL}` }}>
          <span className="sbx-live-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: SBX_TEAL }}>
            <span className="w-1 h-1 rounded-full bg-white" /> LIVE
          </span>
          <Rocket size={16} style={{ color: SBX_TEAL }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-center" style={{ color: SBX_TEAL }}>
            Production
          </p>
        </div>
      </div>
      <p className="text-[10.5px] text-[#718096] mt-2.5 leading-[1.45]">
        Each release passes a governance gate before it ships — then the next lane moves up.
      </p>
    </div>
  );
};

const StageVisualPanel: React.FC<{ stage: MethodStage }> = ({ stage }) => {
  switch (stage.visual) {
    case 'agenda':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(stage.agenda ?? []).map((q) => (
            <div key={q.letter} className="rounded-xl p-3.5" style={{ backgroundColor: hexA(SBX_ACCENT, 0.05), border: `1px solid ${hexA(SBX_ACCENT, 0.2)}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ backgroundColor: SBX_ACCENT }}>
                  {q.letter}
                </span>
                <p className="text-[12.5px] font-bold text-[#1A202C]">{q.label}</p>
              </div>
              <p className="text-[12px] text-[#4A5568] leading-[1.5]">{q.question}</p>
            </div>
          ))}
        </div>
      );
    case 'converge':
      return <DefineVisual />;
    case 'loop':
      return <PrototypeVisual />;
    case 'matrix':
      return (
        <div>
          <MiniMatrix />
          <button
            type="button"
            onClick={() => document.getElementById('prioritiser')?.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' })}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-bold text-white transition-all duration-150 hover:-translate-y-0.5"
            style={{ backgroundColor: SBX_DARK }}
          >
            Try it yourself below <ArrowDown size={14} />
          </button>
        </div>
      );
    case 'roadmap':
      return <ScaleVisual />;
  }
};

const StagePanel: React.FC<{ stage: MethodStage }> = ({ stage }) => (
  <div key={stage.id} className={REDUCED_MOTION ? '' : 'animate-section-reveal'}>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      <div className="lg:col-span-3">
        <p className="text-[15px] text-[#2D3748] leading-[1.65] mb-4">{stage.summary}</p>
        <ul className="space-y-2 mb-5">
          {stage.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[13.5px] text-[#4A5568] leading-[1.55]">
              <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SBX_ACCENT }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#A0AEC0]">Who's in the room</p>
            <p className="text-[13px] font-semibold text-[#2D3748] mt-0.5">{stage.participants}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#A0AEC0]">Output</p>
            <p className="text-[13px] font-semibold text-[#2D3748] mt-0.5">{stage.output}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <StageVisualPanel stage={stage} />
      </div>
    </div>
  </div>
);

const MethodSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const stage = METHOD_STAGES[activeIdx];

  return (
    <section className="mb-20">
      <SectionHeading
        n="02"
        eyebrow="The method"
        title="Five stages, eight to twelve weeks"
        lede="One governed path from open questions to a production roadmap — this is where readiness, leadership alignment and upskilling pay off. Click through the stages: each produces something concrete before the next begins."
      />

      {/* Stepper rail */}
      <div className="overflow-x-auto no-scrollbar mb-6">
        <div className="relative min-w-[560px] px-2">
          {/* Track */}
          <div className="absolute left-8 right-8 h-[3px] rounded-full" style={{ top: 21, backgroundColor: '#E2E8F0' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(activeIdx / (METHOD_STAGES.length - 1)) * 100}%`,
                backgroundColor: SBX_ACCENT,
                transition: REDUCED_MOTION ? 'none' : 'width 0.4s ease',
              }}
            />
          </div>
          <div className="relative flex justify-between">
            {METHOD_STAGES.map((s, i) => {
              const Icon = STAGE_ICON[s.icon];
              const active = i === activeIdx;
              const passed = i < activeIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className="flex flex-col items-center gap-2 group focus:outline-none"
                  aria-label={`Stage ${s.n}: ${s.title}`}
                  aria-current={active ? 'step' : undefined}
                >
                  <span
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-[1.08] group-focus-visible:ring-2 group-focus-visible:ring-[#2B4C7E] group-focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: active ? SBX_ACCENT : '#FFFFFF',
                      border: `2px solid ${active || passed ? SBX_ACCENT : '#E2E8F0'}`,
                    }}
                  >
                    <Icon size={18} style={{ color: active ? '#FFFFFF' : passed ? SBX_ACCENT : '#A0AEC0' }} />
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: active ? SBX_DARK : '#718096' }}>
                    {s.n}. {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel — key remount per stage for the reveal animation */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <StagePanel stage={stage} />
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
   Section 04 — governance chart: client tiers on one side, delivery partners
   on the other, everything converging on the Blueprint
   --------------------------------------------------------------------------- */
const GovernanceChartSection: React.FC = () => (
  <section className="mb-20">
    <SectionHeading
      n="04"
      eyebrow="Who makes it work"
      title="A sandbox, not a free-for-all"
      lede="Experimentation without governance produces demos. This is the team that turns it into production value: three tiers inside your organisation, two partners at your side."
    />

    <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Client side */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Inside your organisation</p>
          <div className="flex flex-col items-center gap-0">
            {GOVERNANCE_TIERS.map((tier, i) => {
              const Icon = TIER_ICON[tier.icon];
              return (
                <React.Fragment key={tier.title}>
                  {i > 0 && <div className="w-px h-4" style={{ backgroundColor: hexA(SBX_ACCENT, 0.35) }} />}
                  <Reveal delay={i * 130} className="w-full">
                    <div className="rounded-xl p-4 flex items-start gap-3.5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(SBX_ACCENT, 0.1) }}>
                        <Icon size={18} style={{ color: SBX_ACCENT }} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-bold text-[#1A202C]">{tier.title}</p>
                        <p className="text-[12.5px] text-[#4A5568] leading-[1.55] mt-0.5">{tier.mandate}</p>
                      </div>
                    </div>
                  </Reveal>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Partner side */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">At your side</p>
          <div className="flex flex-col gap-3">
            {SANDBOX_PARTNERS.map((partner, i) => (
              <Reveal key={partner.name} delay={i * 130}>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hexA(SBX_ACCENT, 0.25)}` }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <img src={partner.logo} alt={partner.name} style={{ height: partner.logoHeight }} className="w-auto" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: hexA(SBX_ACCENT, 0.08), color: SBX_DARK }}>
                      {partner.role}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#4A5568] leading-[1.6]">{partner.blurb}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <div className="flex flex-wrap gap-2">
                {COMPLIANCE_CHIPS.map((chip, i) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold"
                    style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hexA(SBX_ACCENT, 0.3)}`, color: SBX_DARK }}
                  >
                    {i % 2 === 0 ? <Shield size={12} style={{ color: SBX_ACCENT }} /> : <ScrollText size={12} style={{ color: SBX_ACCENT }} />}
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Shared outcome */}
      <Reveal delay={350}>
        <div className="flex justify-center my-4">
          <ArrowDown size={18} className="text-[#A0AEC0]" />
        </div>
        <div className="rounded-xl px-5 py-4 flex items-start gap-3" style={{ backgroundColor: hexA(SBX_TEAL, 0.07), border: `1.5px solid ${SBX_TEAL}` }}>
          <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(SBX_TEAL, 0.15) }}>
            <Map size={17} style={{ color: SBX_TEAL }} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: SBX_TEAL }}>The shared outcome</p>
            <p className="text-[13.5px] text-[#2D3748] leading-[1.6]">{GOVERNANCE_OUTCOME}</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ---------------------------------------------------------------------------
   Section 08 — proof band
   --------------------------------------------------------------------------- */
const ProofTile: React.FC<{ countTo: number; prefix?: string; suffix?: string; caption: string; active: boolean }> = ({
  countTo,
  prefix,
  suffix,
  caption,
  active,
}) => {
  const n = useCountUp(countTo, active);
  return (
    <div className="text-center">
      <p className="text-[36px] md:text-[42px] font-bold leading-none tabular-nums" style={{ color: '#7EDCD6' }}>
        {prefix ?? ''}
        {n}
        {suffix ?? ''}
      </p>
      <p className="text-[13px] leading-[1.5] mt-2 max-w-[220px] mx-auto" style={{ color: '#B8C9E8' }}>
        {caption}
      </p>
    </div>
  );
};

const ProofSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.4, triggerOnce: true });
  return (
    <section className="mb-16">
      <div ref={ref} className="rounded-2xl px-6 py-8 sm:px-10" style={{ backgroundColor: SBX_DARK }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
          {PROOF_STATS.map((stat) => (
            <ProofTile key={stat.caption} countTo={stat.countTo} prefix={stat.prefix} suffix={stat.suffix} caption={stat.caption} active={isIntersecting} />
          ))}
        </div>
        <p className="text-[10.5px] text-center mt-6" style={{ color: hexA('#B8C9E8', 0.55) }}>
          {PROOF_FOOTNOTE}
        </p>
      </div>
    </section>
  );
};

/* ===========================================================================
   Page
   =========================================================================== */
export const InnovationSandbox: React.FC = () => {
  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <a href="#" onClick={goHome} className="inline-flex items-center gap-1.5 text-[14px] mb-8 transition-colors hover:text-[#1E3A5F]" style={{ color: '#718096' }}>
          <ArrowLeft size={16} /> Home
        </a>

        {/* ============ HERO ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-10">
          <div>
            <Reveal>
              <div className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#EAF0F8', color: SBX_DARK, border: `1px solid ${SBX_PALE_BORDER}` }}>
                AI Innovation Sandbox &mdash; 8&ndash;12 weeks
              </div>
              <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15] mb-5">
                From AI experiments
                <br />
                to{' '}
                <span className="relative inline-block">
                  production value
                  <span className="absolute left-0 -bottom-1 w-full h-[4px] rounded-full opacity-80" style={{ backgroundColor: SBX_TEAL }} />
                </span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-[16px] md:text-[17px] text-[#4A5568] leading-[1.65] mb-7 max-w-[520px]">
                A safe, governed space where your teams define, prototype, score and scale AI use cases — with a clear route from pilot to production, and the support to get there.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#ai-readiness"
                  className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-7 py-3.5 text-[15px] transition-all duration-150 hover:-translate-y-0.5"
                  style={{ backgroundColor: SBX_DARK }}
                >
                  Take the readiness assessment <ArrowRight size={16} />
                </a>
                <a
                  href="mailto:uk@oxygyconsulting.com"
                  className="inline-flex items-center gap-2 font-semibold rounded-full px-7 py-3.5 text-[15px] transition-all duration-150 hover:-translate-y-0.5"
                  style={{ backgroundColor: 'transparent', color: '#1A202C', border: '1px solid #1A202C' }}
                >
                  Book a discovery workshop
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <HeroFunnel />
          </Reveal>
        </div>

        <ProblemSection />
        <MethodSection />

        {/* ============ 03 — THE PRIORITISER ============ */}
        <section className="mb-20" id="prioritiser">
          <SectionHeading
            n="03"
            eyebrow="Try it yourself"
            title="Prioritise your own use cases"
            lede="This is the scoring mechanic from stage 4, in miniature. Pick your function and priorities, choose the use cases that sound familiar, and watch them land on the matrix."
          />
          <UseCasePrioritiser />
        </section>

        <GovernanceChartSection />
        <ProofSection />

        <ArtifactClosing
          summaryText="The Sandbox turns scattered AI experiments into a governed portfolio with a route to production. It starts with knowing where you stand."
          ctaLabel="Start with the AI Readiness Assessment"
          ctaHref="#ai-readiness"
          secondaryCtaLabel="Talk to us about an Innovation Sandbox"
          secondaryCtaHref="mailto:uk@oxygyconsulting.com"
          accentColor={SBX_DARK}
        />
      </div>
    </div>
  );
};
