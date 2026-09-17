// Scoring + mock output for the AI Change & Innovation Readiness results dashboard.
//
// `computeAssessmentResult` is a stand-in for the real scoring engine, built to the axis/category
// rules given in the source assessment JSON (see innovationReadinessQuestions.ts header for the
// two points that JSON itself left ambiguous — the governance subset and the N/A-exclusion rule
// are both handled here). `AssessmentResult` is the shape that engine is expected to eventually
// produce — the dashboard only ever reads this shape, so swapping the mock for real scoring later
// is a data-source change, not a UI rewrite.
//
// Still a guess: the 3.0 (scale midpoint) cut line used to place a score on the "clear/unclear" or
// "conventional/innovative" side of each axis. The source JSON specifies the averaging method but
// not a quadrant threshold.

import {
  QUESTION_BANK,
  GOVERNANCE_SUBSET_IDS,
  SurveyCategoryId,
  SURVEY_CATEGORY_LABELS,
  AnswerValue,
  SurveyAnswers,
} from './innovationReadinessQuestions';

export type { AnswerValue, SurveyAnswers };

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
  /** 1–5 average across that category's scored questions. N/A and unscored questions excluded. */
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
    strategicContext: number;
    workEnvironment: number;
  };
  /** Every scored category (demographics excluded — it isn't a score). */
  categoryScores: CategoryScore[];
  quadrant: ProfileId;
  /** Static placeholder copy — will be generated per-response by an agent in a later pass. */
  recommendations: string[];
}

/** Flattens a single answer into 0+ numeric (1–5) values. N/A (null), strings and undefined
 * contribute nothing — this is the "Not Applicable responses excluded" rule from the source JSON. */
function numericValuesOf(value: AnswerValue): number[] {
  if (typeof value === 'number') return [value];
  if (value && typeof value === 'object') {
    return Object.values(value).filter((v): v is number => typeof v === 'number');
  }
  return [];
}

/** Pools every scored answer for a set of question ids into one average (equal-weighted — the
 * source JSON says "weighted average per category" but specifies no per-question weights). */
function pooledMean(ids: string[], answers: SurveyAnswers): number {
  const values = ids.flatMap((id) => numericValuesOf(answers[id]));
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

const scoredIdsFor = (category: SurveyCategoryId): string[] =>
  QUESTION_BANK.filter((q) => q.category === category && q.scored).map((q) => q.id);

export function computeCategoryScores(answers: SurveyAnswers): CategoryScore[] {
  const categories: SurveyCategoryId[] = ['aiLiteracyPerceptions', 'organisationalMotivation', 'managementPractices', 'resourcesTeamwork'];
  return categories.map((category) => ({
    category,
    label: SURVEY_CATEGORY_LABELS[category],
    score: pooledMean(scoredIdsFor(category), answers),
  }));
}

export function computeAxisScores(answers: SurveyAnswers): { strategicContext: number; workEnvironment: number } {
  const strategicContext = pooledMean([...scoredIdsFor('organisationalMotivation'), ...GOVERNANCE_SUBSET_IDS], answers);
  const workEnvironment = pooledMean([...scoredIdsFor('managementPractices'), ...scoredIdsFor('resourcesTeamwork')], answers);
  return { strategicContext, workEnvironment };
}

/** Reads the four demographic answers straight out of the survey state, so a respondent's own
 * edits during a demo walkthrough are reflected on the results dashboard. */
function respondentFromAnswers(answers: SurveyAnswers): AssessmentRespondent {
  const asString = (value: AnswerValue, fallback: string) => (typeof value === 'string' && value.trim() ? value : fallback);
  return {
    roleLevel: asString(answers.demo_role_level, 'Not specified'),
    department: asString(answers.demo_department, 'Not specified'),
    tenure: asString(answers.demo_tenure, 'Not specified'),
    location: asString(answers.demo_location, 'Not specified'),
  };
}

export interface DemoPersonaInput {
  id: string;
  /** Label shown on the demo pill. */
  personaLabel: string;
  /** Pre-filled answers the survey form loads when this pill is clicked — editable before submit. */
  answers: SurveyAnswers;
  recommendations: string[];
}

export function computeAssessmentResult(input: {
  id: string;
  personaLabel: string;
  answers: SurveyAnswers;
  recommendations: string[];
}): AssessmentResult {
  const axisScores = computeAxisScores(input.answers);
  return {
    id: input.id,
    personaLabel: input.personaLabel,
    respondent: respondentFromAnswers(input.answers),
    axisScores,
    categoryScores: computeCategoryScores(input.answers),
    quadrant: quadrantForScores(axisScores.strategicContext, axisScores.workEnvironment),
    recommendations: input.recommendations,
  };
}

/**
 * Demo personas. Each entry here becomes one pill in the UI automatically — clicking it loads
 * these answers into the survey so they can be clicked through (and edited) before landing on the
 * results dashboard. Add a new persona (e.g. "Junior AI Skeptic", "Senior Leadership Champion") by
 * adding another entry below; no dashboard or pill-row changes needed.
 */
export const DEMO_PERSONA_INPUTS: DemoPersonaInput[] = [
  {
    id: 'mid-level-ai-enthusiast',
    personaLabel: 'Mid-Level AI Enthusiast',
    answers: {
      demo_role_level: 'Team lead / supervisor',
      demo_department: 'Technology / IT',
      demo_tenure: '3–5 years',
      demo_location: 'London, UK',

      lit_uses_genai: 5,
      lit_prompting: 5,
      lit_tool_fit: 4,
      lit_seeks_tools: 5,
      perc_job_concern: 2,
      perc_keep_up_skills: 4,
      perc_effectiveness_belief: 5,
      perc_routine_tasks: 3,
      perc_judgment_complexity: 4,

      om_primary_goal: "I don't know",
      om_top_mgmt_vision: 2,
      om_manager_communication: 2,
      om_vision_shared: 2,
      om_priorities_communicated: 2,
      om_risk_management: 2,

      mp_communication_flow: 3,
      mp_experimentation_space: 2,
      mp_risk_balance: 3,
      mp_governance_recognition: 2,
      mp_networks: 3,

      rt_time: 4,
      rt_right_people: 3,
      rt_budget: 3,
      rt_upskilling_opportunities: 3,
      rt_upskilling_quality: 3,
      rt_team_diversity: 4,
      rt_trust: 4,
      rt_team_idea_generation: 4,
      rt_tool_satisfaction: { ChatGPT: 5, 'Microsoft Copilot': 3, Claude: 4, 'Other internal tool': null },
    },
    recommendations: [
      "Ask your manager or leadership for visibility into the broader AI strategy — you're building real skill without a clear sense of where it should point.",
      'Find or start a lightweight way to share what you\'re building with other early adopters nearby — strong individual skill stays trapped without a channel to spread it.',
      "Push for a small amount of protected, sanctioned time to experiment, rather than relying on personal initiative alone — that's what turns individual momentum into something the organisation can point at and scale.",
    ],
  },
];

export function getDemoPersonaInput(id: string): DemoPersonaInput | undefined {
  return DEMO_PERSONA_INPUTS.find((p) => p.id === id);
}
