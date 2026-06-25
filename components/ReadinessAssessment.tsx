import React, { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle, RadioTower, Lightbulb, Trophy, ArrowDown, Compass, Users, ChevronDown, Database, Search, Shield, Target, TrendingUp, FlaskConical, Network } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';
import {
  QUESTIONS,
  PROFILES,
  strategicScore,
  workEnvScore,
  overallScore,
  type Profile,
  type ProfileId,
  type Question,
  type Evidence,
  type ProfileTraits,
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

/* Colour per data-collection cluster (for the stacked emphasis bar) */
const CLUSTER_COLOR: Record<string, string> = {
  'On-the-ground signal': '#2B4C7E',
  'Strategic direction': '#38B2AC',
  'Systems & operating reality': '#C4A934',
};

/* The three signal sources gathered in the Collect stage (generic, pre-quadrant) */
const SIGNAL_SOURCES: { cluster: string; icon: LucideIcon; captures: string; instruments: string; informs: string }[] = [
  { cluster: 'On-the-ground signal', icon: Users, captures: 'How your people actually work with AI today, and where the appetite and skills sit.', instruments: 'Org-wide survey · Focus groups · Pulse checks', informs: 'Work Environment' },
  { cluster: 'Strategic direction', icon: Compass, captures: 'Where leadership wants AI to take the business, and how clearly that is set and shared.', instruments: 'Leadership interviews · Leadership-agenda workshop', informs: 'Strategic Context' },
  { cluster: 'Systems & operating reality', icon: Database, captures: 'The data, tools and governance underneath, including any ungoverned shadow AI.', instruments: 'Data & IT review · Systems audit · Data checks', informs: 'Both factors' },
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
  const top = (1 - (sc - 1) / 4) * 100;

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
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className="relative rounded-xl p-3 sm:p-4 flex flex-col items-start text-left transition-all duration-150 hover:-translate-y-0.5"
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

/* Qualitative band for the comparison meter — easy to scan across profiles */
const band = (v: number) =>
  v <= 2 ? { label: 'Weak', color: '#D97B4A' } : v === 3 ? { label: 'Mixed', color: '#C4A934' } : { label: 'Strong', color: '#2BA89C' };

/* ---------- comparison meter: 5 segments + value + qualitative band ---------- */
const ScoreMeter: React.FC<{ value: number }> = ({ value }) => {
  const b = band(value);
  return (
    <div className="shrink-0 w-[130px]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.04em]" style={{ color: b.color }}>{b.label}</span>
        <span className="text-[11px] font-bold text-[#A0AEC0]">{value}/5</span>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-[8px] flex-1 rounded-[2px]" style={{ backgroundColor: n <= value ? b.color : '#EDF2F7', transition: 'background-color 0.4s ease' }} />
        ))}
      </div>
    </div>
  );
};

/* ---------- compact axis-score tile for the result-card header ---------- */
const StatTile: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const b = band(value);
  return (
    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #EDF2F7' }}>
      <p className="text-[10px] uppercase tracking-[0.05em] text-[#A0AEC0] font-semibold">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-[18px] font-bold" style={{ color: DARK }}>{value.toFixed(1)}</span>
        <span className="text-[11px] text-[#A0AEC0]">/ 5</span>
        <span className="text-[11px] font-bold ml-auto" style={{ color: b.color }}>{b.label}</span>
      </div>
    </div>
  );
};

