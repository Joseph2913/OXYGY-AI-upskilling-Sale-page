// data/engagement-model-content.ts — Static content for the Engagement Model page (v3)

// ─── Tier ID ───

export type TierId = 'foundation' | 'accelerator' | 'catalyst';

// ─── Tier Feature (clickable link to phase card) ───

export interface TierFeature {
  text: string;
  scrollTargetId: string;
}

// ─── Tier Configuration ───

export interface TierConfig {
  id: TierId;
  name: string;
  tagline: string;
  phasesBadge: string;
  ctaText: string;
  isRecommended: boolean;
  visiblePhases: number[];
  inheritsFrom?: string;
  features: TierFeature[];
  accentColor: string;
}

export const TIER_CONFIGS: TierConfig[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Build AI capability across your organization',
    phasesBadge: 'Phase 0 + Phase 1',
    ctaText: 'Explore Foundation',
    isRecommended: false,
    visiblePhases: [0, 1],
    accentColor: 'var(--em-phase01-accent)',
    features: [
      { text: 'Leadership alignment workshops', scrollTargetId: 'p0-leadership' },
      { text: 'Organizational data audit & diagnostics', scrollTargetId: 'p0-org-intel' },
      { text: 'Individual pathway calibration', scrollTargetId: 'p0-calibration' },
      { text: 'AI Champions identification', scrollTargetId: 'p0-champions' },
      { text: 'Define learning tracks & Wave 1\u20132 training', scrollTargetId: 'p1-tracks' },
      { text: 'Baseline AI maturity measurement', scrollTargetId: 'p1-wave1' },
    ],
  },
  {
    id: 'accelerator',
    name: 'Accelerator',
    tagline: 'Build capability and unlock innovation from within',
    phasesBadge: 'Phase 0 + Phase 1 + Phase 2',
    ctaText: 'Explore Accelerator',
    isRecommended: true,
    visiblePhases: [0, 1, 2],
    accentColor: 'var(--em-phase2-accent)',
    inheritsFrom: 'Everything in Foundation, plus:',
    features: [
      { text: 'Structured innovation framework & briefs', scrollTargetId: 'p2-framework' },
      { text: 'Sandbox prototyping environment', scrollTargetId: 'p2-sandbox' },
      { text: 'Steering committee facilitation', scrollTargetId: 'p2-steering' },
      { text: 'Technical validation of top ideas', scrollTargetId: 'p2-validation' },
    ],
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    tagline: 'Full transformation \u2014 from capability to operating model',
    phasesBadge: 'Phase 0 + Phase 1 + Phase 2 + Phase 3',
    ctaText: 'Explore Catalyst',
    isRecommended: false,
    visiblePhases: [0, 1, 2, 3],
    accentColor: 'var(--em-phase3-accent)',
    inheritsFrom: 'Everything in Accelerator, plus:',
    features: [
      { text: 'Wave 3 training (Levels 4 & 5)', scrollTargetId: 'p3-wave3' },
      { text: 'Operating model integration', scrollTargetId: 'p3-operating-model' },
      { text: 'Governance framework design', scrollTargetId: 'p3-governance' },
      { text: 'Champions Network formal activation', scrollTargetId: 'p3-champions' },
      { text: 'ROI impact report (baseline-to-close)', scrollTargetId: 'p3-roi' },
    ],
  },
];

// ─── Phase Card (Compact Expandable) ───

export interface PhaseCardData {
  id: string;
  title: string;
  summary: string;
  involves: string;
  iconName: string;
  approach: string[];
  outcome: string;
  outcomeTitle?: string;
  cardType?: 'learning-tracks' | 'wave';
}

// ─── Wave Card (extends PhaseCard with level sub-cards) ───

export interface WaveLevelSubCard {
  level: number;
  title: string;
  topics: string[];
  tools: string;
  ctaHref: string;
  example?: string;
}

export interface WaveCardData extends PhaseCardData {
  waveNumber: number;
  levelSubCards: WaveLevelSubCard[];
}

// ─── Type guard ───

export function isWaveCard(card: PhaseCardData | WaveCardData): card is WaveCardData {
  return 'levelSubCards' in card;
}

// ─── Phase Section ───

export interface PhaseSection {
  phaseNumber: number;
  eyebrow: string;
  title: string;
  titleUnderlineWord: string;
  intro: string;
  cards: (PhaseCardData | WaveCardData)[];
  accentColor: string;
  accentColorDark: string;
}

