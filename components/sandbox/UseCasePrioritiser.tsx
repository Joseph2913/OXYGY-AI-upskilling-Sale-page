import React, { useMemo, useState } from 'react';
import { ArrowRight, Plus, RotateCcw, Check, UsersRound, Scale, Calculator, TrendingUp, Settings, Compass, Zap, Mountain, HeartHandshake, PieChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  SBX_ACCENT,
  SBX_DARK,
  SBX_PALE_BORDER,
  hexA,
  REDUCED_MOTION,
  CRITERIA,
  FUNCTIONS,
  PRESETS,
  PRIORITY_PROFILES,
  QUADRANTS,
  QUADRANT_SEQUENCE,
  impactAxis,
  easeAxis,
  composite,
  quadrantOf,
  type FunctionId,
  type FunctionIconName,
  type PriorityId,
  type PriorityIconName,
  type CriterionId,
  type Scores,
} from '../sandboxData';

const FUNCTION_ICON: Record<FunctionIconName, LucideIcon> = {
  usersRound: UsersRound,
  scale: Scale,
  calculator: Calculator,
  trendingUp: TrendingUp,
  settings: Settings,
};

const PRIORITY_ICON: Record<PriorityIconName, LucideIcon> = {
  zap: Zap,
  mountain: Mountain,
  heart: HeartHandshake,
  pie: PieChart,
};

interface SelectedUseCase {
  id: string;
  title: string;
  isCustom: boolean;
  scores: Scores;
}

type Step = 'function' | 'priorities' | 'select' | 'score' | 'results';

const STEP_ORDER: Step[] = ['function', 'priorities', 'select', 'score', 'results'];

const MIN_SELECT = 3;
const MAX_SELECT = 5;
const MAX_CUSTOM = 2;

const DEFAULT_CUSTOM_SCORES: Scores = { impact: 3, feasibility: 3, adoption: 3, data: 3 };

/* Step chip for the mini progress header inside the card.
   Completed steps are clickable, so users can step back without starting over. */
const StepChip: React.FC<{ n: number; label: string; state: 'done' | 'active' | 'todo'; onClick?: () => void }> = ({
  n,
  label,
  state,
  onClick,
}) => {
  const style: React.CSSProperties =
    state === 'active'
      ? { backgroundColor: SBX_ACCENT, color: '#FFFFFF' }
      : state === 'done'
        ? { backgroundColor: hexA(SBX_ACCENT, 0.1), color: SBX_DARK }
        : { backgroundColor: '#FFFFFF', color: '#A0AEC0', border: '1px solid #E2E8F0' };
  const content = (
    <>
      {state === 'done' ? <Check size={11} /> : <span>{n}.</span>} {label}
    </>
  );
  if (state === 'done' && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`Back to: ${label}`}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E]"
        style={style}
      >
        {content}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap" style={style}>
      {content}
    </span>
  );
};

/* One slider row: native range input, accent-colored, live value chip */
const ScoreSlider: React.FC<{ criterion: CriterionId; value: number; onChange: (v: number) => void }> = ({
  criterion,
  value,
  onChange,
}) => {
  const c = CRITERIA.find((x) => x.id === criterion)!;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-[12px] font-bold text-[#2D3748]">{c.label}</span>
          <span className="text-[11px] text-[#A0AEC0] ml-2 hidden sm:inline">{c.hint}</span>
        </div>
        <span className="text-[12px] font-bold tabular-nums px-1.5 py-0.5 rounded" style={{ backgroundColor: hexA(SBX_ACCENT, 0.08), color: SBX_DARK }}>
          {value}/5
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 cursor-pointer"
        style={{ accentColor: SBX_ACCENT }}
        aria-label={`${c.label}: ${value} out of 5`}
      />
    </div>
  );
};

/* Positioned dot data derived per render — no cached state to invalidate */
interface PlottedDot {
  uc: SelectedUseCase;
  leftPct: number;
  topPct: number;
  color: string;
}