/* ---------- question row: statement + comparison meter + Learn more ---------- */
const QuestionRow: React.FC<{ q: Question; value: number }> = ({ q, value }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-2.5 border-b border-[#EDF2F7] last:border-0">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[14px] text-[#2D3748] flex-1 leading-[1.45]">
          {q.label}
          {q.rationale && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-0.5 text-[12px] font-semibold ml-1.5 align-baseline whitespace-nowrap"
              style={{ color: ACCENT }}
            >
              Learn more
              <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>
          )}
        </p>
        <ScoreMeter value={value} />
      </div>
      {open && q.rationale && (
        <div className="mt-2 rounded-lg p-3 space-y-1.5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-[12.5px] text-[#4A5568] leading-[1.55]"><span className="font-bold" style={{ color: DARK }}>Why it matters · </span>{q.rationale.why}</p>
          <p className="text-[12.5px] text-[#4A5568] leading-[1.55]"><span className="font-bold" style={{ color: DARK }}>How we collect it · </span>{q.rationale.collected}</p>
          <p className="text-[12.5px] text-[#4A5568] leading-[1.55]"><span className="font-bold" style={{ color: DARK }}>What it enables · </span>{q.rationale.enables}</p>
        </div>
      )}
    </div>
  );
};

/* The four quadrant-defining dimensions — same labels for every profile, values differ */
const TRAIT_FIELDS: { key: keyof ProfileTraits; label: string; Icon: LucideIcon }[] = [
  { key: 'strategy', label: 'AI strategy', Icon: Compass },
  { key: 'experimentation', label: 'Experimentation', Icon: FlaskConical },
  { key: 'governance', label: 'Governance & data', Icon: Shield },
  { key: 'adoption', label: 'Where AI shows up', Icon: Network },
];