export const PHASE_SECTIONS: PhaseSection[] = [
  // ── Phase 0: Strategic Discovery ──
  {
    phaseNumber: 0,
    eyebrow: 'PHASE 0',
    title: 'Strategic Alignment & Discovery',
    titleUnderlineWord: 'Discovery',
    intro:
      'Every engagement begins with understanding your business \u2014 not deploying a curriculum. We plug into your existing data infrastructure and layer our diagnostic on top.',
    accentColor: 'var(--em-phase01-accent)',
    accentColorDark: 'var(--em-phase01-accent-mid)',
    cards: [
      {
        id: 'p0-leadership',
        title: 'Leadership Alignment Workshops',
        summary:
          'Define your firm\u2019s strategic AI ambition, map pain points and opportunities, and establish the enabler framework \u2014 the strategic outcomes you\u2019re pursuing and the capabilities required to get there.',
        involves: 'C-suite, senior leadership, Oxygy strategy team',
        iconName: 'Users',
        approach: [
          'What does AI success look like for this organization in 12\u201324 months?',
          'Where are the friction points today, and where do leaders see AI having the highest leverage?',
          'What are the strategic outcomes (Y) and what enablers (X) are required to achieve them?',
        ],
        outcome:
          'A clear strategic AI ambition, pain point map, and enabler framework that defines the capabilities your organization needs to build.',
      },
      {
        id: 'p0-org-intel',
        title: 'Organizational Intelligence Gathering',
        summary:
          'We ingest your existing data infrastructure \u2014 LMS records, project data, active initiatives, HR and capability data \u2014 and layer our diagnostic on top. No new data burden.',
        involves: 'IT, HR/L&D, functional leads, Oxygy data team',
        iconName: 'Database',
        approach: [
          'LMS data \u2014 training history, completion rates, engagement patterns',
          'Project and initiative data \u2014 what\u2019s been tried, what\u2019s in flight',
          'Existing AI tools and infrastructure \u2014 approved tools, shadow IT, current usage',
          'HR and capability data \u2014 roles, functions, seniority, performance context',
        ],
        outcome:
          'A comprehensive organizational AI readiness profile built on your existing data \u2014 no additional survey burden.',
      },
      {
        id: 'p0-calibration',
        title: 'Individual Pathway Calibration',
        summary:
          'Combining organizational data with a lightweight self-assessment, each participant is assigned to the right track \u2014 Essentials, Applied, or Mastery. Calibration considers role, function, and proximity to strategic priorities.',
        involves: 'All participants, HR/L&D leads, Oxygy calibration team',
        iconName: 'Target',
        approach: [
          'Role and function analysis \u2014 a consultant needs different exercises than an ops lead',
          'Proximity to strategic priorities \u2014 weight relevant levels more heavily for impacted teams',
          'Existing AI proficiency \u2014 from organizational data and self-assessment',
          'Potential as an AI Champion \u2014 identified individuals get an elevated pathway',
        ],
        outcome:
          'Personalized Essentials / Applied / Mastery track assignment per individual, calibrated to organizational context.',
      },
      {
        id: 'p0-champions',
        title: 'AI Champions Identification',
        summary:
          'Identify individuals who will play an elevated role throughout the engagement \u2014 not just as learners, but as embedded catalysts who coach peers, bridge functions, and sustain capability long after the engagement ends.',
        involves: 'HR, functional leads, Oxygy strategy team',
        iconName: 'Award',
        approach: [
          'Existing AI fluency or demonstrated enthusiasm for AI tools',
          'Informal influence within their teams \u2014 social capital, not just seniority',
          'Strategic positioning \u2014 cross-functional connectors, team leads, innovation-minded managers',
        ],
        outcome:
          'A network of identified AI Champions positioned to coach peers and sustain capability across the organization.',
      },
    ],
  },

  // ── Phase 1: Capability Building ──
  {
    phaseNumber: 1,
    eyebrow: 'PHASE 1',
    title: 'Capability Building',
    titleUnderlineWord: 'Building',
    intro:
      'Five levels of AI capability deployed in personalized waves \u2014 with Champions embedded across every cohort.',
    accentColor: 'var(--em-phase01-accent)',
    accentColorDark: 'var(--em-phase01-accent-mid)',
    cards: [
      {
        id: 'p1-tracks',
        title: 'Define Learning Tracks',
        summary:
          'Each participant is assigned to one of three tracks based on their role, experience, and proximity to strategic priorities \u2014 ensuring the right depth for the right people.',
        involves: 'All participants, HR/L&D leads, Oxygy calibration team',
        iconName: 'GitBranch',
        cardType: 'learning-tracks',
        approach: [
          'Diagnostic assessment of each participant\u2019s current AI proficiency',
          'Role-function matching to determine appropriate depth and focus areas',
          'Champion pathway elevation for identified catalysts',
        ],
        outcome:
          'Every participant assigned to Essentials, Applied, or Mastery \u2014 personalized to their context and the organization\u2019s strategic priorities.',
      },
      {
        id: 'p1-wave1',
        title: 'Wave 1 \u2014 Changing Ways of Working',
        summary:
          'Behavioral change \u2014 getting your people to confidently use AI in their daily work. Building comfort, creating shared language, understanding risks, and embedding AI into existing workflows.',
        involves: 'All participants across Essentials, Applied, and Mastery tracks',
        iconName: 'Zap',
        cardType: 'wave',
        approach: [
          'Workshop series covering AI fundamentals and applied capability',
          'Guided exercises using real work scenarios',
          'Peer collaboration sessions with Champion-facilitated cohorts',
        ],
        outcome:
          'Team-wide AI fluency and confidence. Participants actively using AI in daily work with shared language around responsible use.',
        waveNumber: 1,
        levelSubCards: [
          {
            level: 1,
            title: 'AI Fundamentals & Awareness',
            topics: ['Prompting basics', 'Everyday use cases', 'Creative AI (image/video/audio)', 'Responsible use & governance', 'Prompt library creation'],
            tools: 'ChatGPT, DALL\u00b7E, Opus Clip, Snipd, Descript',
            ctaHref: '#playground',
          },
          {
            level: 2,
            title: 'Applied Capability',
            topics: ['AI agents & custom GPTs', 'Instruction/system prompt design', 'Human-in-the-loop integration', 'Ethical framing', 'Agent templates'],
            tools: 'ChatGPT Custom GPT Builder, Claude Skills, Copilot Agents',
            ctaHref: '#agent-builder',
          },
        ],
      } as WaveCardData,
      {
        id: 'p1-wave2',
        title: 'Wave 2 \u2014 Building Systems That Last',
        summary:
          'Cross-functional collaboration, workflow design, and systemic integration. Teams identify structural pain points and build automated pipelines that scale.',
        involves: 'All participants, functional leads, IT stakeholders',
        iconName: 'Layers',
        cardType: 'wave',
        approach: [
          'Sandbox environment for hands-on workflow building',
          'Cross-functional design workshops',
          'Architecture reviews and integration sessions',
        ],
        outcome:
          'Functional teams building and deploying AI-enabled workflows. Cross-team collaboration patterns established.',
        waveNumber: 2,
        levelSubCards: [
          {
            level: 3,
            title: 'Systemic Integration',
            topics: ['AI workflow mapping', 'Agent chaining', 'Input logic & role mapping', 'Automated output generation', 'Human-in-the-loop design', 'Performance & feedback loops'],
            tools: 'Make, Zapier, n8n, API integrations',
            ctaHref: '#workflow-designer',
          },
        ],
      } as WaveCardData,
    ],
  },

  // ── Phase 2: Innovation Pipeline ──
  {
    phaseNumber: 2,
    eyebrow: 'PHASE 2',
    title: 'Innovation Pipeline',
    titleUnderlineWord: 'Innovation',
    intro:
      'The pipeline starts during Wave 1 \u2014 participants begin seeing possibilities as soon as they learn. This process captures, validates, and channels ideas toward real organizational impact.',
    accentColor: 'var(--em-phase2-accent)',
    accentColorDark: 'var(--em-phase2-accent-mid)',
    cards: [
      {
        id: 'p2-framework',
        title: 'Innovation Framework & Brief Design',
        summary:
          'A structured innovation brief template aligned to your strategic priorities. Not \u201csubmit any idea\u201d \u2014 it\u2019s targeted: given strategic priority X, propose an AI-enabled solution that addresses enabler Y.',
        involves: 'Innovation leads, functional heads, Oxygy strategy team',
        iconName: 'FileText',
        approach: [
          'Problem statement clearly articulated',
          'Proposed AI-enabled solution described',
          'Expected impact quantified',
          'Data requirements and feasibility estimate',
          'Alignment to strategic enablers from Phase 0',
        ],
        outcome:
          'A repeatable innovation brief framework that channels team creativity toward validated, strategically-aligned AI solutions.',
      },
      {
        id: 'p2-sandbox',
        title: 'Sandbox Environment',
        summary:
          'A protected workspace where teams prototype automated workflows and AI solutions with real data structures but no production risk.',
        involves: 'Client IT team, Oxygy technical advisors',
        iconName: 'Box',
        approach: [
          'Pre-approved AI tools available for experimentation',
          'Sample datasets mirroring production data structures',
          'No risk of disrupting live systems',
          'Ideas proven viable here advance to steering committee evaluation',
        ],
        outcome:
          'A safe experimentation environment where teams can prototype and validate AI solutions before committing production resources.',
      },
      {
        id: 'p2-steering',
        title: 'Steering Committee Facilitation',
        summary:
          'A joint evaluation body \u2014 Oxygy advisors, client leadership, and functional representatives. The committee decides what advances \u2014 not Oxygy alone.',
        involves: 'Leadership, functional reps, Oxygy advisors',
        iconName: 'BarChart2',
        approach: [
          'Strategic alignment to enablers defined in Phase 0',
          'Business impact potential assessment',
          'Technical feasibility evaluation',
          'Organizational readiness and appetite analysis',
          'Resource requirements and scalability review',
        ],
        outcome:
          'A governed, bi-weekly review process that objectively advances the most impactful and feasible AI innovations.',
      },
      {
        id: 'p2-validation',
        title: 'Technical Validation of Top Ideas',
        summary:
          'Your engineering and IT teams assess the top-scoring ideas for data requirements, security implications, integration feasibility, and scalability potential.',
        involves: 'Client tech team, Oxygy technical advisors',
        iconName: 'ShieldCheck',
        approach: [
          'Data availability and quality assessment',
          'Security and compliance review',
          'Integration architecture mapping',
          'Scalability and maintenance projection',
        ],
        outcome:
          'Technically validated, deployment-ready AI solutions with clear architecture, security clearance, and scalability projections.',
      },
    ],
  },
  // ── Phase 3: Transformation & Embedding ──
  {
    phaseNumber: 3,
    eyebrow: 'PHASE 3',
    title: 'Transformation & Embedding',
    titleUnderlineWord: 'Embedding',
    intro:
      'Move from capability and innovation to full operating model transformation \u2014 advanced training, governance design, and the formal activation of your Champions Network as long-term stewards.',
    accentColor: 'var(--em-phase3-accent)',
    accentColorDark: 'var(--em-phase3-accent-mid)',
    cards: [
      {
        id: 'p3-wave3',
        title: 'Wave 3 \u2014 Advanced Applications',
        summary:
          'Levels 4 and 5 training for your most capable practitioners. Participants design production-grade AI architectures, build executive dashboards, and develop repeatable frameworks for their functions.',
        involves: 'Applied and Mastery track participants, functional leads, Oxygy technical team',
        iconName: 'Zap',
        cardType: 'wave',
        approach: [
          'Deep-dive workshops on production AI architecture and system design',
          'Executive dashboard design and stakeholder communication frameworks',
          'Cross-functional capstone projects with real organizational data',
        ],
        outcome:
          'A cohort of advanced practitioners capable of designing, deploying, and maintaining production-grade AI solutions independently.',
        waveNumber: 3,
        levelSubCards: [
          {
            level: 4,
            title: 'Product-Level AI Architecture',
            topics: ['Dashboard design', 'Requirements specification', 'AI product thinking', 'Stakeholder communication', 'Production readiness'],
            tools: 'Gemini, Claude, custom architecture frameworks',
            ctaHref: '#product-architecture',
          },
          {
            level: 5,
            title: 'Enterprise AI Strategy',
            topics: ['Cross-functional integration', 'ROI modeling', 'Governance design', 'Change management', 'Sustainability planning'],
            tools: 'Custom strategy frameworks, executive toolkits',
            ctaHref: '#dashboard-design',
          },
        ],
      } as WaveCardData,
      {
        id: 'p3-operating-model',
        title: 'Operating Model Integration',
        summary:
          'Embed validated AI solutions from Phase 2 into your daily operations. This isn\u2019t a pilot \u2014 it\u2019s structured deployment with change management, training, and performance tracking built in.',
        involves: 'Leadership, IT, functional leads, Oxygy integration team',
        iconName: 'Layers',
        approach: [
          'Deployment roadmap for each validated solution from Phase 2',
          'Change management and adoption support per function',
          'Integration with existing workflows and systems',
          'Performance tracking and KPI alignment',
        ],
        outcome:
          'AI solutions deployed into daily operations with measurable performance tracking and structured change management.',
      },
      {
        id: 'p3-governance',
        title: 'Governance Framework Design',
        summary:
          'Establish the policies, review processes, and accountability structures that ensure AI is used responsibly, consistently, and in alignment with organizational values.',
        involves: 'Legal, compliance, leadership, Oxygy governance advisors',
        iconName: 'ShieldCheck',
        approach: [
          'AI usage policies and ethical guidelines',
          'Data governance and privacy frameworks',
          'Review and approval processes for new AI initiatives',
          'Risk assessment and mitigation protocols',
        ],
        outcome:
          'A comprehensive AI governance framework with clear policies, accountability structures, and review processes.',
      },
      {
        id: 'p3-champions',
        title: 'Champions Network Activation',
        summary:
          'Formally activate the Champions identified in Phase 0 as an ongoing internal capability network. They become the bridge between Oxygy\u2019s engagement and your organization\u2019s long-term AI maturity.',
        involves: 'Identified AI Champions, HR, leadership, Oxygy Champions team',
        iconName: 'Award',
        approach: [
          'Formal recognition and role definition for Champions',
          'Ongoing coaching toolkit and peer community structure',
          'Cross-functional knowledge-sharing cadence',
          'Succession planning for network sustainability',
        ],
        outcome:
          'A self-sustaining internal AI Champions Network that coaches peers, bridges functions, and drives continuous AI adoption.',
      },
      {
        id: 'p3-roi',
        title: 'ROI Impact Report',
        summary:
          'A comprehensive baseline-to-close measurement of the engagement\u2019s impact \u2014 tying capability gains, innovation pipeline output, and operational improvements back to the strategic outcomes defined in Phase 0.',
        involves: 'Leadership, Oxygy analytics team',
        iconName: 'BarChart2',
        approach: [
          'Baseline metrics established in Phase 0 compared to close-of-engagement state',
          'Capability gain measurement across all tracks and levels',
          'Innovation pipeline quantification: ideas submitted, validated, deployed',
          'Operational efficiency improvements tied to strategic enablers',
        ],
        outcome:
          'A data-backed impact report demonstrating measurable ROI across capability, innovation, and operational dimensions.',
      },
    ],
  },
];

