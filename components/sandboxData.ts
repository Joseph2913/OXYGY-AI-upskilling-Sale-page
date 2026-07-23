/* ============================================================================
   Content source of truth for the AI Innovation Sandbox page.
   All copy, typed data and scoring math live here; presentation lives in
   InnovationSandbox.tsx and components/sandbox/*.
   ============================================================================ */

/* Page accent family — shared with the Readiness page so the two consulting-offer
   pages read as siblings. Teal is reserved as the semantic "live / production" colour. */
export const SBX_ACCENT = '#2B4C7E';
export const SBX_DARK = '#1E3A5F';
export const SBX_TEAL = '#2C9A94';
export const SBX_PALE_BORDER = '#C7D3E8';

/* hex -> rgba with alpha */
export const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* Module-level reduced-motion flag: counters snap, hero renders a static frame. */
export const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

/* ---------------------------------------------------------------------------
   Hero funnel — the looping conveyor of use-case chips
   --------------------------------------------------------------------------- */
export interface HeroChip {
  label: string;
  /** survives to production, or gets filtered out in the sandbox */
  outcome: 'live' | 'filtered';
}

export const HERO_CHIPS: HeroChip[] = [
  { label: 'Contract review', outcome: 'live' },
  { label: 'Lead scoring', outcome: 'filtered' },
  { label: 'Invoice triage', outcome: 'live' },
  { label: 'CV screening', outcome: 'filtered' },
  { label: 'SOP assistant', outcome: 'live' },
];

/* ---------------------------------------------------------------------------
   Section 01 — the problem
   --------------------------------------------------------------------------- */
export interface FunnelStat {
  label: string;
  sublabel: string;
  pct: number;
}

export const FUNNEL_STATS: FunnelStat[] = [
  { label: 'Explored', sublabel: 'Ideas and demos everyone is excited about', pct: 100 },
  { label: 'Piloted', sublabel: 'Prototypes that reach a real team', pct: 40 },
  { label: 'Deployed', sublabel: 'Use cases running in production', pct: 12 },
];

export type LayerIconName = 'cpu' | 'building' | 'gitBranch' | 'users';

export interface LayerCardData {
  icon: LayerIconName;
  title: string;
  hook: string;
  trap: string;
}

export const LAYER_CARDS: LayerCardData[] = [
  {
    icon: 'cpu',
    title: 'Technology',
    hook: 'Tools, models and data',
    trap: "Buying licences isn't adoption. Tools bolted onto old ways of working get quietly abandoned within months.",
  },
  {
    icon: 'building',
    title: 'Structure',
    hook: 'Ownership and decision rights',
    trap: 'Without clear ownership, every use case waits on a committee that never meets. Nobody is accountable for scaling.',
  },
  {
    icon: 'gitBranch',
    title: 'Process',
    hook: 'How work actually flows',
    trap: 'AI added to a broken process just produces the wrong answer faster. Workflows need redesign, not decoration.',
  },
  {
    icon: 'users',
    title: 'Skills & Behaviours',
    hook: 'What people do daily',
    trap: "If people don't trust it or can't use it, the pilot ends the day the project team moves on.",
  },
];

export interface FormulaTile {
  symbol: string;
  label: string;
  /** the S³ result tile gets the teal treatment */
  isResult?: boolean;
}

export const FORMULA_TILES: FormulaTile[] = [
  { symbol: 'Q', label: 'Quality of AI systems' },
  { symbol: 'O', label: 'Fit-for-purpose organisation' },
  { symbol: 'E', label: 'Engagement of your people' },
  { symbol: 'S³', label: 'Speed of sustainable success', isResult: true },
];

/* ---------------------------------------------------------------------------
   Section 02 — the method (5-stage stepper)
   --------------------------------------------------------------------------- */
export type StageIconName = 'stethoscope' | 'search' | 'flask' | 'gauge' | 'rocket';

/** which right-column visual a stage renders */
export type StageVisual = 'agenda' | 'converge' | 'loop' | 'matrix' | 'roadmap';

export interface AgendaQuestion {
  letter: string;
  label: string;
  question: string;
}

export interface MethodStage {
  id: string;
  n: number;
  title: string;
  icon: StageIconName;
  summary: string;
  bullets: string[];
  participants: string;
  output: string;
  visual: StageVisual;
  /** stage 1 only: the four leadership questions */
  agenda?: AgendaQuestion[];
}

