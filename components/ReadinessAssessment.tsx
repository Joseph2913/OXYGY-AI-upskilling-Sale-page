import React, { useState } from 'react';
import { ArrowLeft, Clock, AlertTriangle, RadioTower, Lightbulb, Trophy, Compass, Users, ChevronDown, GraduationCap, RefreshCw, Share2, Shield, Target, TrendingUp, FlaskConical, Network } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';
import {
  PROFILES,
  PHASE1_WHY,
  strategicScore,
  workEnvScore,
  overallScore,
  type Profile,
  type ProfileId,
  type Evidence,
  type ProfileTraits,
  type Offering,
} from './readinessData';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

/* Icon per profile, reinforcing the cluster visually */
const PROFILE_ICON: Record<ProfileId, LucideIcon> = {
  'sitting-duck': AlertTriangle,
  'disconnected-antenna': RadioTower,
  'island-of-creativity': Lightbulb,
  'systematic-innovator': Trophy,
};

/* The five dimensions the real survey covers (source: PRD/AI Change Readiness Assessment-2.pdf).
   Deliberately qualitative, not the literal question bank — the questions themselves are part of
   what a client pays OXYGY to run; the page explains why each dimension matters for the transformation. */
interface InsightPoint { icon: LucideIcon; label: string }
interface SurveyCategory { id: string; title: string; icon: LucideIcon; description: string; why: string; insights: InsightPoint[] }

const SURVEY_CATEGORIES: SurveyCategory[] = [
  {
    id: 'demographics',
    title: 'Demographics',
    icon: Users,
    description: 'So every other score can be read in context, not as one flat number for the whole company.',
    why: "We tag every response by role, department, tenure and location — not to profile individuals, but to see whether readiness is a company-wide pattern or sits in specific pockets worth targeting first.",
    insights: [
      { icon: Users, label: 'Where confidence differs by level' },
      { icon: Network, label: 'Which functions are furthest ahead' },
      { icon: Compass, label: 'How tenure shapes trust in AI' },
    ],
  },
  {
    id: 'ai-literacy-perceptions',
    title: 'AI Literacy & Perceptions',
    icon: Lightbulb,
    description: "Adoption moves at the speed of people's skill and trust in AI, not the strategy on paper.",
    why: 'Skill and sentiment rarely move together — skill without trust stalls quietly, trust without skill creates risk. We look for which one is actually missing, because that changes what the first move in Phase 2 should be.',
    insights: [
      { icon: FlaskConical, label: 'Real skill level, not assumed' },
      { icon: AlertTriangle, label: 'Hidden resistance, before it surfaces' },
      { icon: TrendingUp, label: 'Existing confidence worth building on' },
    ],
  },
  {
    id: 'organisational-motivation',
    title: 'Organisational Motivation',
    icon: Compass,
    description: "A strategy nobody's heard of can't be acted on, however good it looks on paper.",
    why: 'A strategy only works once it has actually landed. We look for the gap between what leadership believes it has communicated and what the organisation has understood, because that gap is where transformations quietly stall.',
    insights: [
      { icon: Compass, label: 'Whether the vision has actually landed' },
      { icon: Users, label: 'Where the message breaks down' },
      { icon: Target, label: 'What people think AI is even for' },
    ],
  },
  {
    id: 'management-practices',
    title: 'Management Practices',
    icon: Shield,
    description: 'Good ideas still die in bureaucracy, even inside organisations with a clear strategy.',
    why: 'Strategy sets the direction; management practice decides whether anything survives contact with daily work. We look for whether ideas can actually move, because that capacity for execution is what a transformation runs on.',
    insights: [
      { icon: Shield, label: 'Ideas killed by bureaucracy, or not' },
      { icon: Network, label: 'How openly information already flows' },
      { icon: Compass, label: 'The balance of risk and experimentation' },
    ],
  },
  {
    id: 'resources-teamwork',
    title: 'Resources & Teamwork',
    icon: Network,
    description: 'Even the best strategy fails without the time, budget, skills and team needed to deliver it.',
    why: "Even the right strategy fails without the people, time and budget behind it. We look for whether teams can actually build with AI, not just have permission to try, because that's what sets the pace for Phase 2.",
    insights: [
      { icon: Network, label: 'Time, budget and skills, not just intent' },
      { icon: Users, label: 'Team trust and diversity of thinking' },
      { icon: TrendingUp, label: 'Readiness to execute, not just plan' },
    ],
  },
];

