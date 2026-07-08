// Content source of truth for the L0 AI Readiness Assessment page (Phase 1, static).
// Copied from PRD/AI-Readiness-Assessment-Spec.md. Edit the spec and this file together.

export type QuestionBlock = 'company' | 'respondent' | 'strategic' | 'workEnvironment' | 'perception';

export interface Question {
  id: string;
  block: QuestionBlock;
  /** Full question / statement text */
  label: string;
  /** Short label used in score bars and tiles (Likert questions only) */
  shortLabel?: string;
  /** Categorical options (company / respondent blocks only) */
  options?: string[];
  /** "Learn more" content for scored questions — for the technically curious */
  rationale?: { why: string; collected: string; enables: string };
}

export const QUESTIONS: Question[] = [
  // Block A — Company context
  { id: 'A1', block: 'company', label: 'Industry', options: ['Pharma / Life Sciences', 'Financial Services', 'Manufacturing', 'Logistics & Supply Chain', 'Retail & Consumer', 'Technology', 'Professional Services', 'Public Sector', 'Other'] },
  { id: 'A2', block: 'company', label: 'Organisation size', options: ['<500', '500–2,000', '2,000–10,000', '10,000–50,000', '50,000+'] },
  { id: 'A3', block: 'company', label: 'Geographic footprint', options: ['Single country', 'Regional', 'Global'] },
  { id: 'A4', block: 'company', label: 'Where are you in your AI journey?', options: ['Just exploring', 'Strategy defined, early delivery', 'Multiple live use cases', 'Scaling across the org'] },

  // Block B — Respondent context
  { id: 'B1', block: 'respondent', label: 'Role level', options: ['Individual contributor', 'Team lead / supervisor', 'Direct people manager / supervisor', 'Senior leadership / C-suite'] },
  { id: 'B2', block: 'respondent', label: 'Department / function', options: ['HR', 'Finance', 'Operations', 'Technology / IT', 'Sales & Marketing', 'Legal & Compliance', 'Strategy', 'Other'] },
  { id: 'B3', block: 'respondent', label: 'Tenure', options: ['<1 yr', '1–3 yrs', '3–5 yrs', '5–10 yrs', '10+ yrs'] },

  // Block C — Strategic Context (Likert 1–5) → vertical axis
  {
    id: 'SC1', block: 'strategic', shortLabel: 'Strategy articulated', label: "AI's expected contribution to our business priorities is clearly articulated.",
    rationale: {
      why: 'If people cannot articulate how AI serves the business, effort scatters across disconnected, low-value pilots that never add up.',
      collected: 'Leadership interviews to capture the intended strategy, cross-checked with a survey item testing whether that strategy is actually understood lower down.',
      enables: 'Tells us whether to begin with a strategy-definition workshop or move straight to delivery — and sets the north star every later decision is measured against.',
    },
  },
  {
    id: 'SC2', block: 'strategic', shortLabel: 'Leadership vision & comms', label: 'Leadership has a clear AI vision and communicates it consistently at all levels.',
    rationale: {
      why: 'A strategy that lives only in a slide deck never changes behaviour. Adoption tracks how consistently leaders communicate and reinforce the vision.',
      collected: 'An organisation-wide survey (do people hear it?) read against leadership interviews (what was actually said).',
      enables: 'Pinpoints where the message breaks down — usually middle management — so enablement can be targeted exactly there rather than broadcast everywhere.',
    },
  },
  {
    id: 'SC3', block: 'strategic', shortLabel: 'Data quality', label: 'Our data is well-organised, accessible and reliable enough to support AI.',
    rationale: {
      why: 'Most AI failures trace back to data, not models. Fragmented or unreliable data hard-caps what any AI initiative can achieve.',
      collected: 'Focused interviews with data and IT owners, plus a review of the key datasets and data flows behind priority use cases.',
      enables: 'Decides whether data remediation must precede any build, and which use cases are realistically feasible right now versus later.',
    },
  },
  {
    id: 'SC4', block: 'strategic', shortLabel: 'Tech stack consistency', label: 'The AI tools and technology we use are consistent and well-integrated, not fragmented.',
    rationale: {
      why: 'A sprawl of overlapping tools fragments effort, inflates cost, and is a leading cause of ungoverned shadow AI.',
      collected: 'A tools and systems inventory built with IT, mapped against where and by whom each tool is actually used.',
      enables: 'Surfaces consolidation opportunities and the integration work needed before anything can scale safely.',
    },
  },
  {
    id: 'SC5', block: 'strategic', shortLabel: 'Governance & shadow AI', label: 'We actively govern AI use and manage the risks of unofficial / shadow AI.',
    rationale: {
      why: 'Ungoverned AI use creates security, compliance and reputational risk that stalls scaling the moment it is noticed by risk or legal.',
      collected: 'Interviews with data stewards, legal and compliance, plus a survey on unofficial tool use already happening in teams.',
      enables: 'Defines the guardrails that let the organisation scale AI with confidence instead of freezing it once exposure becomes visible.',
    },
  },

  // Block D — Work Environment (Likert 1–5) → horizontal axis
  {
    id: 'WE1', block: 'workEnvironment', shortLabel: 'Experimentation / sandbox', label: 'We have structured spaces (sandboxes) to safely experiment with and test AI ideas.',
    rationale: {
      why: 'Without a safe space to try AI, ideas never get tested and learning stays theoretical. Experimentation is where capability compounds.',
      collected: 'A survey on whether structured experimentation exists, with interviews on how it is run and governed.',
      enables: 'Tells us whether standing up a sandbox or innovation factory should be one of the first moves.',
    },
  },
  {
    id: 'WE2', block: 'workEnvironment', shortLabel: 'Idea governance', label: 'New ideas are evaluated fairly and can progress without being killed by bureaucracy.',
    rationale: {
      why: 'Good ideas die when bureaucracy or unfair evaluation kills them before they ever prove value.',
      collected: 'A survey on how ideas are evaluated, championed and progressed across teams.',
      enables: 'Shows whether the blocker is generating ideas or letting them through — two very different fixes.',
    },
  },
  {
    id: 'WE3', block: 'workEnvironment', shortLabel: 'AI knowledge & resources', label: 'Our people have the AI knowledge, time and budget to put AI into practice.',
    rationale: {
      why: 'People cannot apply AI without the skills, time and budget to do so. This is the core upskilling signal.',
      collected: 'A survey on individual AI knowledge and use, plus resourcing, read alongside HR and L&D interviews.',
      enables: 'Sizes the upskilling need and where to target it — which roles, which capability level, how urgently.',
    },
  },
  {
    id: 'WE4', block: 'workEnvironment', shortLabel: 'Teamwork & sponsorship', label: 'Teams are diverse, high-trust and actively sponsored to drive AI innovation.',
    rationale: {
      why: 'AI adoption is a team sport. Diverse, trusted, actively sponsored teams move faster and make change stick.',
      collected: 'A survey on team diversity, interpersonal trust and the presence of active executive sponsorship.',
      enables: 'Identifies whether sponsorship and team design need strengthening before any rollout is attempted.',
    },
  },
  {
    id: 'WE5', block: 'workEnvironment', shortLabel: 'Open culture & recognition', label: 'Information and AI ideas flow openly across the organisation, and contributions are recognised.',
    rationale: {
      why: 'Ideas and learning only spread when information flows openly and people are recognised for their AI contributions; otherwise progress stays trapped in pockets.',
      collected: 'A survey on communication flow across teams and how AI contributions are recognised and rewarded.',
      enables: 'Shows whether to invest in internal networks, communities of practice and recognition to sustain momentum beyond the early adopters.',
    },
  },

  // AI Literacy & Perception — scored, but kept separate from the matrix. Sentiment, not capability.
  { id: 'PQ1', block: 'perception', label: 'I am concerned AI will negatively affect my role.' },
  { id: 'PQ2', block: 'perception', label: 'I feel I have the right skills to keep up with AI development.' },
  { id: 'PQ3', block: 'perception', label: 'I believe AI will make my work more effective.' },
  { id: 'PQ4', block: 'perception', label: 'I can write effective prompts and give AI tools the right context to get useful output.' },
];