export const METHOD_STAGES: MethodStage[] = [
  {
    id: 'diagnose',
    n: 1,
    title: 'Diagnose',
    icon: 'stethoscope',
    summary:
      'A focused session with your leadership team answers four questions before anything cascades to teams. No slideware, no jargon — decisions captured on a single page and signed off in the room.',
    bullets: [
      'One-to-one interviews and a diagnostic surface views privately, so the room moves straight to decisions',
      'Cross-sector benchmarks make the trade-offs visible',
      'Readiness results (if you ran the assessment) feed straight in',
    ],
    participants: 'Leadership team',
    output: 'A strategic brief, signed off in the room',
    visual: 'agenda',
    agenda: [
      { letter: 'A', label: 'Ambition', question: 'What is your three-year ambition, and where does AI sit in that story?' },
      { letter: 'F', label: 'Focus', question: 'Where would AI success matter most — which services, clients or pain points?' },
      { letter: 'C', label: 'Change', question: 'What are you genuinely willing to change in how you price, staff or deliver?' },
      { letter: 'S', label: 'Success', question: 'A year from now, what outcome would tell you this was worth it?' },
    ],
  },
  {
    id: 'define',
    n: 2,
    title: 'Define',
    icon: 'search',
    summary:
      'Use cases come from two directions at once: bottom-up from the people who do the work, and top-down from mapping how work actually flows. The goal is not a wish list — it is a portfolio worth scoring.',
    bullets: [
      'Champions capture ideas from their own teams — the people closest to the friction',
      'We decompose each process by verifiability and find the highest-value steps where AI meaningfully helps',
      'Every use case gets a one-page charter: the problem, the user, the data it needs',
    ],
    participants: 'AI champions + process owners',
    output: 'A long list of chartered use cases',
    visual: 'converge',
  },
  {
    id: 'prototype',
    n: 3,
    title: 'Prototype',
    icon: 'flask',
    summary:
      'Hands-on clinics where champions build working prototypes with real tools on real work — not slide mock-ups. Subject-matter experts sit alongside builders to pressure-test outputs as they emerge.',
    bullets: [
      'A safe environment: real data patterns, no production risk',
      'Working sessions with the tools your teams will actually use',
      'Weak use cases fail fast and cheap — that is the point of a sandbox',
    ],
    participants: 'AI champions + subject-matter experts',
    output: 'Working prototypes, tested against real work',
    visual: 'loop',
  },
  {
    id: 'score',
    n: 4,
    title: 'Score',
    icon: 'gauge',
    summary:
      'Every prototype is scored against a rubric your leadership defined — business impact, feasibility, adoption readiness, data readiness. The portfolio lands on one matrix everyone can argue with.',
    bullets: [
      'Criteria are weighted to what matters to your business, not a generic checklist',
      'Scoring is transparent — champions see why their use case landed where it did',
      'The matrix turns opinion battles into a sequencing conversation',
    ],
    participants: 'Steering committee + function leads',
    output: 'A prioritised portfolio on a single matrix',
    visual: 'matrix',
  },
  {
    id: 'scale',
    n: 5,
    title: 'Scale',
    icon: 'rocket',
    summary:
      'The winners get a route to production: quick wins ship first, scale opportunities get owners and dependencies, longer-term bets get a decision date. Governance gates keep the scaling responsible.',
    bullets: [
      'Each use case moves pilot → production with clear owners and milestones',
      'Compliance, risk and ethical review are built into the gates, not bolted on after',
      'The blueprint hands your team everything needed to keep going without us',
    ],
    participants: 'Steering committee + delivery teams',
    output: 'The Transformation Blueprint',
    visual: 'roadmap',
  },
];

/* ---------------------------------------------------------------------------
   Section 05 — governance tiers
   --------------------------------------------------------------------------- */
export type TierIconName = 'landmark' | 'sliders' | 'flag';

export interface GovernanceTier {
  icon: TierIconName;
  title: string;
  mandate: string;
  /** max-width class controlling the narrowing stack */
  widthClass: string;
}

export const GOVERNANCE_TIERS: GovernanceTier[] = [
  {
    icon: 'landmark',
    title: 'Steering Committee',
    mandate: 'Sets the ambition and the success criteria. Decides what scaling means and owns the go / no-go calls.',
    widthClass: 'max-w-md',
  },
  {
    icon: 'sliders',
    title: 'Function Leads',
    mandate: 'Define the scoring framework, so use cases are judged on what actually matters to the business.',
    widthClass: 'max-w-2xl',
  },
  {
    icon: 'flag',
    title: 'AI Champions',
    mandate: 'Hands-on builders inside each team. They prototype, gather feedback and carry adoption with their peers.',
    widthClass: 'max-w-4xl',
  },
];