/* hex -> rgba with alpha */
const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* ---------- 2x2 AI Innovator matrix, used as the interactive profile selector ---------- */
function MatrixSelector({ selectedId, onSelect }: { selectedId: ProfileId | null; onSelect: (id: ProfileId) => void }) {
  const selected = selectedId ? PROFILES.find((p) => p.id === selectedId) ?? null : null;
  const sc = selected ? strategicScore(selected) : 0; // vertical
  const we = selected ? workEnvScore(selected) : 0; // horizontal
  const left = ((we - 1) / 4) * 100;
  const rawTop = (1 - (sc - 1) / 4) * 100;
  // Keep the dot clear of whichever cell's own header it lands in — clamp its position
  // within its half of the grid so it never sits flush against a row boundary.
  const rowStart = rawTop < 50 ? 0 : 50;
  const top = rowStart + Math.min(42, Math.max(18, rawTop - rowStart));

  const cells: ProfileId[] = ['disconnected-antenna', 'systematic-innovator', 'sitting-duck', 'island-of-creativity'];

  return (
    <div className="w-full select-none">
      <div className="flex gap-2">
        {/* Y axis */}
        <div className="flex flex-col items-center justify-between py-1">
          <span className="text-[10px] font-semibold text-[#A0AEC0]">Defined</span>
          <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>STRATEGIC CONTEXT</span>
          <span className="text-[10px] font-semibold text-[#A0AEC0]">Unclear</span>
        </div>

        {/* Plot — each quadrant is a clickable profile */}
        <div className="relative flex-1">
          <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1 / 1' }}>
            {cells.map((id) => {
              const p = PROFILES.find((x) => x.id === id)!;
              const Icon = PROFILE_ICON[id];
              const active = id === selectedId;
              const dimmed = !selectedId; // nothing picked yet — dim each cell individually so hover can clear just that one
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`relative rounded-xl p-3 sm:p-4 flex flex-col items-start text-left transition-all duration-150 hover:-translate-y-0.5 ${dimmed ? 'opacity-70 blur-[1px] hover:opacity-100 hover:blur-none' : ''}`}
                  style={{ backgroundColor: hexA(p.color, active ? 0.22 : 0.07), border: active ? `2px solid ${p.color}` : '1px solid #E2E8F0', boxShadow: active ? `0 0 0 3px ${hexA(p.color, 0.18)}` : 'none' }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon size={16} style={{ color: p.color }} className="shrink-0" />
                    <span className="text-[12.5px] font-bold leading-tight" style={{ color: active ? DARK : '#2D3748' }}>{p.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.04em] leading-[1.35]" style={{ color: '#A0AEC0' }}>{p.quadrantTag}</span>
                </button>
              );
            })}
          </div>

          {/* Plotted dot for the selected profile */}
          {selected && (
            <div className="absolute pointer-events-none z-20" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)', transition: 'all 0.6s ease' }}>
              <span className="block w-4 h-4 rounded-full" style={{ backgroundColor: selected.color, border: '2.5px solid #FFFFFF', boxShadow: `0 0 0 4px ${hexA(selected.color, 0.25)}` }} />
            </div>
          )}

          {/* Overlay inviting a click, sat over the blurred quadrants — the buttons underneath stay clickable */}
          {!selectedId && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
              <div className="rounded-xl px-4 py-3.5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: `1.5px solid ${PALE_BORDER}`, boxShadow: '0 4px 16px rgba(30,58,95,0.12)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#EAF0F8' }}>
                  <Compass size={17} style={{ color: ACCENT }} />
                </div>
                <p className="text-[13.5px] font-bold text-[#1A202C] leading-tight">Pick a quadrant to begin</p>
                <p className="text-[11.5px] text-[#718096] mt-1 leading-[1.4] max-w-[190px]">See the persona and readiness picture for each one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* X axis */}
      <div className="flex justify-between items-center mt-2 pl-8">
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Conventional</span>
        <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568]">WORK ENVIRONMENT</span>
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Innovative</span>
      </div>
    </div>
  );
}

