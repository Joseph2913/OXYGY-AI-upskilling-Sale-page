// Question bank for the AI Change & Innovation Readiness Assessment (individual survey).
//
// PLACEHOLDER CONTENT: no question-bank file was attached when this was built, so exact wording,
// response options and the demographics/location list below are best-guess drafts modelled on the
// org-level survey already in `components/readinessData.ts`. Swap this file's contents for the
// real question bank when it's available — nothing else needs to change, since SurveyForm and
// scoring both key off `category` + `type`, not specific question ids.

export type QuestionType = 'likert5' | 'single-select' | 'open-text';

/** The five screens of the survey, in display order. */
export type SurveyCategoryId =
  | 'demographics'
  | 'aiLiteracy'
  | 'orgMotivation'
  | 'managementPractices'
  | 'resourcesTeamwork';

export const SURVEY_CATEGORY_ORDER: SurveyCategoryId[] = [
  'demographics',
  'aiLiteracy',
  'orgMotivation',
  'managementPractices',
  'resourcesTeamwork',
];

export const SURVEY_CATEGORY_LABELS: Record<SurveyCategoryId, string> = {
  demographics: 'Demographics',
  aiLiteracy: 'AI Literacy & Perceptions',
  orgMotivation: 'Organisational Motivation',
  managementPractices: 'Management Practices',
  resourcesTeamwork: 'Resources & Teamwork',
};

export interface SurveyQuestion {
  id: string;
  category: SurveyCategoryId;
  type: QuestionType;
  label: string;
  /** single-select only */
  options?: string[];
  /** likert5 only — lets "Not Applicable" sit alongside the 1–5 scale without skewing it */
  allowNotApplicable?: boolean;
  /** likert5 only — when true, a "5" is a *negative* signal (e.g. a concern statement) and is
   * flipped (6 - value) before it feeds a category average. */
  reverseScored?: boolean;
  /** Free-text questions are captured for display only — never scored. */
  optional?: boolean;
}

export const LIKERT_LABELS = ['Strongly disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Strongly agree'];

export const QUESTION_BANK: SurveyQuestion[] = [
  // ---------------- Demographics (not scored — used for cross-cuts only) ----------------
  { id: 'D1', category: 'demographics', type: 'single-select', label: 'Role level', options: ['Individual contributor', 'Team lead / supervisor', 'Direct people manager', 'Senior leadership / C-suite'] },
  { id: 'D2', category: 'demographics', type: 'single-select', label: 'Department / function', options: ['HR', 'Finance', 'Operations', 'Technology / IT', 'Sales & Marketing', 'Legal & Compliance', 'Strategy', 'Other'] },
  { id: 'D3', category: 'demographics', type: 'single-select', label: 'Tenure at this organisation', options: ['<1 yr', '1–3 yrs', '3–5 yrs', '5–10 yrs', '10+ yrs'] },
  // GUESS: no location taxonomy was specified — using broad regions as a placeholder.
  { id: 'D4', category: 'demographics', type: 'single-select', label: 'Location', options: ['North America', 'EMEA', 'APAC', 'LATAM'] },

  // ---------------- AI Literacy & Perceptions (personal signal, not axis-scored) ----------------
  { id: 'L1', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, label: 'I regularly use AI tools in my day-to-day work.' },
  { id: 'L2', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, label: 'I actively seek out and try new AI features and tools as they become available.' },
  { id: 'L3', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, label: 'I can write effective prompts and give AI tools the right context to get useful output.' },
  { id: 'L4', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, label: 'I believe AI will make my work more effective.' },
  { id: 'L5', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, reverseScored: true, label: 'I am concerned AI will negatively affect my role.' },
  { id: 'L6', category: 'aiLiteracy', type: 'likert5', allowNotApplicable: true, label: 'I feel I have the right skills to keep up with how fast AI is developing.' },

  // ---------------- Organisational Motivation (→ Strategic Context axis) ----------------
  { id: 'M1', category: 'orgMotivation', type: 'likert5', allowNotApplicable: true, label: "AI's expected contribution to our business priorities is clearly articulated." },
  { id: 'M2', category: 'orgMotivation', type: 'likert5', allowNotApplicable: true, label: 'Leadership has a clear AI vision and communicates it consistently at all levels.' },
  { id: 'M3', category: 'orgMotivation', type: 'likert5', allowNotApplicable: true, label: "I understand why AI matters to my organisation's strategy, not just that it does." },
  { id: 'M4', category: 'orgMotivation', type: 'likert5', allowNotApplicable: true, label: 'Our AI strategy feels connected to my day-to-day work, not just a leadership talking point.' },
  { id: 'M5', category: 'orgMotivation', type: 'open-text', optional: true, label: 'In your own words — what do you think AI is for in this organisation?' },

  // ---------------- Management Practices (→ Work Environment axis, "practices" half) ----------------
  { id: 'P1', category: 'managementPractices', type: 'likert5', allowNotApplicable: true, label: 'New ideas involving AI are evaluated fairly and can progress without being killed by bureaucracy.' },
  { id: 'P2', category: 'managementPractices', type: 'likert5', allowNotApplicable: true, label: "My manager actively encourages me to experiment with AI, even if it doesn't immediately succeed." },
  { id: 'P3', category: 'managementPractices', type: 'likert5', allowNotApplicable: true, label: "People who try new AI approaches are recognised for it, not just those who deliver 'safe' results." },
  { id: 'P4', category: 'managementPractices', type: 'likert5', allowNotApplicable: true, label: "Risk-taking with AI is treated as reasonable, not penalised when it doesn't work out." },

  // ---------------- Resources & Teamwork (→ Work Environment axis, "resources" half) ----------------
  { id: 'R1', category: 'resourcesTeamwork', type: 'likert5', allowNotApplicable: true, label: 'I have a dedicated space or time set aside to experiment with AI ideas (a sandbox).' },
  { id: 'R2', category: 'resourcesTeamwork', type: 'likert5', allowNotApplicable: true, label: 'I have enough time and budget to put AI into practice, not just learn about it.' },
  { id: 'R3', category: 'resourcesTeamwork', type: 'likert5', allowNotApplicable: true, label: 'My team is diverse, high-trust, and actively supportive of AI-related ideas.' },
  { id: 'R4', category: 'resourcesTeamwork', type: 'likert5', allowNotApplicable: true, label: 'Information and AI ideas flow openly between my team and others in the organisation.' },
];

export const questionsForCategory = (category: SurveyCategoryId): SurveyQuestion[] =>
  QUESTION_BANK.filter((q) => q.category === category);
