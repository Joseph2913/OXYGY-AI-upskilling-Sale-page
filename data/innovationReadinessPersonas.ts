// Mock output for the AI Change & Innovation Readiness results dashboard.
//
// This is a stand-in for the real scoring engine. `AssessmentResult` is the shape that engine is
// expected to eventually produce — the dashboard only ever reads this shape, so swapping the mock
// data source for a real one later is a data-source change, not a UI rewrite.
//
// GUESS flagged inline below: category → axis weighting, the 3.0 quadrant threshold, and how an
// individual's answers roll up into org-style axis placement are not finalised. Treat the numbers
// here as illustrative, not calibrated.

import type { SurveyCategoryId } from './innovationReadinessQuestions';

/** Reuses the same four quadrant ids/names/colours as the org-level assessment
 * (see `components/readinessData.ts`) so both tools describe the same matrix. */
export type ProfileId = 'sitting-duck' | 'disconnected-antenna' | 'island-of-creativity' | 'systematic-innovator';

export const QUADRANT_INFO: Record<ProfileId, { name: string; tag: string; color: string }> = {
  'sitting-duck': { name: 'Sitting Duck', tag: 'Unclear strategy · Conventional environment', color: '#2D3748' },
  'disconnected-antenna': { name: 'Disconnected Antenna', tag: 'Defined strategy · Conventional environment', color: '#4FD1C5' },
  'island-of-creativity': { name: 'Island of Creativity', tag: 'Unclear strategy · Innovative environment', color: '#2B4C7E' },
  'systematic-innovator': { name: 'Systematic AI Innovator', tag: 'Defined strategy · Innovative environment', color: '#D4A017' },
};

/** GUESS: axis midpoint (3 on a 1–5 scale) used as the "clear/innovative" cut line. */
const AXIS_THRESHOLD = 3;

export function quadrantForScores(strategicContext: number, workEnvironment: number): ProfileId {
  const strategicClear = strategicContext >= AXIS_THRESHOLD;
  const workInnovative = workEnvironment >= AXIS_THRESHOLD;
  if (strategicClear && workInnovative) return 'systematic-innovator';
  if (strategicClear && !workInnovative) return 'disconnected-antenna';
  if (!strategicClear && workInnovative) return 'island-of-creativity';
  return 'sitting-duck';
}

export interface CategoryScore {
  category: SurveyCategoryId;
  label: string;
  /** 1–5 average across that category's likert questions, N/A and open-text excluded. */
  score: number;
}

export interface AssessmentRespondent {
  roleLevel: string;
  department: string;
  tenure: string;
  location: string;
}

export interface AssessmentResult {
  id: string;
  /** Label shown on the demo pill. */
  personaLabel: string;
  respondent: AssessmentRespondent;
  axisScores: {
    /** GUESS: = Organisational Motivation category average. */
    strategicContext: number;
    /** GUESS: = mean(Management Practices, Resources & Teamwork) category averages. */
    workEnvironment: number;
  };
  /** Every scored category (demographics excluded — it isn't a score). */
  categoryScores: CategoryScore[];
  quadrant: ProfileId;
  /** Static placeholder copy — will be generated per-response by an agent in a later pass. */
  recommendations: string[];
}

/**
 * Demo personas. Each entry here becomes one pill in the UI automatically — add a new
 * `AssessmentResult` (e.g. "Junior AI Skeptic", "Senior Leadership Champion") and it will
 * render without any changes to the dashboard or pill-row components.
 */
export const DEMO_PERSONAS: AssessmentResult[] = [
  {
    id: 'mid-level-ai-enthusiast',
    personaLabel: 'Mid-Level AI Enthusiast',
    respondent: {
      roleLevel: 'Team lead / supervisor',
      department: 'Technology / IT',
      tenure: '1–3 yrs',
      location: 'EMEA',
    },
    axisScores: {
      strategicContext: 2.0,
      workEnvironment: 3.0,
    },
    categoryScores: [
      { category: 'aiLiteracy', label: 'AI Literacy & Perceptions', score: 4.3 },
      { category: 'orgMotivation', label: 'Organisational Motivation', score: 2.0 },
      { category: 'managementPractices', label: 'Management Practices', score: 2.5 },
      { category: 'resourcesTeamwork', label: 'Resources & Teamwork', score: 3.5 },
    ],
    quadrant: 'island-of-creativity',
    recommendations: [
      'Ask your manager or leadership for visibility into the broader AI strategy — you\'re building real skill without a clear sense of where it should point.',
      'Find or start a lightweight way to share what you\'re building with other early adopters nearby — strong individual skill stays trapped without a channel to spread it.',
      'Push for a small amount of protected, sanctioned time to experiment, rather than relying on personal initiative alone — that\'s what turns individual momentum into something the organisation can point at and scale.',
    ],
  },
];

export function getDemoPersona(id: string): AssessmentResult | undefined {
  return DEMO_PERSONAS.find((p) => p.id === id);
}