function plotDots(selected: SelectedUseCase[]): PlottedDot[] {
  const raw = selected.map((uc) => {
    const x = ((easeAxis(uc.scores) - 1) / 4) * 100;
    const y = (1 - (impactAxis(uc.scores) - 1) / 4) * 100;
    return {
      uc,
      leftPct: Math.min(92, Math.max(8, x)),
      topPct: Math.min(92, Math.max(8, y)),
      color: QUADRANTS[quadrantOf(uc.scores)].color,
    };
  });
  // deterministic collision offset: identical positions fan out horizontally
  const groups = new Map<string, PlottedDot[]>();
  raw.forEach((d) => {
    const key = `${Math.round(d.leftPct)}-${Math.round(d.topPct)}`;
    const g = groups.get(key) ?? [];
    g.push(d);
    groups.set(key, g);
  });
  groups.forEach((g) => {
    if (g.length < 2) return;
    g.forEach((d, i) => {
      d.leftPct = Math.min(92, Math.max(8, d.leftPct + (i - (g.length - 1) / 2) * 5));
    });
  });
  return raw;
}

const MatrixPlot: React.FC<{
  dots: PlottedDot[];
  activeDotId: string | null;
  onDotClick: (id: string) => void;
}> = ({ dots, activeDotId, onDotClick }) => (
  <div className="select-none">
    <div className="flex gap-2">
      {/* Y axis */}
      <div className="flex flex-col items-center justify-between py-1">
        <span className="text-[10px] font-semibold text-[#A0AEC0]">High</span>
        <span
          className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568] whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          BUSINESS IMPACT
        </span>
        <span className="text-[10px] font-semibold text-[#A0AEC0]">Low</span>
      </div>

      <div className="relative flex-1 rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', aspectRatio: '1 / 1', backgroundColor: '#FFFFFF' }}>
        {/* Quadrant backgrounds + labels */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="relative" style={{ borderRight: '1px dashed #E2E8F0', borderBottom: '1px dashed #E2E8F0', backgroundColor: hexA(QUADRANTS['longer-term-bets'].color, 0.04) }}>
            <span className="absolute top-2 left-2.5 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: QUADRANTS['longer-term-bets'].color }}>
              Longer-term bets
            </span>
          </div>
          <div className="relative" style={{ borderBottom: '1px dashed #E2E8F0', backgroundColor: hexA(QUADRANTS['quick-wins'].color, 0.07) }}>
            <span className="absolute top-2 right-2.5 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: QUADRANTS['quick-wins'].color }}>
              ★ Quick wins
            </span>
          </div>
          <div className="relative" style={{ borderRight: '1px dashed #E2E8F0' }}>
            <span className="absolute bottom-2 left-2.5 text-[10px] font-bold uppercase tracking-[0.05em] text-[#A0AEC0]">Park for now</span>
          </div>
          <div className="relative" style={{ backgroundColor: hexA(QUADRANTS['scale-opportunities'].color, 0.05) }}>
            <span className="absolute bottom-2 right-2.5 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: QUADRANTS['scale-opportunities'].color }}>
              Scale opportunities
            </span>
          </div>
        </div>

        {/* Dots */}
        {dots.map((d, i) => {
          const active = d.uc.id === activeDotId;
          const dimOthers = activeDotId !== null && !active;
          return (
            <button
              key={d.uc.id}
              type="button"
              onClick={() => onDotClick(d.uc.id)}
              className={`absolute z-10 ${REDUCED_MOTION ? '' : 'sbx-dot-pop'}`}
              style={{
                left: `${d.leftPct}%`,
                top: `${d.topPct}%`,
                transform: 'translate(-50%,-50%)',
                animationDelay: REDUCED_MOTION ? undefined : `${i * 120}ms`,
                transition: REDUCED_MOTION ? 'none' : 'left 0.6s ease, top 0.6s ease, opacity 0.2s ease',
                opacity: dimOthers ? 0.5 : 1,
              }}
              aria-label={`${d.uc.title} — ${QUADRANTS[quadrantOf(d.uc.scores)].label}`}
              title={d.uc.title}
            >
              <span
                className="block rounded-full"
                style={{
                  width: active ? 20 : 16,
                  height: active ? 20 : 16,
                  backgroundColor: d.color,
                  border: '2.5px solid #FFFFFF',
                  boxShadow: `0 0 0 ${active ? 4 : 3}px ${hexA(d.color, active ? 0.3 : 0.18)}`,
                  transition: 'width 0.15s ease, height 0.15s ease',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>

    {/* X axis */}
    <div className="flex justify-between items-center mt-2 pl-8">
      <span className="text-[10px] font-semibold text-[#A0AEC0]">Hard</span>
      <span className="text-[10px] font-bold tracking-[0.08em] text-[#4A5568]">EASE OF DELIVERY</span>
      <span className="text-[10px] font-semibold text-[#A0AEC0]">Easy</span>
    </div>
  </div>
);

export const UseCasePrioritiser: React.FC = () => {
  const [step, setStep] = useState<Step>('function');
  const [functionId, setFunctionId] = useState<FunctionId | null>(null);
  const [priorityId, setPriorityId] = useState<PriorityId | null>(null);
  const [selected, setSelected] = useState<SelectedUseCase[]>([]);
  const [activeDotId, setActiveDotId] = useState<string | null>(null);
  const [customDraft, setCustomDraft] = useState('');
  const [customCount, setCustomCount] = useState(0);

  const presets = functionId ? PRESETS[functionId] : [];
  const customsSelected = selected.filter((u) => u.isCustom).length;
  const profile = PRIORITY_PROFILES.find((p) => p.id === priorityId) ?? null;

  const pickFunction = (id: FunctionId) => {
    if (id !== functionId) {
      setSelected([]);
      setActiveDotId(null);
    }
    setFunctionId(id);
    setStep('priorities');
  };

  const pickPriority = (id: PriorityId) => {
    setPriorityId(id);
    setStep('select');
  };

  const togglePreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    setSelected((prev) => {
      const exists = prev.some((u) => u.id === presetId);
      if (exists) return prev.filter((u) => u.id !== presetId);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, { id: preset.id, title: preset.title, isCustom: false, scores: { ...preset.defaultScores } }];
    });
  };

  const addCustom = () => {
    const title = customDraft.trim();
    if (!title || customsSelected >= MAX_CUSTOM || selected.length >= MAX_SELECT) return;
    const id = `custom-${customCount + 1}`;
    setCustomCount((n) => n + 1);
    setSelected((prev) => [...prev, { id, title, isCustom: true, scores: { ...DEFAULT_CUSTOM_SCORES } }]);
    setCustomDraft('');
  };

  const setScore = (ucId: string, criterion: CriterionId, value: number) => {
    setSelected((prev) => prev.map((u) => (u.id === ucId ? { ...u, scores: { ...u.scores, [criterion]: value } } : u)));
  };

  const startOver = () => {
    setStep('function');
    setFunctionId(null);
    setPriorityId(null);
    setSelected([]);
    setActiveDotId(null);
    setCustomDraft('');
  };

  const dots = useMemo(() => plotDots(selected), [selected]);
  const activeUc = selected.find((u) => u.id === activeDotId) ?? null;

  /* sequencing: quadrant order first, then the priority profile's weighted composite */
  const sequence = useMemo(() => {
    const w = profile?.weights;
    const ranked = [...selected].sort((a, b) => composite(b.scores, w) - composite(a.scores, w));
    const inPlay = QUADRANT_SEQUENCE.flatMap((q) => ranked.filter((u) => quadrantOf(u.scores) === q));
    const parked = ranked.filter((u) => quadrantOf(u.scores) === 'deprioritise');
    return { inPlay, parked };
  }, [selected, profile]);

  const stepState = (s: Step): 'done' | 'active' | 'todo' => {
    const cur = STEP_ORDER.indexOf(step);
    const idx = STEP_ORDER.indexOf(s);
    return idx < cur ? 'done' : idx === cur ? 'active' : 'todo';
  };

  const goBackTo = (s: Step) => {
    setActiveDotId(null);
    setStep(s);
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      {/* Step header — completed chips navigate back */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <StepChip n={1} label="Your function" state={stepState('function')} onClick={() => goBackTo('function')} />
        <StepChip n={2} label="Your priorities" state={stepState('priorities')} onClick={() => goBackTo('priorities')} />
        <StepChip n={3} label="Pick use cases" state={stepState('select')} onClick={() => goBackTo('select')} />
        <StepChip n={4} label="Score them" state={stepState('score')} onClick={() => goBackTo('score')} />
        <StepChip n={5} label="Your matrix" state={stepState('results')} />
        {step !== 'function' && (
          <button
            type="button"
            onClick={startOver}
            className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#718096] hover:text-[#1E3A5F] transition-colors"
          >
            <RotateCcw size={13} /> Start over
          </button>
        )}
      </div>

      {/* ---- STEP 1: function ---- */}
      {step === 'function' && (
        <div>
          <p className="text-[14px] text-[#4A5568] mb-4">Where do you sit? We'll suggest use cases we see most often in your world.</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FUNCTIONS.map((f) => {
              const Icon = FUNCTION_ICON[f.icon];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => pickFunction(f.id)}
                  className="rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E]"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
                >
                  <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: hexA(SBX_ACCENT, 0.1) }}>
                    <Icon size={20} style={{ color: SBX_ACCENT }} />
                  </span>
                  <span className="text-[13.5px] font-bold text-[#1A202C]">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- STEP 2: priorities / archetype ---- */}
      {step === 'priorities' && (
        <div>
          <p className="text-[14px] text-[#4A5568] mb-1">
            What matters most to your organisation right now?
          </p>
          <p className="text-[12.5px] text-[#A0AEC0] mb-4">
            The same use case can be a quick win for one organisation and a distraction for another — your priorities re-weight how we score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRIORITY_PROFILES.map((p) => {
              const Icon = PRIORITY_ICON[p.icon];
              const isSelected = p.id === priorityId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickPriority(p.id)}
                  className="rounded-xl p-4 text-left flex flex-col transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E]"
                  style={{
                    backgroundColor: isSelected ? hexA(SBX_ACCENT, 0.06) : '#FFFFFF',
                    border: isSelected ? `1.5px solid ${SBX_ACCENT}` : '1px solid #E2E8F0',
                  }}
                >
                  <span className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5" style={{ backgroundColor: hexA(SBX_ACCENT, 0.1) }}>
                    <Icon size={18} style={{ color: SBX_ACCENT }} />
                  </span>
                  <span className="text-[14px] font-bold text-[#1A202C] leading-tight">{p.label}</span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.05em] mt-1" style={{ color: SBX_ACCENT }}>
                    {p.archetype}
                  </span>
                  <span className="text-[12px] text-[#718096] leading-[1.5] mt-1.5">{p.description}</span>
                  <span className="text-[10.5px] text-[#A0AEC0] mt-2.5 pt-2" style={{ borderTop: '1px dashed #E2E8F0' }}>
                    Weights:{' '}
                    {CRITERIA.map((c) => `${c.label.split(' ')[0]} ${Math.round(p.weights[c.id] * 100)}%`).join(' · ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- STEP 3: select use cases ---- */}
      {step === 'select' && functionId && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <p className="text-[14px] text-[#4A5568]">
              Pick <span className="font-bold text-[#1A202C]">{MIN_SELECT}–{MAX_SELECT}</span> use cases that sound familiar.
            </p>
            <span className="text-[12.5px] font-bold tabular-nums" style={{ color: selected.length >= MIN_SELECT ? SBX_ACCENT : '#A0AEC0' }}>
              {selected.length} of {MAX_SELECT} selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {presets.map((p) => {
              const isSelected = selected.some((u) => u.id === p.id);
              const disabled = !isSelected && selected.length >= MAX_SELECT;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePreset(p.id)}
                  disabled={disabled}
                  className="rounded-xl p-3.5 text-left flex items-start gap-3 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E]"
                  style={{
                    backgroundColor: isSelected ? hexA(SBX_ACCENT, 0.06) : '#FFFFFF',
                    border: isSelected ? `1.5px solid ${SBX_ACCENT}` : '1px solid #E2E8F0',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: isSelected ? SBX_ACCENT : '#FFFFFF', border: isSelected ? 'none' : '1.5px solid #CBD5E0' }}
                  >
                    {isSelected && <Check size={13} className={`text-white ${REDUCED_MOTION ? '' : 'sbx-check-pop'}`} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-[#1A202C] leading-tight">{p.title}</span>
                    <span className="block text-[12px] text-[#718096] leading-[1.45] mt-0.5">{p.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom use case */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustom();
              }}
              placeholder={customsSelected >= MAX_CUSTOM ? 'Custom limit reached (2)' : 'Add your own use case…'}
              disabled={customsSelected >= MAX_CUSTOM || selected.length >= MAX_SELECT}
              className="flex-1 rounded-full px-4 py-2.5 text-[13.5px] text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none disabled:opacity-50"
              style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${SBX_PALE_BORDER}` }}
            />
            <button
              type="button"
              onClick={addCustom}
              disabled={!customDraft.trim() || customsSelected >= MAX_CUSTOM || selected.length >= MAX_SELECT}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${SBX_ACCENT}`, color: SBX_DARK }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep('score')}
            disabled={selected.length < MIN_SELECT}
            className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-7 py-3 text-[14px] transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ backgroundColor: SBX_DARK }}
          >
            Score these use cases <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ---- STEP 4: score ---- */}
      {step === 'score' && (
        <div>
          <p className="text-[14px] text-[#4A5568] mb-4">
            We've pre-filled typical scores — adjust anything that doesn't match your reality, or plot straight away.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {selected.map((uc) => (
              <div key={uc.id} className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <p className="text-[13.5px] font-bold text-[#1A202C] mb-3">
                  {uc.title}
                  {uc.isCustom && <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#A0AEC0] ml-2">Custom</span>}
                </p>
                <div className="space-y-2.5">
                  {CRITERIA.map((c) => (
                    <ScoreSlider key={c.id} criterion={c.id} value={uc.scores[c.id]} onChange={(v) => setScore(uc.id, c.id, v)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveDotId(null);
              setStep('results');
            }}
            className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-7 py-3 text-[14px] transition-all duration-150 hover:-translate-y-0.5"
            style={{ backgroundColor: SBX_DARK }}
          >
            Plot my portfolio <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ---- STEP 5: results ---- */}
      {step === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <MatrixPlot dots={dots} activeDotId={activeDotId} onDotClick={(id) => setActiveDotId(id === activeDotId ? null : id)} />
            <p className="text-[11.5px] text-[#A0AEC0] mt-3 leading-[1.5]">
              Click a dot to see its breakdown. Drag its sliders and watch it move — that's the scoring conversation the real Sandbox runs with your teams.
            </p>
          </div>

          <div className="space-y-4">
            {/* Active dot detail (with live sliders) or an invite */}
            {activeUc ? (
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${QUADRANTS[quadrantOf(activeUc.scores)].color}` }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[14.5px] font-bold text-[#1A202C]">{activeUc.title}</p>
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      backgroundColor: hexA(QUADRANTS[quadrantOf(activeUc.scores)].color, 0.12),
                      color: QUADRANTS[quadrantOf(activeUc.scores)].color,
                    }}
                  >
                    {QUADRANTS[quadrantOf(activeUc.scores)].label}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#4A5568] leading-[1.55] mb-3">
                  {QUADRANTS[quadrantOf(activeUc.scores)].advice}{' '}
                  {(() => {
                    const weakest = CRITERIA.reduce((min, c) => (activeUc.scores[c.id] < activeUc.scores[min.id] ? c : min), CRITERIA[0]);
                    return (
                      <>
                        Watch <span className="font-semibold text-[#2D3748]">{weakest.label.toLowerCase()}</span> ({activeUc.scores[weakest.id]}/5) as the main dependency.
                      </>
                    );
                  })()}
                </p>
                <div className="space-y-2.5 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                  {CRITERIA.map((c) => (
                    <ScoreSlider key={c.id} criterion={c.id} value={activeUc.scores[c.id]} onChange={(v) => setScore(activeUc.id, c.id, v)} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl px-5 py-6 text-center" style={{ backgroundColor: '#FFFFFF', border: `1.5px dashed ${SBX_PALE_BORDER}` }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#EAF0F8' }}>
                  <Compass size={17} style={{ color: SBX_ACCENT }} />
                </span>
                <p className="text-[13.5px] font-bold text-[#1A202C]">Click a dot to inspect it</p>
                <p className="text-[12px] text-[#718096] mt-1">See its score breakdown and nudge the sliders live.</p>
              </div>
            )}

            {/* Sequencing */}
            <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Your sequencing</p>
                {profile && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ backgroundColor: hexA(SBX_ACCENT, 0.08), color: SBX_DARK }}>
                    {React.createElement(PRIORITY_ICON[profile.icon], { size: 11 })}
                    Weighted for {profile.archetype}
                  </span>
                )}
              </div>
              <ol className="space-y-2">
                {sequence.inPlay.map((uc, i) => {
                  const q = QUADRANTS[quadrantOf(uc.scores)];
                  return (
                    <li key={uc.id} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 tabular-nums" style={{ backgroundColor: q.color }}>
                        {i + 1}
                      </span>
                      <button type="button" onClick={() => setActiveDotId(uc.id)} className="text-[13px] font-semibold text-[#2D3748] hover:underline text-left">
                        {uc.title}
                      </button>
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.04em] ml-auto shrink-0" style={{ color: q.color }}>
                        {q.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {sequence.parked.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px dashed #E2E8F0' }}>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#A0AEC0] mb-1.5">Park for now</p>
                  {sequence.parked.map((uc) => (
                    <button key={uc.id} type="button" onClick={() => setActiveDotId(uc.id)} className="block text-[12.5px] text-[#A0AEC0] hover:text-[#718096] hover:underline text-left">
                      {uc.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[12px] text-[#A0AEC0] leading-[1.6]">
              Illustrative presets — in the real Sandbox these scores come from your teams and your data, against criteria your leadership defines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