/** Phase 1 framing: why the survey exists, shown once above the survey/matrix block. */
export const PHASE1_WHY =
  "The survey exists to place you on the matrix, fast, so Phase 2 can start from evidence instead of guesswork. It's deliberately standardised, not customised, so your position is comparable across companies and industries.";

export const LIKERT_LABELS = ['Strongly disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Strongly agree'];

export type ProfileId = 'sitting-duck' | 'disconnected-antenna' | 'island-of-creativity' | 'systematic-innovator';

export interface Offering {
  title: string;
  icon: 'compass' | 'graduationCap' | 'flask' | 'shield' | 'refresh' | 'broadcast' | 'target';
  duration: string;
  /** What this OXYGY offering generically is / does */
  description: string;
  /** Specific to this quadrant — what it does for an organisation in this exact situation */
  valueAdd: string;
}

export interface ProfileTraits {
  /** Same four fields across every profile; the values differ to characterise the quadrant.
   * Each is 2 short bullet points, `**word**` marks the highlighted term, kept to a tight
   * length band across every profile so the trait cards render at a consistent height. */
  strategy: string[];
  experimentation: string[];
  governance: string[];
  adoption: string[];
}

export interface Evidence {
  /** Lead figure, e.g. "78%" */
  figure: string;
  /** Sentence that continues naturally after the figure */
  statement: string;
  /** Source attribution: organisation, report, year */
  source: string;
  /** Icon key, mapped to a lucide icon in ReadinessAssessment */
  icon: 'compass' | 'target' | 'users' | 'shield' | 'warning' | 'trophy' | 'trending-up';
}

