// Synthetic multi-respondent queue for the "Org View" tab. Org View only shows an aggregated
// dashboard once every respondent in this queue has been clicked through (pre-filled, editable,
// same as the individual demo flow) and submitted — it isn't a static mock dashboard, it's built
// from whatever answers actually got submitted during the walkthrough. Deliberately spans a
// spread of departments, role levels, tenures and quadrant placements so filtering by any
// demographic cut produces a visibly different picture; a real dataset (the deck mentions 50-100
// respondents per assessment) would obviously be far larger and not this evenly distributed.

import { QUESTION_BANK, SurveyCategoryId, SurveyAnswers } from './innovationReadinessQuestions';
import { DemoPersonaInput } from './innovationReadinessPersonas';

/** The four scored categories — demographics is excluded since it isn't a score. */
type ScoredCategoryId = Exclude<SurveyCategoryId, 'demographics'>;

interface SyntheticRespondentSpec {
  id: string;
  personaLabel: string;
  roleLevel: string;
  department: string;
  tenure: string;
  location: string;
  /** Flat 1–5 score applied to every scored question in that category — a simplification, since
   * this is synthetic data standing in for real per-question variation. */
  scores: Record<ScoredCategoryId, number>;
}

const scoredIdsFor = (category: SurveyCategoryId): string[] =>
  QUESTION_BANK.filter((q) => q.category === category && q.scored).map((q) => q.id);

function flatAnswers(spec: SyntheticRespondentSpec): SurveyAnswers {
  const answers: SurveyAnswers = {
    demo_role_level: spec.roleLevel,
    demo_department: spec.department,
    demo_tenure: spec.tenure,
    demo_location: spec.location,
  };
  (Object.keys(spec.scores) as ScoredCategoryId[]).forEach((category) => {
    const score = spec.scores[category];
    scoredIdsFor(category).forEach((id) => {
      const question = QUESTION_BANK.find((q) => q.id === id);
      answers[id] = question?.type === 'likert_multi' ? { Primary: score } : score;
    });
  });
  return answers;
}

const SPECS: SyntheticRespondentSpec[] = [
  {
    id: 'org-mock-01',
    personaLabel: 'IC, Technology/IT, EMEA',
    roleLevel: 'Individual contributor',
    department: 'Technology / IT',
    tenure: '1–3 years',
    location: 'EMEA',
    scores: { aiLiteracyPerceptions: 4.5, organisationalMotivation: 2, managementPractices: 2.5, resourcesTeamwork: 3.5 },
  },
  {
    id: 'org-mock-02',
    personaLabel: 'Middle mgmt, Operations, North America',
    roleLevel: 'Middle management',
    department: 'Operations',
    tenure: '5–10 years',
    location: 'North America',
    scores: { aiLiteracyPerceptions: 2, organisationalMotivation: 1.5, managementPractices: 2, resourcesTeamwork: 2 },
  },
  {
    id: 'org-mock-03',
    personaLabel: 'Senior leadership, Strategy, North America',
    roleLevel: 'Senior leadership / C-suite',
    department: 'Strategy',
    tenure: 'More than 10 years',
    location: 'North America',
    scores: { aiLiteracyPerceptions: 3.5, organisationalMotivation: 4.5, managementPractices: 2.5, resourcesTeamwork: 2.5 },
  },
  {
    id: 'org-mock-04',
    personaLabel: 'Team lead, Technology/IT, APAC',
    roleLevel: 'Team lead / supervisor',
    department: 'Technology / IT',
    tenure: '3–5 years',
    location: 'APAC',
    scores: { aiLiteracyPerceptions: 4.5, organisationalMotivation: 4, managementPractices: 4, resourcesTeamwork: 4.5 },
  },
  {
    id: 'org-mock-05',
    personaLabel: 'IC, Sales & Marketing, EMEA',
    roleLevel: 'Individual contributor',
    department: 'Sales & Marketing',
    tenure: 'Less than 1 year',
    location: 'EMEA',
    scores: { aiLiteracyPerceptions: 2, organisationalMotivation: 1.5, managementPractices: 2, resourcesTeamwork: 2 },
  },
  {
    id: 'org-mock-06',
    personaLabel: 'Middle mgmt, Finance, EMEA',
    roleLevel: 'Middle management',
    department: 'Finance',
    tenure: '5–10 years',
    location: 'EMEA',
    scores: { aiLiteracyPerceptions: 3, organisationalMotivation: 3.5, managementPractices: 2, resourcesTeamwork: 2.5 },
  },
  {
    id: 'org-mock-07',
    personaLabel: 'Team lead, HR, LATAM',
    roleLevel: 'Team lead / supervisor',
    department: 'HR',
    tenure: '1–3 years',
    location: 'LATAM',
    scores: { aiLiteracyPerceptions: 3, organisationalMotivation: 3, managementPractices: 3, resourcesTeamwork: 3 },
  },
  {
    id: 'org-mock-08',
    personaLabel: 'Senior leadership, Technology/IT, APAC',
    roleLevel: 'Senior leadership / C-suite',
    department: 'Technology / IT',
    tenure: 'More than 10 years',
    location: 'APAC',
    scores: { aiLiteracyPerceptions: 4, organisationalMotivation: 4.5, managementPractices: 4.5, resourcesTeamwork: 4 },
  },
  {
    id: 'org-mock-09',
    personaLabel: 'IC, Legal & Compliance, North America',
    roleLevel: 'Individual contributor',
    department: 'Legal & Compliance',
    tenure: '3–5 years',
    location: 'North America',
    scores: { aiLiteracyPerceptions: 3.5, organisationalMotivation: 2, managementPractices: 3, resourcesTeamwork: 3.5 },
  },
  {
    id: 'org-mock-10',
    personaLabel: 'Middle mgmt, Sales & Marketing, EMEA',
    roleLevel: 'Middle management',
    department: 'Sales & Marketing',
    tenure: '1–3 years',
    location: 'EMEA',
    scores: { aiLiteracyPerceptions: 2.5, organisationalMotivation: 2.5, managementPractices: 2, resourcesTeamwork: 2.5 },
  },
];

export const ORG_MOCK_QUEUE: DemoPersonaInput[] = SPECS.map((spec) => ({
  id: spec.id,
  personaLabel: spec.personaLabel,
  answers: flatAnswers(spec),
  recommendations: [],
}));
