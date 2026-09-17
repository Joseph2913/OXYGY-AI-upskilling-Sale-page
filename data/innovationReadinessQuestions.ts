// Question bank for the AI Change & Innovation Readiness Assessment (individual survey).
// Source: the assessment JSON supplied directly for this build. Field names below (`label`,
// `scored`, `subgroup`, etc.) map 1:1 onto that JSON's `text`/`scored`/`subgroup` fields — this
// file is a typed transcription, not a redesign.
//
// Two things the source JSON left unresolved, flagged here rather than silently decided:
//
// 1. `axes.strategic_context` includes "management_practices_governance_subset", but the JSON
//    never names which management_practices questions count as "governance". Inferred below as
//    `GOVERNANCE_SUBSET_IDS` = mp_risk_balance + mp_governance_recognition (the two questions that
//    are actually about governance policy, as opposed to communication/networks/space). Confirm
//    this with whoever owns the scoring spec before treating axis placement as final.
// 2. `mp_experimentation_describe` is "conditional_on": "mp_experimentation_space", but that
//    trigger question is a 1–5 Likert, not yes/no. Implemented as: the follow-up appears once the
//    Likert answer is 4 or 5 ("Somewhat agree"/"Strongly agree"). That threshold is a guess.
// 3. `rt_tool_satisfaction` ("likert_multi") has no defined list of tools to rate — the source
//    only implies "whatever tools the respondent has access to". A placeholder tool list is used
//    below; swap for a real one (or a dynamic "which tools do you use" pick-list) when available.
// 4. `demo_location` is `open_text` in the source with a note "Open field or country/region
//    dropdown" — implemented as open text since that's the literal type given.
// 5. The "Supervisory Encouragement" category exists in the source but has zero questions
//    ("status": "pending" — not yet written). It is intentionally left out of
//    `SURVEY_CATEGORY_ORDER` so the form doesn't render an empty step; add it once questions exist.

export type QuestionType = 'likert' | 'likert_multi' | 'single_select' | 'open_text';

export type SurveyCategoryId =
  | 'demographics'
  | 'aiLiteracyPerceptions'
  | 'organisationalMotivation'
  | 'managementPractices'
  | 'resourcesTeamwork';

export const SURVEY_CATEGORY_ORDER: SurveyCategoryId[] = [
  'demographics',
  'aiLiteracyPerceptions',
  'organisationalMotivation',
  'managementPractices',
  'resourcesTeamwork',
];

export const SURVEY_CATEGORY_LABELS: Record<SurveyCategoryId, string> = {
  demographics: 'Demographics',
  aiLiteracyPerceptions: 'AI Literacy & Perceptions',
  organisationalMotivation: 'Organisational Motivation',
  managementPractices: 'Management Practices',
  resourcesTeamwork: 'Resources & Teamwork',
};

export const LIKERT_LABELS = ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree'];

/** A single answer: 1–5 for likert, null for Not Applicable, a string for single_select/open_text,
 * or a tool→rating map for likert_multi. */
export type AnswerValue = number | null | string | Record<string, number | null> | undefined;
export type SurveyAnswers = Record<string, AnswerValue>;

export interface SurveyQuestion {
  id: string;
  category: SurveyCategoryId;
  type: QuestionType;
  label: string;
  /** single_select only */
  options?: string[];
  /** Groups AI Literacy (scored) vs AI Perceptions (context only) within one category screen. */
  subgroup?: string;
  /** Whether this question feeds a category/axis average. False = shown for context only. */
  scored: boolean;
  /** likert/likert_multi only — Not Applicable is always offered and always excluded from scoring. */
  allowNotApplicable?: boolean;
  /** open_text follow-ups that only appear after a specific answer elsewhere in the category. */
  conditionalOn?: string;
  /** GUESS (see file header, point 2): Likert value on `conditionalOn` that reveals this question. */
  conditionalMinValue?: number;
  /** likert_multi only — placeholder rating targets (see file header, point 3). */
  multiItems?: string[];
}