/* ============================================================================
   Per-persona evidence callouts. The Analyse and Decide phases each show one
   verified industry statistic, tailored to that profile's situation and sourced.
   Content lives in readinessData.ts (results.analysis.evidence / decisions.evidence).
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

export const ReadinessAssessment: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ProfileId | null>(null);
  const profile = PROFILES.find((p) => p.id === selectedId) ?? null;
  const isPlaceholder = !profile;
  const displayProfile = profile ?? PROFILES[0]; // blurred preview before a choice is made

  const [inputsOpen, setInputsOpen] = useState(false); // detailed answers collapsed by default

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const strategicQs = QUESTIONS.filter((q) => q.block === 'strategic');
  const workEnvQs = QUESTIONS.filter((q) => q.block === 'workEnvironment');

  const evidenceAccent = EVIDENCE_ACCENT[displayProfile.id];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <a href="#" onClick={goHome} className="inline-flex items-center gap-1.5 text-[14px] mb-8 transition-colors hover:text-[#1E3A5F]" style={{ color: '#718096' }}>
          <ArrowLeft size={16} /> Home
        </a>

        {/* Title */}
        <div className="mb-8 text-center">
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

        {/* ① Collect — how the assessment gathers signals and reads them against two factors */}
        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ backgroundColor: DARK }}>1</span>
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">How we read your AI readiness</h2>
          </div>
          <p className="text-[14px] text-[#718096] max-w-[680px] mb-6 leading-[1.6]">We gather real signals from three sources, then score them against two factors to place you on the matrix.</p>

          {/* Three signal sources */}
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Three signal sources</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {SIGNAL_SOURCES.map(({ cluster, icon: Icon, captures, instruments, informs }) => {
              const c = CLUSTER_COLOR[cluster];
              return (
                <div key={cluster} className="rounded-xl p-4 flex flex-col" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(c, 0.14) }}>
                      <Icon size={16} style={{ color: c }} />
                    </span>
                    <p className="text-[14px] font-bold text-[#1A202C] leading-tight">{cluster}</p>
                  </div>
                  <p className="text-[13px] text-[#718096] leading-[1.5] mb-2.5">{captures}</p>
                  <p className="text-[12px] text-[#4A5568] leading-[1.5] mb-3">{instruments}</p>
                  <div className="mt-auto pt-2.5" style={{ borderTop: '1px solid #EDF2F7' }}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em]" style={{ color: c }}>Informs {informs}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scored against two factors */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">Scored against two factors</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${PALE_BORDER}` }}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[15px] font-bold" style={{ color: DARK }}>Strategic Context</p>
                <span className="text-[11px] font-semibold text-[#A0AEC0] whitespace-nowrap">Unclear → Defined</span>
              </div>
              <p className="text-[13px] text-[#718096] leading-[1.6]">Strategy definition · leadership motivation · data &amp; infrastructure · tech-stack consistency · governance</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${PALE_BORDER}` }}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[15px] font-bold" style={{ color: DARK }}>Work Environment</p>
                <span className="text-[11px] font-semibold text-[#A0AEC0] whitespace-nowrap">Conventional → Innovative</span>
              </div>
              <p className="text-[13px] text-[#718096] leading-[1.6]">Experimentation &amp; sandboxes · idea governance · AI knowledge &amp; resources · teamwork &amp; sponsorship</p>
            </div>
          </div>

          {/* Bridge into the results */}
          <div className="flex flex-col items-center mt-5">
            <ArrowDown size={20} style={{ color: '#A0AEC0' }} />
            <p className="text-[13.5px] font-semibold text-[#2D3748] mt-1">Together these place you in one of four profiles.</p>
          </div>
        </div>

        {/* ② Results — the visitor picks the profile that fits, and its tailored picture appears */}
        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ backgroundColor: DARK }}>2</span>
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">Which profile do you belong to?</h2>
          </div>
          <p className="text-[14px] text-[#718096] mb-6">Pick the quadrant that fits your organisation, and we'll show its tailored readiness picture.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: interactive quadrant selector */}
            <div>
              <MatrixSelector selectedId={selectedId} onSelect={setSelectedId} />
              <p className="text-[12px] text-[#A0AEC0] mt-3 leading-[1.5]">Each quadrant is an AI-readiness profile. Pick the one that sounds most like your organisation.</p>
            </div>

            {/* Right: the selected profile's detail, or a prompt to choose */}
            <div>
              {isPlaceholder ? (
                <div className="rounded-2xl h-full flex flex-col items-center justify-center text-center px-8 py-12" style={{ backgroundColor: '#FFFFFF', border: `1.5px dashed ${PALE_BORDER}` }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#EAF0F8' }}>
                    <Compass size={20} style={{ color: ACCENT }} />
                  </div>
                  <p className="text-[17px] font-bold text-[#1A202C]">Pick a quadrant to begin</p>
                  <p className="text-[14px] text-[#718096] mt-1 leading-[1.6] max-w-[320px]">Choose the profile on the left that sounds most like your organisation, and we'll reveal its tailored readiness picture.</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${displayProfile.color}22` }}>
                      {React.createElement(PROFILE_ICON[displayProfile.id], { size: 20, style: { color: displayProfile.color } })}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[18px] font-bold text-[#1A202C] leading-tight">{displayProfile.name}</p>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#A0AEC0]">{displayProfile.quadrantTag}</p>
                    </div>
                  </div>
                  <p className="text-[16px] font-semibold text-[#1A202C] leading-[1.4] mb-2">&ldquo;{displayProfile.results.output.headline}&rdquo;</p>
                  <p className="text-[14px] text-[#4A5568] leading-[1.55] mb-5">{displayProfile.summary}</p>
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    <StatTile label="Strategic" value={strategicScore(displayProfile)} />
                    <StatTile label="Work env." value={workEnvScore(displayProfile)} />
                    <StatTile label="Overall" value={overallScore(displayProfile)} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2.5">What this profile looks like</p>
                  <div className="space-y-2.5">
                    {TRAIT_FIELDS.map(({ key, label, Icon }) => (
                      <div key={key} className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                        <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: hexA(evidenceAccent, 0.12) }}>
                          <Icon size={16} style={{ color: evidenceAccent }} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#A0AEC0]">{label}</p>
                          <p className="text-[13px] text-[#4A5568] leading-[1.5] mt-0.5 line-clamp-2">{displayProfile.traits[key]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile detail + phases + full answers — revealed once a profile is chosen */}
        {!isPlaceholder && (
          <>
            {/* ③ What it means — how we'd collect, what we'd analyse, what to do next */}
            <div className="rounded-2xl p-6 md:p-8 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ backgroundColor: DARK }}>3</span>
                <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">What this means, and what to do</h2>
              </div>
              <p className="text-[14px] text-[#718096] mb-7 leading-[1.6]">From your profile: how we'd run the assessment, the question your data forces, and the moves that follow.</p>

              {/* A — Collection focus (re-weighted per profile) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(ACCENT, 0.1) }}>
                    <Database size={16} style={{ color: ACCENT }} />
                  </span>
                  <p className="text-[14px] font-bold text-[#1A202C]">How we'd focus your data collection</p>
                </div>
                <p className="text-[13px] text-[#718096] leading-[1.55] mb-3">Same three sources every time, re-weighted to dig hardest where your unknowns are.</p>
                <div className="flex w-full h-[16px] rounded-full overflow-hidden mb-4">
                  {displayProfile.results.dataSources.map((d) => (
                    <div key={d.cluster} style={{ width: `${d.weight}%`, backgroundColor: CLUSTER_COLOR[d.cluster], transition: 'width 0.6s ease' }} title={`${d.cluster} ${d.weight}%`} />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayProfile.results.dataSources.map((d) => (
                    <div key={d.cluster} className="rounded-xl p-3.5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #EDF2F7' }}>
                      <p className="text-[13px] leading-[1.35] mb-1"><span className="font-bold text-[#1A202C]">{d.cluster}</span><span className="font-bold" style={{ color: CLUSTER_COLOR[d.cluster] }}> · {d.weight}%</span></p>
                      <p className="text-[12.5px] text-[#718096] leading-[1.5] mb-1.5">{d.detail}</p>
                      <p className="text-[11.5px] text-[#A0AEC0]">Who: {d.who}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B — Analyse */}
              <div className="mt-7 pt-7" style={{ borderTop: '1px solid #EDF2F7' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(ACCENT, 0.1) }}>
                    <Search size={16} style={{ color: ACCENT }} />
                  </span>
                  <p className="text-[14px] font-bold text-[#1A202C]">What we'd analyse</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1A202C] leading-[1.45] mb-3">&ldquo;{displayProfile.results.analysis.centralQuestion}&rdquo;</p>
                    <ul className="space-y-2">
                      {displayProfile.results.analysis.computes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#4A5568] leading-[1.5]">
                          <Check size={15} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <EvidenceCallout evidence={displayProfile.results.analysis.evidence} accent={evidenceAccent} />
                </div>
              </div>

              {/* C — Decide */}
              <div className="mt-7 pt-7" style={{ borderTop: '1px solid #EDF2F7' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: hexA(ACCENT, 0.1) }}>
                    <Compass size={16} style={{ color: ACCENT }} />
                  </span>
                  <p className="text-[14px] font-bold text-[#1A202C]">What to do next</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div>
                    <ol className="space-y-3 mb-4">
                      {displayProfile.results.decisions.sequence.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: ACCENT }}>{i + 1}</span>
                          <span className="text-[13.5px] text-[#2D3748] leading-[1.5] pt-0.5">{s}</span>
                        </li>
                      ))}
                    </ol>
                    {displayProfile.results.decisions.guardrail && (
                      <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                        <p className="text-[12.5px] text-[#C53030] leading-[1.5]"><span className="font-bold">Guardrail · </span>{displayProfile.results.decisions.guardrail}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <EvidenceCallout evidence={displayProfile.results.decisions.evidence} accent={evidenceAccent} />
                    <p className="text-[10.5px] uppercase tracking-[0.06em] text-[#A0AEC0] font-bold mt-4 mb-1.5">Routes into</p>
                    <div className="flex flex-wrap gap-1.5">
                      {displayProfile.results.decisions.routesInto.map((r) => (
                        <span key={r} className="text-[12px] font-medium rounded-full px-2.5 py-1" style={{ backgroundColor: '#EAF0F8', color: DARK }}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}

        <ArtifactClosing
          summaryText="Knowing where you stand is step zero. The five levels that follow turn that readiness into real, hands-on AI capability across your teams."
          ctaLabel="Continue to Level 1: Prompt Engineering Fundamentals"
          ctaHref="#playground"
          accentColor={DARK}
        />
      </div>
    </div>
  );
};