/* Qualitative band for the comparison meter — easy to scan across profiles. Colour is semantic
   (weak/mixed/strong), independent of the profile's own accent colour used elsewhere on the tile. */
const band = (v: number) =>
  v <= 2 ? { label: 'Weak', color: '#D97B4A' } : v === 3 ? { label: 'Mixed', color: '#C4A934' } : { label: 'Strong', color: '#38A169' };

/* ---------- compact axis-score tile for the result-card header, tinted to the selected profile's colour ---------- */
const StatTile: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => {
  const b = band(value);
  return (
    <div className="rounded-lg p-2.5" style={{ backgroundColor: hexA(accent, 0.07), border: `1px solid ${hexA(accent, 0.22)}` }}>
      <p className="text-[10px] uppercase tracking-[0.05em] text-[#A0AEC0] font-semibold">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-[18px] font-bold" style={{ color: accent }}>{value.toFixed(1)}</span>
        <span className="text-[11px] text-[#A0AEC0]">/ 5</span>
      </div>
      <p className="text-[11px] font-bold mt-0.5" style={{ color: b.color }}>{b.label}</p>
    </div>
  );
};

/* ---------- collapsed-by-default survey-category card, Phase 1 left column ---------- */
const SurveySectionCard: React.FC<{ title: string; icon: LucideIcon; description: string; why: string; insights: InsightPoint[] }> = ({ title, icon: Icon, description, why, insights }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl p-4 relative" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Hide why we ask this' : 'See why we ask this'}
        title={open ? 'Hide why we ask this' : 'See why we ask this'}
        className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: hexA(ACCENT, open ? 0.16 : 0.08) }}
      >
        <ChevronDown size={14} style={{ color: ACCENT, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>
      <div className="flex items-start gap-3 pr-8 cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <span className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(ACCENT, 0.1) }}>
          <Icon size={17} style={{ color: ACCENT }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-[#1A202C]">{title}</p>
          <p className="text-[13px] text-[#718096] leading-[1.5] mt-1">{description}</p>
        </div>
      </div>
      {open && (
        <div className="pl-12 mt-3">
          <p className="text-[12.5px] text-[#4A5568] leading-[1.6] mb-3">{why}</p>
          <div className="flex flex-wrap gap-2">
            {insights.map((pt, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1.5" style={{ backgroundColor: hexA(ACCENT, 0.06), border: `1px solid ${hexA(ACCENT, 0.18)}` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(ACCENT, 0.14) }}>
                  <pt.icon size={11} style={{ color: ACCENT }} />
                </span>
                <span className="text-[11.5px] font-medium text-[#2D3748]">{pt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- compact tile for the full-width persona snapshot: 4 traits + 1 perception, one row ---------- */
/* Renders "**word**" spans as a bold highlight in the tile's accent colour, rest as plain text */
const renderHighlighted = (text: string, accent: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <span key={i} className="font-bold" style={{ color: accent }}>{part}</span> : <React.Fragment key={i}>{part}</React.Fragment>
  );

const TraitTile: React.FC<{ icon: LucideIcon; label: string; bullets: string[]; accent: string; dashed?: boolean; badge?: { label: string; color: string } }> = ({ icon: Icon, label, bullets, accent, dashed, badge }) => (
  <div className="rounded-lg p-3" style={{ backgroundColor: hexA(accent, dashed ? 0.05 : 0.07), border: dashed ? `1.5px dashed ${hexA(accent, 0.4)}` : `1px solid ${hexA(accent, 0.22)}` }}>
    <div className="flex items-center gap-2 mb-1.5">
      <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(accent, 0.12) }}>
        <Icon size={13} style={{ color: accent }} />
      </span>
      <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#A0AEC0] flex-1 leading-tight">{label}</p>
      {badge && <span className="text-[9.5px] font-bold shrink-0" style={{ color: badge.color }}>{badge.label}</span>}
    </div>
    <ul className="space-y-1">
      {bullets.map((b, i) => (
        <li key={i} className="text-[12px] text-[#4A5568] leading-[1.4] flex items-start gap-1.5">
          <span className="w-1 h-1 rounded-full shrink-0 mt-[6px]" style={{ backgroundColor: accent }} />
          <span>{renderHighlighted(b, accent)}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* The four quadrant-defining dimensions — same labels for every profile, values differ */
const TRAIT_FIELDS: { key: keyof ProfileTraits; label: string; Icon: LucideIcon }[] = [
  { key: 'strategy', label: 'AI strategy', Icon: Compass },
  { key: 'experimentation', label: 'Experimentation', Icon: FlaskConical },
  { key: 'governance', label: 'Governance & data', Icon: Shield },
  { key: 'adoption', label: 'Where AI shows up', Icon: Network },
];

/* ============================================================================
   Per-persona evidence callout — one verified, independently-sourced statistic
   grounding the roadmap. Content lives in readinessData.ts (results.evidence).
   Never a consulting firm's own research — academic, government or vendor-survey only.
   ============================================================================ */

const EVIDENCE_ICON: Record<Evidence['icon'], LucideIcon> = {
  compass: Compass,
  target: Target,
  users: Users,
  shield: Shield,
  warning: AlertTriangle,
  trophy: Trophy,
  'trending-up': TrendingUp,
};

/* Readable per-persona accent for the callout (some profile colours are too light for text) */
const EVIDENCE_ACCENT: Record<ProfileId, string> = {
  'sitting-duck': '#2D3748',
  'disconnected-antenna': '#2C9A94',
  'island-of-creativity': '#2B4C7E',
  'systematic-innovator': '#B8860B',
};

const EvidenceCallout: React.FC<{ evidence: Evidence; accent: string }> = ({ evidence, accent }) => {
  const Icon = EVIDENCE_ICON[evidence.icon];
  return (
    <div className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: hexA(accent, 0.06), border: `1px solid ${hexA(accent, 0.22)}` }}>
      <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(accent, 0.13) }}>
        <Icon size={18} style={{ color: accent }} />
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] leading-[1.5] text-[#2D3748]">
          <span className="font-bold" style={{ color: accent }}>{evidence.figure}</span> {evidence.statement}
        </p>
        <p className="text-[11px] text-[#A0AEC0] mt-1.5">Source: {evidence.source}</p>
      </div>
    </div>
  );
};

/* ---------- Phase 2: OXYGY's offerings for this quadrant, the primary visual — not a score ---------- */
const OFFERING_ICON: Record<Offering['icon'], LucideIcon> = {
  compass: Compass,
  graduationCap: GraduationCap,
  flask: FlaskConical,
  shield: Shield,
  refresh: RefreshCw,
  broadcast: Share2,
  target: Target,
};

const OfferingCard: React.FC<{ offering: Offering; accent: string }> = ({ offering, accent }) => {
  const Icon = OFFERING_ICON[offering.icon];
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ backgroundColor: hexA(accent, 0.04), border: `1px solid ${hexA(accent, 0.2)}` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(accent, 0.15) }}>
          <Icon size={19} style={{ color: accent }} />
        </span>
        <p className="text-[14.5px] font-bold text-[#1A202C] leading-tight">{offering.title}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 self-start text-[10.5px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: hexA(accent, 0.1), color: accent }}>
        <Clock size={11} /> {offering.duration}
      </span>
      <p className="text-[12.5px] text-[#4A5568] leading-[1.55] mb-3">{offering.description}</p>
      <div className="mt-auto rounded-lg p-3" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hexA(accent, 0.2)}` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: accent }}>For you</p>
        <p className="text-[12.5px] text-[#2D3748] leading-[1.5]">{offering.valueAdd}</p>
      </div>
      {offering.href && (
        <a href={offering.href} className="inline-flex items-center gap-1 text-[12px] font-bold mt-3 hover:underline" style={{ color: accent }}>
          Explore this offering &rarr;
        </a>
      )}
    </div>
  );
};

/* Small "Phase N" eyebrow badge, consistent across both phase blocks */
const PhaseBadge: React.FC<{ n: 1 | 2 }> = ({ n }) => (
  <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
    Phase {n}
  </span>
);

export const ReadinessAssessment: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ProfileId | null>(null);
  const profile = PROFILES.find((p) => p.id === selectedId) ?? null;
  const isPlaceholder = !profile;
  const displayProfile = profile ?? PROFILES[0]; // blurred preview before a choice is made

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const evidenceAccent = EVIDENCE_ACCENT[displayProfile.id];
  const perceptionBand = band(displayProfile.perception.score);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <a href="#" onClick={goHome} className="inline-flex items-center gap-1.5 text-[14px] mb-8 transition-colors hover:text-[#1E3A5F]" style={{ color: '#718096' }}>
          <ArrowLeft size={16} /> Home
        </a>

        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
            L0 &mdash; AI Readiness
          </div>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15] mb-6">
            AI transformation looks different<br />
            for <span className="relative inline-block">
              everyone
              <span className="absolute left-0 -bottom-1 w-full h-[4px] rounded-full opacity-80" style={{ backgroundColor: DARK }} />
            </span>
          </h1>
        </div>

        {/* Problem-first framing — the "why", ahead of any method */}
        <p className="text-[16px] md:text-[18px] text-[#4A5568] text-center max-w-[620px] mx-auto mb-8 leading-[1.6]">
          Struggling to get AI traction, or unsure if leadership and the frontline even agree on where things stand? This is where you find out, and where the next move gets decided.
        </p>

        {/* Fun fact */}
        <div className="mb-8">
          <div className="relative rounded-2xl px-8 md:px-12 py-8 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30,58,95,0.12) 0%, rgba(43,76,126,0.06) 50%, rgba(30,58,95,0.10) 100%)', border: `1.5px solid ${PALE_BORDER}` }}>
            <div className="absolute top-3 left-4 flex gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DARK, opacity: 0.4 }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DARK, opacity: 0.3 }} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: DARK }}>Did you know?</p>
            <p className="text-[17px] md:text-[19px] text-[#2D3748] font-medium leading-[1.6]">
              <span className="font-bold" style={{ color: DARK }}>95% of enterprise generative-AI pilots</span> deliver no measurable return to the business.
            </p>
            <p className="text-[15px] text-[#718096] leading-[1.6] mt-2">
              The difference is rarely the technology. It's whether the organisation was ready for it.{' '}
              <span className="text-[13px] text-[#A0AEC0]">Source: MIT Project NANDA, &ldquo;State of AI in Business&rdquo;, 2025.</span>
            </p>
          </div>
        </div>

        {/* ============ PHASE 1 — AI READINESS SURVEY ============ */}
        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <PhaseBadge n={1} />
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">AI Readiness Survey</h2>
          </div>
          <p className="text-[14px] text-[#718096] max-w-[760px] mb-7 leading-[1.6]">{PHASE1_WHY}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: what we ask, collapsed by default */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">What we ask</p>
              <div className="space-y-3">
                {SURVEY_CATEGORIES.map((cat) => (
                  <SurveySectionCard key={cat.id} title={cat.title} icon={cat.icon} description={cat.description} why={cat.why} insights={cat.insights} />
                ))}
              </div>
            </div>

            {/* Right: where it places you — the overlay inside the matrix invites the click, no extra copy needed */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Where it places you</p>
              <MatrixSelector selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>

          {/* Full-width persona snapshot, once a quadrant is picked */}
          {!isPlaceholder && (
            <div className="rounded-2xl p-5 sm:p-6 mt-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${displayProfile.color}22` }}>
                      {React.createElement(PROFILE_ICON[displayProfile.id], { size: 20, style: { color: displayProfile.color } })}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[17px] font-bold text-[#1A202C] leading-tight">{displayProfile.name}</p>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#A0AEC0]">{displayProfile.quadrantTag}</p>
                    </div>
                  </div>
                  <p className="text-[15px] font-semibold text-[#1A202C] leading-[1.4] mb-2">&ldquo;{displayProfile.results.output.headline}&rdquo;</p>
                  <p className="text-[13.5px] text-[#4A5568] leading-[1.55]">{displayProfile.summary}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 md:w-[300px] shrink-0">
                  <StatTile label="Strategic" value={strategicScore(displayProfile)} accent={displayProfile.color} />
                  <StatTile label="Work env." value={workEnvScore(displayProfile)} accent={displayProfile.color} />
                  <StatTile label="Overall" value={overallScore(displayProfile)} accent={displayProfile.color} />
                </div>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mt-6 mb-2.5">What this profile looks like</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {TRAIT_FIELDS.map(({ key, label, Icon }) => (
                  <TraitTile key={key} icon={Icon} label={label} bullets={displayProfile.traits[key]} accent={displayProfile.color} />
                ))}
                <TraitTile icon={Users} label="AI Perceptions" bullets={displayProfile.perception.insight} accent={displayProfile.color} dashed badge={{ label: perceptionBand.label, color: perceptionBand.color }} />
              </div>
            </div>
          )}

          {/* Trust line */}
          <p className="text-[12px] text-[#A0AEC0] leading-[1.6] mt-7 pt-5 text-center" style={{ borderTop: '1px solid #E2E8F0' }}>
            Answers are analysed in aggregate, typically across 50&ndash;100 respondents, and always paired with follow-up interviews. It's a starting point, not a verdict.
          </p>
        </div>

        {/* ============ PHASE 2 — YOUR ROADMAP ============ */}
        <div className="rounded-2xl p-6 md:p-8 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <PhaseBadge n={2} />
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">Your roadmap</h2>
          </div>

          {isPlaceholder ? (
            <div className="rounded-2xl flex flex-col items-center justify-center text-center px-6 py-14 mt-5" style={{ backgroundColor: '#F7FAFC', border: `1.5px dashed ${PALE_BORDER}` }}>
              <p className="text-[15px] font-bold text-[#1A202C]">Pick your profile in Phase 1 first</p>
              <p className="text-[13.5px] text-[#718096] mt-1">Your roadmap depends on where the survey places you.</p>
            </div>
          ) : (
            <>
              <p className="text-[14px] text-[#4A5568] leading-[1.6] mt-1 mb-6 max-w-[760px]">{displayProfile.results.decisions.rationale}</p>

              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Where OXYGY can help</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProfile.results.offerings.map((o) => (
                  <OfferingCard key={o.title} offering={o} accent={displayProfile.color} />
                ))}
              </div>

              <div className="rounded-xl p-4 sm:p-5 mt-6" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} style={{ color: '#C53030' }} />
                  <p className="text-[13.5px] font-bold" style={{ color: '#C53030' }}>Guardrails — what not to do right now</p>
                </div>
                <ul className="space-y-2 mb-4">
                  {displayProfile.results.decisions.guardrails.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#742A2A] leading-[1.5]">
                      <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C53030' }} />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: '#C53030' }}>Why this matters</p>
                <EvidenceCallout evidence={displayProfile.results.evidence} accent={evidenceAccent} />
              </div>
            </>
          )}
        </div>

        <ArtifactClosing
          summaryText="Knowing where you stand is step zero. The five levels that follow turn that readiness into real, hands-on AI capability across your teams."
          ctaLabel="Continue to Level 1: Prompt Engineering Fundamentals"
          ctaHref="#playground"
          secondaryCtaLabel="Talk to us about your AI readiness"
          secondaryCtaHref="mailto:uk@oxygyconsulting.com"
          accentColor={DARK}
        />
      </div>
    </div>
  );
};