/* ---------------------------------------------------------------------------
   Section 04 (continued) — the delivery partners on the external side of the
   governance chart, and the shared outcome everything converges on
   --------------------------------------------------------------------------- */
export interface SandboxPartner {
  name: string;
  logo: string;
  /** rendered logo height in px, tuned per asset so the two wordmarks feel balanced */
  logoHeight: number;
  role: string;
  blurb: string;
}

export const SANDBOX_PARTNERS: SandboxPartner[] = [
  {
    name: 'OXYGY',
    logo: '/logos/oxygy-logo-darkgray-teal.png',
    logoHeight: 22,
    role: 'People, process and adoption',
    blurb:
      'Designs the sandbox, coaches the champions, runs the scoring and carries adoption — so the technology actually changes how work gets done.',
  },
  {
    name: 'Bird & Bird',
    logo: '/logos/birdandbird.svg',
    logoHeight: 19,
    role: 'Legal-grade AI governance',
    blurb:
      'International law firm specialised in AI and technology regulation. Every use case that scales has been through legal-grade review — not a checkbox exercise.',
  },
];

export const COMPLIANCE_CHIPS: string[] = ['EU AI Act', 'Data protection & DPIA', 'NIS2', 'Governance gates'];

export const GOVERNANCE_OUTCOME =
  'Everything converges on one deliverable: the Transformation Blueprint — your prioritised portfolio, governance model and route to production, owned by your team after we leave.';

/* ---------------------------------------------------------------------------
   Section 08 — proof band
   --------------------------------------------------------------------------- */
export interface ProofStat {
  /** the number the counter animates to */
  countTo: number;
  prefix?: string;
  suffix?: string;
  caption: string;
}

export const PROOF_STATS: ProofStat[] = [
  { countTo: 15, suffix: '+', caption: 'use cases surfaced in a typical sandbox' },
  { countTo: 4, prefix: '2–', caption: 'taken to pilot — the right ones, chosen on evidence' },
  { countTo: 12, prefix: '8–', suffix: ' wks', caption: 'from kickoff to a scaling decision' },
];

export const PROOF_FOOTNOTE = 'Illustrative figures from typical engagements.';

/* ===========================================================================
   USE CASE PRIORITISER — types, presets and scoring math
   =========================================================================== */

export type FunctionId = 'hr' | 'legal' | 'finance' | 'sales' | 'operations';
export type CriterionId = 'impact' | 'feasibility' | 'adoption' | 'data';
export type Scores = Record<CriterionId, number>; // 1–5 integers
export type QuadrantId = 'quick-wins' | 'scale-opportunities' | 'longer-term-bets' | 'deprioritise';

export interface Criterion {
  id: CriterionId;
  label: string;
  hint: string;
  weight: number;
}

export const CRITERIA: Criterion[] = [
  { id: 'impact', label: 'Business impact', hint: 'Value if it works at scale', weight: 0.35 },
  { id: 'feasibility', label: 'Feasibility', hint: 'Buildable in weeks, not years', weight: 0.3 },
  { id: 'adoption', label: 'Adoption readiness', hint: 'Will the team actually use it', weight: 0.2 },
  { id: 'data', label: 'Data readiness', hint: 'Is the data accessible and reliable', weight: 0.15 },
];

/* ---- organisational priorities: each archetype re-weights the scoring ---- */

export type PriorityId = 'balanced' | 'fast-proof' | 'big-swings' | 'people-first';
export type PriorityIconName = 'pie' | 'zap' | 'mountain' | 'heart';

export interface PriorityProfile {
  id: PriorityId;
  label: string;
  archetype: string;
  description: string;
  icon: PriorityIconName;
  weights: Record<CriterionId, number>;
}

export const PRIORITY_PROFILES: PriorityProfile[] = [
  {
    id: 'fast-proof',
    label: 'Prove value fast',
    archetype: 'The Pragmatist',
    description: 'You need visible wins this quarter to earn the mandate for more.',
    icon: 'zap',
    weights: { impact: 0.25, feasibility: 0.4, adoption: 0.15, data: 0.2 },
  },
  {
    id: 'big-swings',
    label: 'Move the needle',
    archetype: 'The Transformer',
    description: 'Incremental savings bore your board. You want use cases that change the P&L.',
    icon: 'mountain',
    weights: { impact: 0.5, feasibility: 0.2, adoption: 0.15, data: 0.15 },
  },
  {
    id: 'people-first',
    label: 'Bring people along',
    archetype: 'The Adoption-led',
    description: "You've seen tools die unused. Whatever ships, your teams must actually want it.",
    icon: 'heart',
    weights: { impact: 0.25, feasibility: 0.2, adoption: 0.4, data: 0.15 },
  },
  {
    id: 'balanced',
    label: 'Balanced portfolio',
    archetype: 'The Portfolio Builder',
    description: 'Impact-led, but nothing makes the list unless it can actually ship.',
    icon: 'pie',
    weights: { impact: 0.35, feasibility: 0.3, adoption: 0.2, data: 0.15 },
  },
];