export interface Profile {
  id: ProfileId;
  name: string;
  /** Quadrant position description */
  quadrantTag: string;
  /** One-line persona shown on the selector card */
  tagline: string;
  /** Short qualitative description shown static in the result-card header */
  summary: string;
  /** Quadrant-defining characteristics (same fields across all profiles) */
  traits: ProfileTraits;
  /** Quadrant colour (from the deck) */
  color: string;
  persona: { industry: string; size: string; footprint: string; stage: string };
  respondent: { role: string; department: string; tenure: string };
  /** Per-question answers, keyed by question id. Categorical = string, Likert = 1–5. */
  answers: Record<string, string | number>;
  /** AI Literacy & Perception — scored, but never folded into strategicScore/workEnvScore/overallScore. */
  perception: {
    /** 1–5, same band() scale as the axis scores, but reported alone. */
    score: number;
    /** 2 short bullet points, same `**word**` highlight convention as ProfileTraits. */
    insight: string[];
  };
  results: {
    output: {
      headline: string;
      strongestArea: string;
      biggestGap: string;
      heroArtifact: string;
    };
    /** Phase 2, the primary visual: OXYGY's offerings for this quadrant, 2–3 per profile. */
    offerings: Offering[];
    decisions: {
      /** One-line "why this sequence, why now" — the Phase 2 rationale for this quadrant. */
      rationale: string;
      /** Precise, specific "don't do this yet" recommendations — not a single soft caveat. */
      guardrails: string[];
    };
    /** Single independently-sourced research citation grounding the roadmap. Never a consulting firm. */
    evidence: Evidence;
  };
}

