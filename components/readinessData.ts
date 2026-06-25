// Content source of truth for the L0 AI Readiness Assessment page (Phase 1, static).
// Copied from PRD/AI-Readiness-Assessment-Spec.md. Edit the spec and this file together.

export type QuestionBlock = 'company' | 'respondent' | 'strategic' | 'workEnvironment';

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
  { id: 'B1', block: 'respondent', label: 'Role level', options: ['Individual contributor', 'Team lead / supervisor', 'Middle management', 'Senior leadership / C-suite'] },
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
];

export const LIKERT_LABELS = ['Strongly disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Strongly agree'];

export type ProfileId = 'sitting-duck' | 'disconnected-antenna' | 'island-of-creativity' | 'systematic-innovator';

export interface DataSourceCluster {
  cluster: 'On-the-ground signal' | 'Strategic direction' | 'Systems & operating reality';
  /** Relative emphasis 0–100 for this profile */
  weight: number;
  detail: string;
  who: string;
}

export interface ProfileTraits {
  /** Same four fields across every profile; the values differ to characterise the quadrant */
  strategy: string;
  experimentation: string;
  governance: string;
  adoption: string;
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
  results: {
    output: {
      headline: string;
      strongestArea: string;
      biggestGap: string;
      heroArtifact: string;
    };
    dataSources: DataSourceCluster[];
    analysis: { centralQuestion: string; computes: string[]; evidence: Evidence };
    decisions: { sequence: string[]; guardrail?: string; routesInto: string[]; evidence: Evidence };
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
    respondent: { role: 'Middle management', department: 'Operations', tenure: '5–10 yrs' },
    traits: {
      strategy: 'No strategy on paper. A few leaders are curious, but no one has agreed where AI should take the business.',
      experimentation: 'No real space to experiment. The odd person uses a chatbot on the side, but nothing gets tested or shared.',
      governance: 'No AI policy and no clear data owner. Use is invisible to leadership, and data is scattered and hard to trust.',
      adoption: 'In off-the-record pockets. People use the odd tool quietly, with no visibility and no way to scale what works.',
    },
    answers: {
      A1: 'Manufacturing', A2: '2,000–10,000', A3: 'Single country', A4: 'Just exploring',
      B1: 'Middle management', B2: 'Operations', B3: '5–10 yrs',
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
      dataSources: [
        { cluster: 'Strategic direction', weight: 55, detail: 'We start with your leadership: interviews and a working session to shape the AI strategy, ambition and guardrails the organisation does not have yet.', who: 'Senior leadership / C-suite' },
        { cluster: 'On-the-ground signal', weight: 30, detail: 'A short pulse survey to capture how your people use AI today and where the appetite to do more already sits.', who: 'Employees and line managers' },
        { cluster: 'Systems & operating reality', weight: 15, detail: 'A light review of the tools already in use, so the strategy is built on solid ground.', who: 'IT owners' },
      ],
      analysis: {
        centralQuestion: 'Where do we start, and what is the fastest path to momentum?',
        computes: [
          'A clear baseline of where you stand across strategy and environment',
          'What is really holding things back: awareness, intent, or capability',
          'How you compare with peers in your sector, and what to prioritise first',
        ],
        evidence: {
          figure: '60%',
          statement: 'of leaders worry their organisation has no real plan to put AI to work, even as adoption races ahead.',
          source: 'Microsoft & LinkedIn, Work Trend Index 2024',
          icon: 'compass',
        },
      },
      decisions: {
        sequence: [
          'Shape your AI strategy and the people plan to match, in a focused leadership workshop',
          'Choose 2 to 3 priority use cases to focus your first wins',
          'Build broad AI confidence with a foundational upskilling programme',
        ],
        guardrail: 'Hold off on buying tools or training at scale until the strategy is set. That is where most early budgets are wasted.',
        routesInto: ['AI strategy workshop', 'Upskilling foundations (L1)'],
        evidence: {
          figure: 'Just 21%',
          statement: 'of companies have redesigned how they work around AI, the factor most tied to bottom-line impact. It starts with strategy, not tools.',
          source: 'McKinsey, The State of AI, 2025',
          icon: 'target',
        },
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
      strategy: 'A clear, board-backed strategy with named use cases, but it mostly lives in slide decks and steering meetings.',
      experimentation: 'Ideas need sign-off before they go anywhere. Pilots crawl through approvals and momentum quietly stalls.',
      governance: 'Centralised and risk-aware, owned by a small team. Safe but slow, and seen as a gate rather than an enabler.',
      adoption: 'Concentrated at the top and a central team. Frontline staff heard the strategy, but daily work is unchanged.',
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
      dataSources: [
        { cluster: 'On-the-ground signal', weight: 55, detail: 'We listen to your workforce through a broad survey and focus groups, to find the real distance between the strategy on paper and the way people work.', who: 'Employees, line managers, HR / L&D' },
        { cluster: 'Strategic direction', weight: 25, detail: 'A few leadership conversations to confirm the strategy as it stands today.', who: 'Senior leadership' },
        { cluster: 'Systems & operating reality', weight: 20, detail: 'A review with your data and IT owners to see whether the tools already in place are actually being used.', who: 'Data & IT owners' },
      ],
      analysis: {
        centralQuestion: 'Does the strategy actually reach the people who have to deliver it?',
        computes: [
          "Where your strategy and your people's reality diverge, by level and function",
          'Where the message stalls, most often at middle management',
          'How ready your organisation really is to adopt, compared with sector peers',
        ],
        evidence: {
          figure: 'Only 15%',
          statement: 'of employees strongly agree they are trained to use AI well, even though 96% of executives feel the pressure to adopt it.',
          source: 'Slack Workforce Index, 2024',
          icon: 'users',
        },
      },
      decisions: {
        sequence: [
          'Give people a safe space to experiment, with an innovation sandbox',
          'Equip your middle managers to lead adoption on the ground',
          'Bring everyone along with change management and targeted upskilling',
        ],
        guardrail: 'More strategy or more top-down communication will not move the needle here. The gap is adoption, not direction.',
        routesInto: ['Innovation sandbox', 'Change management', 'Upskilling platform'],
        evidence: {
          figure: '6x',
          statement: 'more likely to hit their goals: the advantage initiatives gain from strong change management over weak.',
          source: 'Prosci, Best Practices in Change Management',
          icon: 'compass',
        },
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
      strategy: 'No single strategy ties it together. Teams set their own direction, with no shared view of what AI should win.',
      experimentation: 'Strong and everywhere. Teams spin up tools and build their own agents, often faster than the business can keep up.',
      governance: 'Light-touch and inconsistent. Tools and data sprawl, much of it unsanctioned, creating real shadow-AI exposure.',
      adoption: 'Bottom-up, in vibrant pockets. Plenty is live, but the value stays trapped inside individual teams.',
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
      dataSources: [
        { cluster: 'Systems & operating reality', weight: 45, detail: 'We map the AI already live across your teams, the data behind it and where tools have sprawled, working hands-on with your data and IT owners.', who: 'Data & IT owners, data stewards' },
        { cluster: 'Strategic direction', weight: 30, detail: 'A leadership working session to set a clear direction over the energy you already have.', who: 'Senior leadership' },
        { cluster: 'On-the-ground signal', weight: 25, detail: 'A survey to find where your strongest pockets of activity and skill really sit.', who: 'Employees and team leads' },
      ],
      analysis: {
        centralQuestion: 'What is already working, and where is risk quietly building?',
        computes: [
          'Where the cost and risk of ungoverned AI is concentrated today',
          'Where your energy sits now, and where a strategy should point it',
          'Which grassroots ideas are the ones worth scaling next',
        ],
        evidence: {
          figure: '78%',
          statement: 'of employees already using AI bring their own unsanctioned tools to work, putting company data at risk.',
          source: 'Microsoft & LinkedIn, Work Trend Index 2024',
          icon: 'warning',
        },
      },
      decisions: {
        sequence: [
          'Set a clear strategy and light governance to channel the energy you already have',
          'Consolidate a fragmented tool set into something that scales',
          'Scale your best ideas into the business through process redesign',
        ],
        guardrail: 'Heavy-handed governance will kill what makes you strong. The goal is to channel the energy, not control it.',
        routesInto: ['AI strategy workshop', 'Governance framework', 'Process redesign / selective scaling'],
        evidence: {
          figure: '47%',
          statement: 'of organisations have already had a negative AI outcome, most often inaccuracy. That is the cost of scaling without governance.',
          source: 'McKinsey, The State of AI, 2025',
          icon: 'shield',
        },
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
      strategy: 'A clear enterprise strategy people understand and act on, tied to business goals and revisited as the market moves.',
      experimentation: 'Structured and safe. Real sandboxes and a clear path to production let teams experiment quickly without new risk.',
      governance: 'Embedded and trusted. Guardrails are clear, data is solid and shadow AI is minimal, so teams can move fast.',
      adoption: 'Scaling across the organisation, though maturity is still uneven between the leading units and the rest.',
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
      dataSources: [
        { cluster: 'On-the-ground signal', weight: 35, detail: 'A benchmarking survey across your units, with closer looks at the ones slipping behind. Comparative, not a first-time audit, so at scale you can read it by unit and geography.', who: 'Employees across all business units' },
        { cluster: 'Systems & operating reality', weight: 35, detail: 'A systems review focused on scaling and integration, where consistency across units matters most now.', who: 'Data & IT owners' },
        { cluster: 'Strategic direction', weight: 30, detail: 'Light leadership input: direction is already set, so the value is a regular re-check that you are staying ahead.', who: 'Senior leadership / C-suite' },
      ],
      analysis: {
        centralQuestion: 'Are you staying ahead, and is that strength even across the business?',
        computes: [
          'How readiness varies across your units and regions',
          'Who is leading, who is lagging, and how you sit against the wider industry',
          'Where your advantage is strongest, and where it is beginning to slip',
        ],
        evidence: {
          figure: 'Just 4%',
          statement: 'of companies have built cutting-edge AI across functions and consistently turn it into real value.',
          source: "BCG, Where's the Value in AI?, 2024",
          icon: 'trophy',
        },
      },
      decisions: {
        sequence: [
          'Spread what your best units do well across the rest of the business',
          'Stretch the teams who are ready with advanced upskilling',
          'Decide how to roll out, all at once or in waves, and set a rhythm to re-check progress',
        ],
        guardrail: 'No need for a blanket audit. Focus the effort on the units that are slipping.',
        routesInto: ['Advanced upskilling (L3+)', 'Best-practice diffusion', 'Periodic re-assessment'],
        evidence: {
          figure: '1.7x',
          statement: 'the revenue growth of laggards: the lead AI front-runners open up as they reinvest and scale faster.',
          source: 'BCG, The Widening AI Value Gap, 2025',
          icon: 'trending-up',
        },
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