export type FunctionIconName = 'usersRound' | 'scale' | 'calculator' | 'trendingUp' | 'settings';

export interface FunctionOption {
  id: FunctionId;
  label: string;
  icon: FunctionIconName;
}

export const FUNCTIONS: FunctionOption[] = [
  { id: 'hr', label: 'HR', icon: 'usersRound' },
  { id: 'legal', label: 'Legal', icon: 'scale' },
  { id: 'finance', label: 'Finance', icon: 'calculator' },
  { id: 'sales', label: 'Sales', icon: 'trendingUp' },
  { id: 'operations', label: 'Operations', icon: 'settings' },
];

export interface UseCasePreset {
  id: string;
  title: string;
  blurb: string;
  defaultScores: Scores;
}

const s = (impact: number, feasibility: number, adoption: number, data: number): Scores => ({
  impact,
  feasibility,
  adoption,
  data,
});

/* 6 presets per function; defaults chosen to scatter across all four quadrants
   so every plotted portfolio looks interesting out of the box. */
export const PRESETS: Record<FunctionId, UseCasePreset[]> = {
  hr: [
    { id: 'hr-cv', title: 'CV screening triage', blurb: 'Rank inbound applications against the role profile', defaultScores: s(4, 4, 3, 3) },
    { id: 'hr-policy', title: 'Policy Q&A assistant', blurb: 'Instant answers from your HR policy library', defaultScores: s(3, 5, 4, 4) },
    { id: 'hr-onboarding', title: 'Onboarding content generator', blurb: 'Role-specific onboarding plans and materials', defaultScores: s(3, 4, 4, 3) },
    { id: 'hr-exit', title: 'Exit-interview theme mining', blurb: 'Surface patterns across exit conversations', defaultScores: s(3, 3, 3, 2) },
    { id: 'hr-planning', title: 'Workforce-planning scenarios', blurb: 'Model headcount scenarios against the strategy', defaultScores: s(5, 2, 3, 2) },
    { id: 'hr-learning', title: 'Learning-path personalisation', blurb: 'Tailor development plans to each role and gap', defaultScores: s(4, 3, 4, 3) },
  ],
  legal: [
    { id: 'lg-clause', title: 'Contract clause extraction', blurb: 'Pull key terms and obligations from contracts', defaultScores: s(4, 4, 3, 4) },
    { id: 'lg-nda', title: 'NDA triage', blurb: 'First-pass review and routing of standard NDAs', defaultScores: s(3, 5, 4, 4) },
    { id: 'lg-horizon', title: 'Regulatory horizon scanning', blurb: 'Track upcoming regulation mapped to your practice', defaultScores: s(4, 3, 3, 3) },
    { id: 'lg-ediscovery', title: 'eDiscovery summarisation', blurb: 'Digest large document sets for review', defaultScores: s(5, 2, 2, 3) },
    { id: 'lg-intake', title: 'Matter-intake routing', blurb: 'Classify and route new matters to the right team', defaultScores: s(3, 4, 3, 3) },
    { id: 'lg-drafts', title: 'Template first-drafts', blurb: 'Generate first drafts from your own precedents', defaultScores: s(3, 4, 5, 4) },
  ],
  finance: [
    { id: 'fi-invoice', title: 'Invoice-exception handling', blurb: 'Triage mismatches before they hit the queue', defaultScores: s(4, 4, 3, 4) },
    { id: 'fi-variance', title: 'Variance commentary', blurb: 'Draft month-end commentary from the numbers', defaultScores: s(4, 4, 4, 4) },
    { id: 'fi-cashflow', title: 'Cash-flow forecasting', blurb: 'Scenario-based forward view of liquidity', defaultScores: s(5, 2, 3, 2) },
    { id: 'fi-expense', title: 'Expense-anomaly detection', blurb: 'Flag out-of-policy spend automatically', defaultScores: s(3, 4, 3, 4) },
    { id: 'fi-boardpack', title: 'Board-pack drafting', blurb: 'Assemble recurring reporting packs faster', defaultScores: s(3, 3, 4, 3) },
    { id: 'fi-spend', title: 'Spend classification', blurb: 'Clean and categorise spend data continuously', defaultScores: s(3, 4, 3, 3) },
  ],
  sales: [
    { id: 'sa-lead', title: 'Lead scoring', blurb: 'Rank inbound leads by likelihood to convert', defaultScores: s(4, 3, 3, 3) },
    { id: 'sa-rfp', title: 'RFP first drafts', blurb: 'Draft proposal responses from your best past bids', defaultScores: s(4, 4, 4, 3) },
    { id: 'sa-calls', title: 'Call summaries → CRM', blurb: 'Auto-log meeting notes and next steps', defaultScores: s(4, 5, 4, 4) },
    { id: 'sa-research', title: 'Account-research briefs', blurb: 'One-page brief before every key meeting', defaultScores: s(3, 4, 4, 3) },
    { id: 'sa-churn', title: 'Churn-risk alerts', blurb: 'Early warning on accounts going quiet', defaultScores: s(5, 2, 3, 2) },
    { id: 'sa-pricing', title: 'Pricing guidance', blurb: 'Deal-level price recommendations', defaultScores: s(5, 2, 2, 2) },
  ],
  operations: [
    { id: 'op-sop', title: 'SOP assistant', blurb: 'Answers from your procedures, on the floor', defaultScores: s(3, 5, 4, 4) },
    { id: 'op-demand', title: 'Demand forecasting', blurb: 'Sharper short-horizon demand signals', defaultScores: s(5, 3, 3, 2) },
    { id: 'op-maintenance', title: 'Maintenance-log triage', blurb: 'Prioritise faults from technician notes', defaultScores: s(4, 4, 3, 3) },
    { id: 'op-quality', title: 'Quality-inspection reports', blurb: 'Draft inspection reports from checklists', defaultScores: s(4, 3, 3, 3) },
    { id: 'op-supplier', title: 'Supplier-risk monitoring', blurb: 'Watch the news and data for supplier trouble', defaultScores: s(4, 2, 3, 2) },
    { id: 'op-handover', title: 'Shift-handover summaries', blurb: 'Consistent handover notes between shifts', defaultScores: s(3, 4, 4, 3) },
  ],
};