export const PROFILES: Profile[] = [
  {
    id: 'sitting-duck',
    name: 'Sitting Duck',
    quadrantTag: 'Unclear strategy · Conventional environment',
    tagline: 'Traditional, hierarchical, no AI strategy yet — only scattered shadow AI.',
    summary: 'A traditional, hierarchical organisation that has not yet set an AI direction. Most AI use is informal and scattered, and there is everything to play for once a clear path is in place.',
    color: '#2D3748',
    persona: { industry: 'Manufacturing', size: '2,000–10,000', footprint: 'Single country', stage: 'Just exploring' },
    respondent: { role: 'Direct people manager / supervisor', department: 'Operations', tenure: '5–10 yrs' },
    traits: {
      strategy: ['**No AI strategy** on paper', '**No agreement** on direction'],
      experimentation: ['**No safe space** to test', '**Nothing shared** across teams'],
      governance: ['**No AI policy** exists yet', '**No named** data owner in place'],
      adoption: ['Used in **hidden pockets**', '**No visibility** for leaders'],
    },
    perception: {
      score: 2,
      insight: ['**Low confidence** in AI skills', '**Cautious**, not excited'],
    },
    answers: {
      A1: 'Manufacturing', A2: '2,000–10,000', A3: 'Single country', A4: 'Just exploring',
      B1: 'Direct people manager / supervisor', B2: 'Operations', B3: '5–10 yrs',
      SC1: 2, SC2: 1, SC3: 2, SC4: 2, SC5: 1,
      WE1: 1, WE2: 2, WE3: 2, WE4: 2, WE5: 1,
    },
    results: {
      output: {
        headline: "No strategy yet? That's exactly where to start.",
        strongestArea: 'A clean slate, with no entrenched habits to undo',
        biggestGap: 'A clear AI strategy and the guardrails to back it',
        heroArtifact: 'A clear picture of where you stand against peers in your sector, so you can see what good looks like and the quickest path to it.',
      },
      offerings: [
        {
          title: 'AI Strategy Workshop',
          icon: 'compass',
          duration: '2–4 weeks',
          description: 'A focused leadership session that sets your AI ambition, priorities and the people plan to match — the north star everything else is measured against.',
          valueAdd: "Turns 'someone should look into this' into a direction your leadership actually owns.",
        },
        {
          title: 'Use Case Prioritisation Sprint',
          icon: 'target',
          duration: '1–2 weeks',
          description: 'A short, structured sprint that turns your new strategy into 2–3 concrete, validated use cases worth building first.',
          valueAdd: 'Stops the first win from being picked at random — you start with the highest-value, most feasible use case.',
        },
        {
          title: 'Upskilling Foundations (L1)',
          icon: 'graduationCap',
          duration: '8–12 weeks',
          description: 'A foundational, hands-on AI capability programme that builds broad confidence and skill across your workforce.',
          valueAdd: 'Replaces scattered, hidden AI use with visible, confident, consistent adoption.',
        },
      ],
      decisions: {
        rationale: 'Because nothing is defined yet, the fastest path to momentum is direction first, not tools or training at scale.',
        guardrails: [
          "Don't buy AI tools or licences before the strategy is set — most early AI budgets are wasted here.",
          "Don't run generic, org-wide training yet — target the 2–3 priority use cases first.",
        ],
      },
      evidence: {
        figure: '9 in 10',
        statement: "executives report no measurable productivity impact from AI in their own firm over the past three years. It starts with strategy, not tools.",
        source: 'NBER Working Paper, AI, Productivity & the Workforce, 2025',
        icon: 'target',
      },
    },
  },
  {
    id: 'disconnected-antenna',
    name: 'Disconnected Antenna',
    quadrantTag: 'Defined strategy · Conventional environment',
    tagline: 'Clear top-down AI strategy, but the workforce is not engaged and ideas stall.',
    summary: 'Leadership has set a clear AI strategy, but it has not reached the people meant to deliver it. The plan is sound; adoption is where it stalls.',
    color: '#4FD1C5',
    persona: { industry: 'Logistics & Supply Chain', size: '10,000–50,000', footprint: 'Global', stage: 'Strategy defined, early delivery' },
    respondent: { role: 'Senior leadership / C-suite', department: 'Strategy', tenure: '3–5 yrs' },
    traits: {
      strategy: ['**Clear strategy** on paper', '**Lives in slide decks** only'],
      experimentation: ['**Ideas stall** in approval', '**Momentum** quietly fades'],
      governance: ['**Centralised** and cautious', 'Seen as a **gate**, not help'],
      adoption: ['**Concentrated** at the top', '**Frontline** work unchanged'],
    },
    perception: {
      score: 3,
      insight: ['Strategy **heard**, not felt', '**Confidence trails** ambition'],
    },
    answers: {
      A1: 'Logistics & Supply Chain', A2: '10,000–50,000', A3: 'Global', A4: 'Strategy defined, early delivery',
      B1: 'Senior leadership / C-suite', B2: 'Strategy', B3: '3–5 yrs',
      SC1: 5, SC2: 4, SC3: 3, SC4: 4, SC5: 4,
      WE1: 2, WE2: 1, WE3: 2, WE4: 3, WE5: 2,
    },
    results: {
      output: {
        headline: 'A strong plan that has not reached the floor.',
        strongestArea: 'A clear, well-governed AI strategy',
        biggestGap: 'Engagement: your people have not been brought into the plan yet',
        heroArtifact: "A clear view of where your strategy and your people's day-to-day actually diverge, by level and function, so you know exactly where adoption is stalling.",
      },
      offerings: [
        {
          title: 'Innovation Sandbox',
          icon: 'flask',
          duration: '8–12 weeks',
          description: 'A structured, safe space where teams can test AI ideas quickly, with a fast-tracked path to real approval.',
          valueAdd: 'Gives ideas a way through, instead of stalling in layers of sign-off.',
        },
        {
          title: 'Change Management Programme',
          icon: 'refresh',
          duration: '2–3 months',
          description: 'A structured, sequenced change programme — the kind of deliberate approach research shows actually makes transformation stick.',
          valueAdd: 'Equips your direct people managers to carry the strategy the last mile, not just hear it.',
        },
        {
          title: 'Upskilling Platform',
          icon: 'graduationCap',
          duration: '3–6 months',
          description: 'An ongoing, role-specific AI capability platform that builds hands-on skill and confidence at scale.',
          valueAdd: 'Closes the gap between the strategy your people have heard and the confidence they actually have.',
        },
      ],
      decisions: {
        rationale: 'Because the strategy already exists, the constraint is adoption, not more planning, so the sequence starts with giving people a way to act on it.',
        guardrails: [
          "Don't add another strategy deck or town hall — the plan is already understood at the top.",
          "Don't skip past middle management — they're where the message is currently dying.",
        ],
      },
      evidence: {
        figure: '70%',
        statement: 'of major change initiatives fail to reach their goals. The ones that succeed follow a deliberate, sequenced approach, not more top-down messaging.',
        source: 'John Kotter, Harvard Business School — Harvard Business Review, 1995',
        icon: 'users',
      },
    },
  },
  {
    id: 'island-of-creativity',
    name: 'Island of Creativity',
    quadrantTag: 'Unclear strategy · Innovative environment',
    tagline: 'Pockets of brilliant grassroots experimentation, with no strategy holding it together.',
    summary: 'Teams are already experimenting and building with AI on their own initiative. The talent and appetite are real; what is missing is a strategy to point them in one direction.',
    color: '#2B4C7E',
    persona: { industry: 'Technology', size: '500–2,000', footprint: 'Regional', stage: 'Multiple live use cases' },
    respondent: { role: 'Team lead / supervisor', department: 'Technology / IT', tenure: '1–3 yrs' },
    traits: {
      strategy: ['**No shared direction** yet', '**Teams set** their own path'],
      experimentation: ['**Strong** and everywhere already', '**Builds own** tools fast'],
      governance: ['**Light-touch**, inconsistent', '**Shadow AI** sprawl building'],
      adoption: ['**Bottom-up**, in pockets', 'Value stays **trapped** locally'],
    },
    perception: {
      score: 4,
      insight: ['**Confident** and enthusiastic', '**Ahead** of governance'],
    },
    answers: {
      A1: 'Technology', A2: '500–2,000', A3: 'Regional', A4: 'Multiple live use cases',
      B1: 'Team lead / supervisor', B2: 'Technology / IT', B3: '1–3 yrs',
      SC1: 2, SC2: 2, SC3: 3, SC4: 1, SC5: 2,
      WE1: 5, WE2: 4, WE3: 4, WE4: 4, WE5: 4,
    },
    results: {
      output: {
        headline: 'Lots of energy, no steering.',
        strongestArea: 'A real experimentation culture and strong AI know-how',
        biggestGap: 'Direction and guardrails to turn that energy into results',
        heroArtifact: 'A clear map of what is already running across your teams and where ungoverned AI is quietly creating risk, so you can harness the energy without the exposure.',
      },
      offerings: [
        {
          title: 'AI Strategy Workshop',
          icon: 'compass',
          duration: '2–4 weeks',
          description: 'A focused leadership session that sets clear direction and light governance over energy that already exists.',
          valueAdd: 'Gives your grassroots activity somewhere to aim, without killing the momentum.',
        },
        {
          title: 'Governance Framework',
          icon: 'shield',
          duration: '4–6 weeks',
          description: 'A light-touch set of guardrails for AI use, data and tools — enough structure to manage risk without slowing teams down.',
          valueAdd: 'Closes your shadow-AI exposure while keeping the experimentation culture intact.',
        },
        {
          title: 'Process Redesign / Selective Scaling',
          icon: 'broadcast',
          duration: '2–3 months',
          description: 'Taking your strongest grassroots use cases and redesigning the surrounding process so they can scale safely into the wider business.',
          valueAdd: 'Turns your best bottom-up ideas into business-wide value, not just team-level wins.',
        },
      ],
      decisions: {
        rationale: 'Because the energy already exists, the fix is a direction to point it at, not more experimentation.',
        guardrails: [
          "Don't impose heavy top-down governance — it will kill the grassroots energy that's working.",
          "Don't try to inventory every use case at once — set direction first, consolidate second.",
        ],
      },
      evidence: {
        figure: '1 in 5',
        statement: 'organisations has already had a data breach linked to unsanctioned AI tools. That is the cost of scaling without governance.',
        source: 'Ponemon Institute / IBM Security, Cost of a Data Breach Report, 2025',
        icon: 'warning',
      },
    },
  },
  {
    id: 'systematic-innovator',
    name: 'Systematic AI Innovator',
    quadrantTag: 'Defined strategy · Innovative environment',
    tagline: 'Clear enterprise strategy, strong governance, and a genuine experimentation culture.',
    summary: 'AI is embedded in both strategy and culture, and the organisation is scaling with confidence. The task now is keeping every unit as strong as the best.',
    color: '#D4A017',
    persona: { industry: 'Financial Services', size: '50,000+', footprint: 'Global', stage: 'Scaling across the org' },
    respondent: { role: 'Senior leadership / C-suite', department: 'Strategy', tenure: '5–10 yrs' },
    traits: {
      strategy: ['**Clear strategy**, understood', '**Revisited** as market moves'],
      experimentation: ['**Structured** sandboxes exist', '**Fast path** to production'],
      governance: ['**Embedded** and fully trusted', '**Shadow AI** stays minimal'],
      adoption: ['**Scaling** across the org now', '**Maturity** still uneven'],
    },
    perception: {
      score: 4,
      insight: ['**Confident**, day to day', '**Unconcerned** about role risk'],
    },
    answers: {
      A1: 'Financial Services', A2: '50,000+', A3: 'Global', A4: 'Scaling across the org',
      B1: 'Senior leadership / C-suite', B2: 'Strategy', B3: '5–10 yrs',
      SC1: 5, SC2: 5, SC3: 4, SC4: 4, SC5: 5,
      WE1: 4, WE2: 4, WE3: 5, WE4: 4, WE5: 4,
    },
    results: {
      output: {
        headline: 'Ahead of the pack. Now keep it that way.',
        strongestArea: 'Strong on both strategy and culture',
        biggestGap: 'Keeping every unit and region as strong as your best',
        heroArtifact: 'A side-by-side view of every business unit and region, showing who leads, who lags, and where your edge needs protecting.',
      },
      offerings: [
        {
          title: 'Best-Practice Diffusion',
          icon: 'broadcast',
          duration: 'Ongoing, quarterly',
          description: 'A structured way to identify what your best-performing units do differently, and spread it deliberately across the business.',
          valueAdd: 'Closes the maturity gap between your leading units and the rest, before competitors do.',
        },
        {
          title: 'Advanced Upskilling (L3+)',
          icon: 'graduationCap',
          duration: '2–4 months',
          description: 'A deeper capability track for teams who are already AI-confident and ready to build more advanced, autonomous use cases.',
          valueAdd: 'Keeps your most advanced teams pulling further ahead instead of plateauing.',
        },
        {
          title: 'Periodic Re-assessment',
          icon: 'refresh',
          duration: 'Ongoing, quarterly',
          description: 'A lightweight, repeatable version of this same diagnostic, run on a cadence to catch drift before it becomes a gap.',
          valueAdd: "Confirms you're staying ahead instead of assuming it.",
        },
      ],
      decisions: {
        rationale: "Because you're strong on both axes, the sequence shifts from building readiness to protecting and spreading the advantage you already have.",
        guardrails: [
          "Don't run a blanket re-assessment across every unit — focus effort on the ones slipping behind.",
          "Don't assume the lead is permanent — laggards catch up fast once a market shifts.",
        ],
      },
      evidence: {
        figure: '88%',
        statement: 'of organisations now use AI somewhere in the business, but agent deployment still sits in single digits across nearly every function. The real gap is maturity, not adoption.',
        source: 'Stanford HAI, AI Index Report, 2026',
        icon: 'trending-up',
      },
    },
  },
];

/** Average of the five Strategic Context answers (1–5). */
export function strategicScore(p: Profile): number {
  const ids = ['SC1', 'SC2', 'SC3', 'SC4', 'SC5'];
  return ids.reduce((s, id) => s + (p.answers[id] as number), 0) / ids.length;
}

/** Average of the five Work Environment answers (1–5). */
export function workEnvScore(p: Profile): number {
  const ids = ['WE1', 'WE2', 'WE3', 'WE4', 'WE5'];
  return ids.reduce((s, id) => s + (p.answers[id] as number), 0) / ids.length;
}

/** Overall readiness, average of all ten scored answers (1–5). */
export function overallScore(p: Profile): number {
  return (strategicScore(p) + workEnvScore(p)) / 2;
}
