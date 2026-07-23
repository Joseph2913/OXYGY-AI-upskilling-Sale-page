import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ChevronRight,
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
  Layers,
  Shield,
  ScrollText,
  Clock,
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
  JOURNEY_STEPS,
  METHOD_STAGES,
  GOVERNANCE_TIERS,
  LEGACY_CARDS,
  LEGAL_PARTNER,
  COMPLIANCE_CHIPS,
  PROOF_STATS,
  PROOF_FOOTNOTE,
  type LayerIconName,
  type StageIconName,
  type TierIconName,
  type LegacyIconName,
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

const LEGACY_ICON: Record<LegacyIconName, LucideIcon> = {
  map: Map,
  usersRound: UsersRound,
  layers: Layers,
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
   Section 02 — where the Sandbox fits
   --------------------------------------------------------------------------- */
const JourneySection: React.FC = () => (
  <section className="mb-20">
    <SectionHeading
      n="02"
      eyebrow="Where it fits"
      title="One journey, four connected offerings"
      lede="The Sandbox is where the journey pays off: readiness tells you where you stand, leadership sets the ambition, upskilling builds the muscle — and the Sandbox turns it all into production value."
    />
    <div className="flex flex-col lg:flex-row items-stretch gap-3">
      {JOURNEY_STEPS.map((step, i) => (
        <React.Fragment key={step.title}>
          {i > 0 && (
            <div className="hidden lg:flex items-center shrink-0">
              <ChevronRight size={20} className="text-[#CBD5E0]" />
            </div>
          )}
          <Reveal delay={i * 120} className="flex-1">
            {step.isCurrent ? (
              <div className="rounded-xl p-4 h-full relative" style={{ backgroundColor: hexA(SBX_ACCENT, 0.05), border: `2px solid ${SBX_DARK}` }}>
                <span
                  className="absolute -top-2.5 left-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-white"
                  style={{ backgroundColor: SBX_TEAL }}
                >
                  You are here
                </span>
                <p className="text-[14.5px] font-bold text-[#1A202C] leading-tight mt-1.5">{step.title}</p>
                <p className="text-[12.5px] text-[#4A5568] mt-1">{step.tagline}</p>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.05em] mt-2.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: hexA(SBX_TEAL, 0.12), color: SBX_TEAL }}>
                  <Clock size={10} /> {step.duration}
                </span>
              </div>
            ) : (
              <a
                href={step.href}
                className="block rounded-xl p-4 h-full transition-all duration-150 hover:-translate-y-0.5"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-1.5">Step {i + 1}</p>
                <p className="text-[14.5px] font-bold text-[#2D3748] leading-tight">{step.title}</p>
                <p className="text-[12.5px] text-[#718096] mt-1">{step.tagline}</p>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] mt-2.5 text-[#A0AEC0]">
                  <Clock size={10} /> {step.duration}
                </span>
              </a>
            )}
          </Reveal>
        </React.Fragment>
      ))}
    </div>
  </section>
);

/* ---------------------------------------------------------------------------
   Section 03 — the method (5-stage stepper)
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

const StagePanel: React.FC<{ stage: MethodStage }> = ({ stage }) => (
  <div key={stage.id} className={REDUCED_MOTION ? '' : 'animate-section-reveal'}>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      <div className={stage.agenda || stage.showsMiniMatrix ? 'lg:col-span-3' : 'lg:col-span-5'}>
        <p className="text-[15px] text-[#2D3748] leading-[1.65] mb-4">{stage.summary}</p>
        <ul className="space-y-2 mb-5">
          {stage.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[13.5px] text-[#4A5568] leading-[1.55]">
              <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SBX_ACCENT }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {stage.showsChips && (
          <div className="mb-5">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2">Prototypes in the sandbox</p>
            <div className="flex flex-wrap gap-2">
              <UseCaseChip label="Contract review" status="scored" />
              <UseCaseChip label="Invoice triage" status="scored" />
              <UseCaseChip label="SOP assistant" status="scored" />
              <UseCaseChip label="Lead scoring" status="idea" />
            </div>
          </div>
        )}

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

      {stage.agenda && (
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {stage.agenda.map((q) => (
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
      )}

      {stage.showsMiniMatrix && (
        <div className="lg:col-span-2">
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
      )}
    </div>
  </div>
);

const MethodSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const stage = METHOD_STAGES[activeIdx];

  return (
    <section className="mb-20">
      <SectionHeading
        n="03"
        eyebrow="The method"
        title="Five stages, eight to twelve weeks"
        lede="A governed path from open questions to a production roadmap. Click through the stages — each one produces something concrete before the next begins."
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
   Section 05 — governance
   --------------------------------------------------------------------------- */