// ─── Learning Tracks (Phase 1 — replaces Learner Profiles) ───

export interface LearningTrack {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  waveBreakdown: string[];
  badgeColor: string;
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    subtitle: 'Full immersion for those new to AI',
    description:
      'A comprehensive learning pathway covering all five levels at full depth. Participants work through every workshop, guided exercise, and sandbox session with dedicated coaching support.',
    targetAudience: 'Team members with limited or no AI experience',
    waveBreakdown: [
      'Wave 1: Complete workshop series with guided exercises and peer collaboration',
      'Wave 2: Full participation in sandbox building and cross-functional design',
    ],
    badgeColor: 'var(--em-peach)',
  },
  {
    id: 'applied',
    name: 'Applied',
    subtitle: 'Condensed fundamentals, deep systems focus',
    description:
      'An accelerated pathway that condenses foundational content and focuses depth on systems-level capability. Ideal for participants who understand AI basics but need structured guidance on integration and workflow design.',
    targetAudience: 'Team members with some AI experience looking to deepen applied skills',
    waveBreakdown: [
      'Wave 1: Condensed session covering core concepts, focused practical exercises',
      'Wave 2: Full sandbox participation and cross-functional workflow design',
    ],
    badgeColor: 'var(--em-yellow)',
  },
  {
    id: 'mastery',
    name: 'Mastery',
    subtitle: 'Rapid validation with elevated coaching role',
    description:
      'For AI-fluent individuals who validate their proficiency quickly and immediately take on a coaching role. These are your future AI Champions \u2014 they learn by teaching, documenting domain use cases, and bridging functions.',
    targetAudience: 'Senior digital leads, AI-fluent professionals, and identified Champions',
    waveBreakdown: [
      'Wave 1: Diagnostic validation in under 1 hour, peer coaching across 2\u20133 cohorts',
      'Wave 2: Coordination role bridging functions, translating between teams',
    ],
    badgeColor: 'var(--em-mint)',
  },
];

// ─── Phase 3 CTA Banner ───

export interface Phase3CtaBanner {
  headline: string;
  subtext: string;
  ctaText: string;
}

export const PHASE3_CTA_BANNER: Phase3CtaBanner = {
  headline: 'Curious about full transformation?',
  subtext: 'Discover what it looks like to embed AI into your operating model \u2014 with advanced training, governance frameworks, and a formally activated Champions Network.',
  ctaText: 'Explore Catalyst',
};