/* ---- scoring math (pure, exported so it stays unit-inspectable) ---- */

/** Y axis: impact alone */
export const impactAxis = (sc: Scores): number => sc.impact;

/** X axis: "can we actually do it" — feasibility blended with data readiness */
export const easeAxis = (sc: Scores): number => (sc.feasibility + sc.data) / 2;

/** weighted composite used for sequencing; weights default to the balanced profile */
export const composite = (sc: Scores, weights?: Record<CriterionId, number>): number =>
  CRITERIA.reduce((t, c) => t + sc[c.id] * (weights ? weights[c.id] : c.weight), 0);

/** quadrant assignment: Y strict (impact must clear the bar), X inclusive */
export const quadrantOf = (sc: Scores): QuadrantId => {
  const hiY = impactAxis(sc) > 3;
  const hiX = easeAxis(sc) >= 3;
  return hiY ? (hiX ? 'quick-wins' : 'longer-term-bets') : hiX ? 'scale-opportunities' : 'deprioritise';
};

export interface QuadrantInfo {
  label: string;
  color: string;
  advice: string;
}

export const QUADRANTS: Record<QuadrantId, QuadrantInfo> = {
  'quick-wins': {
    label: 'Quick Wins',
    color: SBX_TEAL,
    advice: 'High impact and buildable now — pilot this first and let it fund the rest.',
  },
  'scale-opportunities': {
    label: 'Scale Opportunities',
    color: '#C4A934',
    advice: 'Easy to build with moderate impact — worth doing once quick wins prove the model.',
  },
  'longer-term-bets': {
    label: 'Longer-term Bets',
    color: SBX_ACCENT,
    advice: 'The prize is big but the path is hard — invest in the groundwork before committing.',
  },
  deprioritise: {
    label: 'Park for now',
    color: '#A0AEC0',
    advice: 'Low impact and hard to build — park it and revisit when conditions change.',
  },
};

/** order quadrants appear in the sequencing summary */
export const QUADRANT_SEQUENCE: QuadrantId[] = ['quick-wins', 'scale-opportunities', 'longer-term-bets'];