export const QUESTION_BANK: SurveyQuestion[] = [
  // ---------------- Demographics (not scored — used for cross-cuts only) ----------------
  { id: 'demo_role_level', category: 'demographics', type: 'single_select', scored: false, label: 'What is your role level?', options: ['Individual contributor', 'Team lead / supervisor', 'Middle management', 'Senior leadership / C-suite'] },
  { id: 'demo_department', category: 'demographics', type: 'single_select', scored: false, label: 'Which department or function do you work in?', options: ['HR', 'Finance', 'Operations', 'Technology / IT', 'Sales & Marketing', 'Legal & Compliance', 'Strategy', 'Other (please specify)'] },
  { id: 'demo_tenure', category: 'demographics', type: 'single_select', scored: false, label: 'How long have you been with the organisation?', options: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', 'More than 10 years'] },
  { id: 'demo_location', category: 'demographics', type: 'open_text', scored: false, label: 'Where are you based?' },

  // ---------------- AI Literacy & Perceptions ----------------
  // AI Literacy subgroup is scored; AI Perceptions subgroup is context only (per source scoring_note).
  { id: 'lit_uses_genai', category: 'aiLiteracyPerceptions', type: 'likert', scored: true, allowNotApplicable: true, subgroup: 'AI Literacy', label: 'You regularly use generative AI tools (ChatGPT, CoPilot, Claude) to complete tasks at work' },
  { id: 'lit_prompting', category: 'aiLiteracyPerceptions', type: 'likert', scored: true, allowNotApplicable: true, subgroup: 'AI Literacy', label: 'You can write effective prompts and provide the right context to get useful outputs from AI tools' },
  { id: 'lit_tool_fit', category: 'aiLiteracyPerceptions', type: 'likert', scored: true, allowNotApplicable: true, subgroup: 'AI Literacy', label: 'You can assess whether an AI tool is appropriate for a given task before using it' },
  { id: 'lit_seeks_tools', category: 'aiLiteracyPerceptions', type: 'likert', scored: true, allowNotApplicable: true, subgroup: 'AI Literacy', label: 'You actively seek out new AI tools or features relevant to your work' },
  { id: 'perc_job_concern', category: 'aiLiteracyPerceptions', type: 'likert', scored: false, allowNotApplicable: true, subgroup: 'AI Perceptions', label: 'You are concerned that AI will negatively affect your job or role' },
  { id: 'perc_keep_up_skills', category: 'aiLiteracyPerceptions', type: 'likert', scored: false, allowNotApplicable: true, subgroup: 'AI Perceptions', label: 'You have the skills needed to keep up with AI developments in your field' },
  { id: 'perc_effectiveness_belief', category: 'aiLiteracyPerceptions', type: 'likert', scored: false, allowNotApplicable: true, subgroup: 'AI Perceptions', label: 'You believe AI will make your work more effective, rather than replace it' },
  { id: 'perc_routine_tasks', category: 'aiLiteracyPerceptions', type: 'likert', scored: false, allowNotApplicable: true, subgroup: 'AI Perceptions', label: 'A significant portion of your weekly tasks are routine and follow a predictable pattern' },
  { id: 'perc_judgment_complexity', category: 'aiLiteracyPerceptions', type: 'likert', scored: false, allowNotApplicable: true, subgroup: 'AI Perceptions', label: 'Your role involves a high degree of judgment and complexity' },

  // ---------------- Organisational Motivation (→ Strategic Context axis) ----------------
  { id: 'om_primary_goal', category: 'organisationalMotivation', type: 'single_select', scored: false, label: 'In your view, what is the primary goal of AI in your organisation?', options: ['Improving individual productivity', 'Improving process efficiency', 'Enhancing customer experience', 'Developing new products or services', 'All of the above', "I don't know"] },
  { id: 'om_top_mgmt_vision', category: 'organisationalMotivation', type: 'likert', scored: true, allowNotApplicable: true, label: 'Top management has a clear vision and commitment to AI adoption' },
  { id: 'om_manager_communication', category: 'organisationalMotivation', type: 'likert', scored: true, allowNotApplicable: true, label: "Your people manager effectively communicates the organisation's AI vision to their teams" },
  { id: 'om_vision_shared', category: 'organisationalMotivation', type: 'likert', scored: true, allowNotApplicable: true, label: 'The AI vision is understood and shared at all levels of your organisation' },
  { id: 'om_priorities_communicated', category: 'organisationalMotivation', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has communicated how AI contributes to achieving business priorities' },
  { id: 'om_risk_management', category: 'organisationalMotivation', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation actively manages risks around unofficial or ungoverned AI use' },

  // ---------------- Management Practices (→ Work Environment axis; governance subset also → Strategic Context) ----------------
  { id: 'mp_communication_flow', category: 'managementPractices', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has an open and active communication flow for sharing information and ideas' },
  { id: 'mp_experimentation_space', category: 'managementPractices', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has a dedicated space or mechanism for experimenting with AI-enabled ideas (e.g. innovation challenges, sandboxes, pilot programmes)' },
  { id: 'mp_experimentation_describe', category: 'managementPractices', type: 'open_text', scored: false, conditionalOn: 'mp_experimentation_space', conditionalMinValue: 4, label: 'If yes, please describe the initiative' },
  { id: 'mp_risk_balance', category: 'managementPractices', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation takes a balanced approach to AI risk and innovation — neither blocking innovation nor allowing unchecked experimentation' },
  { id: 'mp_governance_recognition', category: 'managementPractices', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has dedicated governance to recognise and reward innovation and AI-related contributions in a transparent, fair, and agile manner' },
  { id: 'mp_networks', category: 'managementPractices', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation actively develops internal and external networks to drive AI innovation' },

  // ---------------- Resources & Teamwork (→ Work Environment axis) ----------------
  { id: 'rt_time', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation allows sufficient time to explore and develop new ideas' },
  { id: 'rt_right_people', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has the right people with the right competencies to support AI adoption' },
  { id: 'rt_budget', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation has allocated dedicated resources or budget specifically for AI initiatives' },
  { id: 'rt_upskilling_opportunities', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Your organisation provides ongoing opportunities to develop your AI skills' },
  { id: 'rt_upskilling_quality', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'AI upskilling is effective, customised, and hands-on' },
  { id: 'rt_team_diversity', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Teams are set up to maximise diversity in terms of competencies, experiences, and knowledge' },
  { id: 'rt_trust', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'There is a high level of interpersonal trust and openness to share ideas within teams' },
  { id: 'rt_team_idea_generation', category: 'resourcesTeamwork', type: 'likert', scored: true, allowNotApplicable: true, label: 'Teams are effective at generating and developing new ideas together' },
  // GUESS (see file header, point 3): placeholder rating targets — source gives no fixed tool list.
  { id: 'rt_tool_satisfaction', category: 'resourcesTeamwork', type: 'likert_multi', scored: true, label: 'I am satisfied with the AI tools available to me', multiItems: ['ChatGPT', 'Microsoft Copilot', 'Claude', 'Other internal tool'] },
];

/** Inferred "governance" subset of Management Practices that also feeds Strategic Context (see file header, point 1). */
export const GOVERNANCE_SUBSET_IDS: string[] = ['mp_risk_balance', 'mp_governance_recognition'];

export const questionsForCategory = (category: SurveyCategoryId): SurveyQuestion[] =>
  QUESTION_BANK.filter((q) => q.category === category);