const GovernanceSection: React.FC = () => (
  <section className="mb-20">
    <SectionHeading
      n="05"
      eyebrow="Who governs it"
      title="A sandbox, not a free-for-all"
      lede="Experimentation without governance produces demos. Three tiers keep the freedom to build and the discipline to scale in the same room."
    />
    <div className="flex flex-col items-center gap-0">
      {GOVERNANCE_TIERS.map((tier, i) => {
        const Icon = TIER_ICON[tier.icon];
        return (
          <React.Fragment key={tier.title}>
            {i > 0 && <div className="w-px h-5" style={{ backgroundColor: hexA(SBX_ACCENT, 0.3) }} />}
            <Reveal delay={i * 150} className={`w-full ${tier.widthClass}`}>
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
  </section>
);

/* ---------------------------------------------------------------------------
   Section 06 — beyond the pilot
   --------------------------------------------------------------------------- */
const LegacySection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.4, triggerOnce: true });
  const effortPct = useCountUp(40, isIntersecting);
  return (
    <section className="mb-20">
      <SectionHeading
        n="06"
        eyebrow="Beyond the pilot"
        title="What you're left with when we leave"
        lede="An engagement that ends with a slide deck has failed. The Sandbox ends with assets your organisation owns and keeps compounding."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {LEGACY_CARDS.map((card, i) => {
          const Icon = LEGACY_ICON[card.icon];
          return (
            <Reveal key={card.title} delay={i * 120}>
              <div className="rounded-xl p-5 h-full" style={{ backgroundColor: hexA(SBX_ACCENT, 0.04), border: `1px solid ${hexA(SBX_ACCENT, 0.2)}` }}>
                <span className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: hexA(SBX_ACCENT, 0.13) }}>
                  <Icon size={19} style={{ color: SBX_ACCENT }} />
                </span>
                <p className="text-[15px] font-bold text-[#1A202C] mb-2">{card.title}</p>
                <p className="text-[13px] text-[#4A5568] leading-[1.6]">{card.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Phase 1 -> Phase 2 strip */}
      <div ref={ref} className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <Reveal className="flex-1">
            <div className="rounded-xl p-4 h-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-1">Phase 1</p>
              <p className="text-[14px] font-bold text-[#1A202C]">Design deep on 2–3 functions</p>
              <p className="text-[12.5px] text-[#718096] leading-[1.55] mt-1">
                Build the templates, frameworks and scoring rubric on the functions that matter most.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150} className="flex items-center justify-center shrink-0">
            <ArrowRight size={20} className="text-[#A0AEC0] rotate-90 md:rotate-0" />
          </Reveal>
          <Reveal delay={250} className="flex-1">
            <div className="rounded-xl p-4 h-full relative" style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${SBX_TEAL}` }}>
              <span className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white tabular-nums" style={{ backgroundColor: SBX_TEAL }}>
                ~{effortPct}% less effort
              </span>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-1">Phase 2</p>
              <p className="text-[14px] font-bold text-[#1A202C]">Scale across the organisation</p>
              <p className="text-[12.5px] text-[#718096] leading-[1.55] mt-1">
                Reuse what Phase 1 proved. Every function after the first is faster — <UseCaseChip label="SOP assistant" status="live" /> stays live while the next one ships.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
   Section 07 — responsible scaling
   --------------------------------------------------------------------------- */
const PartnershipSection: React.FC = () => (
  <section className="mb-20">
    <SectionHeading
      n="07"
      eyebrow="Scaling responsibly"
      title={
        <>
          Scale fast.{' '}
          <span className="relative inline-block">
            Scale responsibly.
            <span className="absolute left-0 -bottom-1 w-full h-[4px] rounded-full opacity-80" style={{ backgroundColor: SBX_TEAL }} />
          </span>
        </>
      }
      lede="Every use case that scales passes a governance gate. Compliance, risk and ethical review are built into the blueprint — not bolted on after something breaks."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      <Reveal>
        <div className="rounded-xl p-5 h-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: SBX_ACCENT }}>
            OXYGY
          </p>
          <p className="text-[14.5px] font-bold text-[#1A202C] mb-1.5">People, process and adoption</p>
          <p className="text-[13px] text-[#4A5568] leading-[1.6]">
            Change management is our core craft. We design the sandbox, coach the champions, run the scoring and carry adoption — so the technology actually changes how work gets done.
          </p>
        </div>
      </Reveal>
      <Reveal delay={130}>
        <div className="rounded-xl p-5 h-full" style={{ backgroundColor: hexA(SBX_ACCENT, 0.04), border: `1px solid ${hexA(SBX_ACCENT, 0.25)}` }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: SBX_ACCENT }}>
            {LEGAL_PARTNER.name}
          </p>
          <p className="text-[14.5px] font-bold text-[#1A202C] mb-1.5">Legal-grade AI governance</p>
          <p className="text-[13px] text-[#4A5568] leading-[1.6]">{LEGAL_PARTNER.blurb}</p>
          {LEGAL_PARTNER.pendingApproval && (
            <p className="text-[10.5px] text-[#A0AEC0] mt-2.5">Partner name to be announced.</p>
          )}
        </div>
      </Reveal>
    </div>
    <Reveal delay={200}>
      <div className="flex flex-wrap justify-center gap-2">
        {COMPLIANCE_CHIPS.map((chip, i) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold"
            style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hexA(SBX_ACCENT, 0.3)}`, color: SBX_DARK }}
          >
            {i % 2 === 0 ? <Shield size={13} style={{ color: SBX_ACCENT }} /> : <ScrollText size={13} style={{ color: SBX_ACCENT }} />}
            {chip}
          </span>
        ))}
      </div>
    </Reveal>
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

        {/* Fun fact */}
        <div className="mb-16">
          <div className="relative rounded-2xl px-8 md:px-12 py-8 text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${hexA(SBX_DARK, 0.12)} 0%, ${hexA(SBX_ACCENT, 0.06)} 50%, ${hexA(SBX_DARK, 0.1)} 100%)`, border: `1.5px solid ${SBX_PALE_BORDER}` }}>
            <div className="absolute top-3 left-4 flex gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SBX_DARK, opacity: 0.4 }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SBX_ACCENT, opacity: 0.6 }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SBX_DARK, opacity: 0.3 }} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: SBX_DARK }}>Did you know?</p>
            <p className="text-[17px] md:text-[19px] text-[#2D3748] font-medium leading-[1.6]">
              <span className="font-bold" style={{ color: SBX_DARK }}>At least 30% of generative-AI projects are abandoned</span> after proof of concept.
            </p>
            <p className="text-[15px] text-[#718096] leading-[1.6] mt-2">
              Not because the technology fails — but because value is unclear, data isn't ready, and risk controls are missing.{' '}
              <span className="text-[13px] text-[#A0AEC0]">Source: Gartner, 2024.</span>
            </p>
          </div>
        </div>

        <ProblemSection />
        <JourneySection />
        <MethodSection />

        {/* ============ 04 — THE PRIORITISER ============ */}
        <section className="mb-20" id="prioritiser">
          <SectionHeading
            n="04"
            eyebrow="Try it yourself"
            title="Prioritise your own use cases"
            lede="This is the scoring mechanic from stage 4, in miniature. Pick your function, choose the use cases that sound familiar, and watch them land on the matrix."
          />
          <UseCasePrioritiser />
        </section>

        <GovernanceSection />
        <LegacySection />
        <PartnershipSection />
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
