import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, Brain, BookOpen, ShieldCheck, Target } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';

const LEVEL_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  2: { bg: '#EBF0FE', text: '#5B6DC2', label: 'Level 2 — Applied Capability' },
  3: { bg: '#FDF6E3', text: '#C4A934', label: 'Level 3 — Systemic Integration' },
  4: { bg: '#FFF0EB', text: '#D47B5A', label: 'Level 4 — Interactive Dashboards & Tailored Front-Ends' },
  5: { bg: '#E6FFFA', text: '#2C9A94', label: 'Level 5 — Full AI-Powered Applications' },
};

interface LevelTag {
  level: number;
  type: 'primary' | 'secondary';
  description: string;
}

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  accentColor: string;
  icon: React.ElementType;
  challenge: string;
  approach: string[];
  outcomes: string[];
  levelTags: LevelTag[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 6,
    title: 'AI TRiSM Market Intelligence for a Digital Trust Leader',
    subtitle: 'Mapping 90+ Competitors and Buyer Roles in an Emerging AI Governance Market',
    accentColor: '#C4A934',
    icon: ShieldCheck,
    challenge:
      'A leading European provider of qualified digital trust services saw a new market emerging around AI Trust, Risk, and Security Management (AI TRiSM), as the EU AI Act and related regulation began reshaping how organisations govern their AI systems. Before entering this fast-growing space, they needed rigorous, credible research to understand who the emerging competitors were, who inside a customer organisation actually buys and influences AI TRiSM adoption, and which trends were shaping the market.',
    approach: [
      'Competitor Research Agent — Discovered and profiled 130+ potential competitors across a dozen structured attributes, with frequent human-in-the-loop review to filter out irrelevant players',
      'Source Evaluation Agent — Scored every source against academic frameworks to ensure findings were high-quality and relevant',
      'Data Extraction Agent — Pulled AI TRiSM-relevant obligations out of regulatory documents',
      'Buyer Persona & Role Mapping Agents — Classified each obligation against a validated taxonomy of departments and buyer sub-types, then translated it into the single most relevant job title',
      'Auditable by design — Every step in the chain justified its reasoning in a short rationale, so findings never became a black box',
    ],
    outcomes: [
      'Narrowed 130+ potential competitors to 90+ verified, in-scope companies organised into evidence-based personas',
      'Completed in a fraction of the time of a fully manual process, with a documented, source-scored trail behind every finding',
      'Surfaced a previously undocumented pattern in where AI TRiSM buying and influencing decisions are made',
      'Gave the client a validated foundation for go-to-market and product strategy, plus hands-on AI upskilling that continued into further AI adoption programmes',
    ],
    levelTags: [
      { level: 3, type: 'primary', description: 'Chained, human-in-the-loop AI research workflow with auditable reasoning at every step.' },
      { level: 2, type: 'secondary', description: 'Purpose-built agents, each with a distinct research role, co-developed with the client.' },
    ],
  },
  {
    id: 7,
    title: 'Building Hunters: AI-Enabled Sales Academy',
    subtitle: 'Designing an Engaging Sales Academy for a Global Materials Leader’s European Sales Organisation',
    accentColor: '#2C9A94',
    icon: Target,
    challenge:
      'A global leader in material solutions was pursuing an ambitious growth strategy, pushing into new sectors and markets. To get there, its European commercial cluster needed sales managers and directors thinking and acting like hunters: proactively identifying new industries, mapping unfamiliar accounts, and building connections in markets they hadn’t traditionally served. The client needed a capability-building programme that felt engaging and practical rather than theoretical, fit around a busy sales calendar, and built habits that would show up in RFQ productivity, hit rate, and share of wallet.',
    approach: [
      'Three Progressive Cycles — Co-designed a blended programme with each cycle aligned to a stage of the sales cycle and the company’s growth ambitions',
      'Hybrid Learning Rhythm — E-learnings, live workshops, field assignments, and group coaching, so participants move between guided learning and real application in their own territory',
      'Grounded in Real Selling — Built content with the client’s subject matter experts and sales leaders to reflect real buying behaviour and market dynamics',
      'Purpose-Built Learning Platform — OXYGY built a bespoke learning management system combining e-learnings, custom materials, and AI-powered tools for personalized learning',
    ],
    outcomes: [
      'Validated learning model and a purpose-built platform live for a pilot cohort of ~20 sales professionals',
      'Learning materials co-created with the client’s sales experts, reflecting how their teams actually sell, not a generic playbook',
      'A scalable, modular model the client can extend across future cohorts and clusters',
      'Groundwork laid for full roll-out through Cycles 2 and 3, supporting a lasting shift to a hunter selling mindset',
    ],
    levelTags: [
      { level: 5, type: 'primary', description: 'A purpose-built, AI-powered learning platform that brings e-learnings, custom materials, and AI tools together to deliver a personalized experience to each participant.' },
    ],
  },
  {
    id: 5,
    title: 'Persona Learning Card Automation',
    subtitle: 'Scaling 100+ Role-Based Learning Cards from a Single Gold Standard',
    accentColor: '#5B6DC2',
    icon: BookOpen,
    challenge:
      'A large global beauty brand needed to automate the creation of standardized persona learning cards for their large-scale transformation program. With 100+ personas, producing high-quality, consistent cards manually was extremely time-consuming and difficult to keep uniform across teams. The goal was to generate cards with a repeatable structure—combining change management and adoption messaging with role-specific training guidance—while keeping content grounded in the training materials in scope.',
    approach: [
      'Trained the agent on a gold-standard persona card to replicate structure and tone at scale',
      'Mapped personas to business roles and roles to relevant trainings; ingested ~300 training decks and user guides into the agent',
      'Agent identified relevant training content per persona, retrieved and synthesized materials, and generated learning cards in a fixed format',
      'Standardized card structure combining change management and adoption messaging with role-specific training guidance',
      'End users could request cards by role (e.g. Supply Planner, Finance Controller) and receive end-to-end generated output automatically',
    ],
    outcomes: [
      'Significantly reduced effort required to scale persona-based learning content',
      'Improved consistency across 100+ persona cards',
      'Repeatable structure and tone while staying grounded in in-scope training materials',
      'Freed teams from manual card production while keeping quality high',
    ],
    levelTags: [
      { level: 2, type: 'primary', description: 'Custom agent built for a specific use case: standardized, scalable generation of persona learning content from existing training materials.' },
    ],
  },
  {
    id: 4,
    title: 'Second Brain — AI-Powered Knowledge Network',
    subtitle: 'Connecting Multiple Knowledge Sources into a Living Neural Map',
    accentColor: '#2C9A94',
    icon: Brain,
    challenge:
      'Professionals accumulate knowledge across meeting transcripts, documents, articles, videos, and other sources — but insights remain siloed. Without a way to surface connections between projects, ideas, and conversations, valuable patterns go unnoticed and strategic thinking stays fragmented.',
    approach: [
      'Multi-Source Ingestion — Integrates meeting transcripts, uploaded documents, videos, web content, and other inputs into a unified knowledge base',
      'AI Relationship Mapping — Uses AI to identify semantic relationships, recurring themes, and conceptual links across all inputs',
      'Neural Network Visualization — Builds a dynamic, interconnected graph that maps how topics, projects, and ideas relate to each other',
      'Continuous Learning — The network evolves as new inputs are added, surfacing deeper patterns over time',
    ],
    outcomes: [
      'Surfaces hidden connections between projects, ideas, and conversations',
      'Transforms fragmented knowledge into a structured, navigable intelligence layer',
      'Enables faster strategic thinking by revealing cross-domain patterns',
      'Creates a personalized knowledge asset that grows with the user',
    ],
    levelTags: [
      { level: 5, type: 'primary', description: 'A fully AI-powered application that autonomously processes, connects, and visualizes knowledge across multiple input sources.' },
    ],
  },
  {
    id: 2,
    title: 'AIFOD (AI for Developing Countries Forum) Conference Intelligence Dashboard',
    subtitle: 'Building an Interactive AI Policy Intelligence Tool for a Global Conference',
    accentColor: '#D47B5A',
    icon: Globe,
    challenge:
      'OXYGY wanted an interactive way to engage with the audience at the AI for Developing Countries Forum (AIFOD) by showing them synthesized results of research and policy documents. The goal was to present a structural framework for understanding AI policy production across the Global South — moving beyond aggregate rankings to benchmark the unique governance architectures, infrastructure gaps, and human capital strategies of emerging nations. The tool included an interactive map with AI readiness classifications based on studies from the University of Oxford and the World Bank.',
    approach: [
      'Synthesized research and policy documents into structured, comparable datasets',
      'Built an interactive map with AI readiness classifications by country',
      'Benchmarked governance architectures, infrastructure gaps, and human capital strategies across the Global South',
      'Designed an audience-facing dashboard for live conference engagement',
    ],
    outcomes: [
      'Delivered an interactive intelligence tool ready for live conference use',
      'Enabled audience to explore AI policy comparisons across countries in real time',
      'Provided a structural framework for understanding AI policy beyond aggregate rankings',
      'Positioned OXYGY as a designer of decision intelligence, not just analysis',
    ],
    levelTags: [
      { level: 4, type: 'primary', description: 'AI outputs transformed into role-specific, interactive intelligence interfaces.' },
      { level: 3, type: 'secondary', description: 'Integrated structured AI outputs into a usable, continuous decision tool.' },
    ],
  },
];

/* ─── Summary card for homepage ─── */
function CaseStudySummaryCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="h-[6px] w-full" style={{ backgroundColor: cs.accentColor }} />
      <div className="p-6 flex flex-col flex-grow">
        {/* Level Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cs.levelTags.map((tag) => {
            const colors = LEVEL_COLORS[tag.level];
            return (
              <span
                key={tag.level}
                className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                Level {tag.level}
              </span>
            );
          })}
        </div>

        <h3 className="text-[18px] font-bold text-navy-900 leading-tight mb-2">
          {cs.title}
        </h3>
        <p className="text-[14px] text-[#718096] leading-[1.5] mb-4 italic">
          {cs.subtitle}
        </p>

        <div className="h-px bg-slate-100 w-full mb-4" />

        <p className="text-[14px] text-[#4A5568] leading-[1.7] mb-5 line-clamp-3">
          {cs.challenge}
        </p>

        <div className="mt-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2 block">
            Key Outcomes
          </span>
          <ul className="space-y-2">
            {cs.outcomes.slice(0, 3).map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  className="w-[6px] h-[6px] rounded-full mt-[7px] shrink-0"
                  style={{ backgroundColor: cs.accentColor }}
                />
                <span className="text-[13px] text-[#4A5568] leading-[1.6]">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#case-studies"
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
          style={{ color: cs.accentColor, textDecoration: 'none' }}
        >
          Read full case study <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}


/** Homepage section — condensed cards */
export const CaseStudiesSection: React.FC = () => {
  return (
    <section id="case-studies-section" className="pt-12 pb-12 bg-[#F7FAFC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold text-navy-900 mb-5 relative inline-block">
            See It in{' '}
            <span className="relative inline-block">
              Action
              <span className="absolute left-0 bottom-0 w-full h-[4px] bg-teal opacity-80 rounded-full"></span>
            </span>
          </h2>
          <p className="text-[16px] text-navy-700 font-normal leading-relaxed max-w-[640px] mx-auto">
            Real examples of how OXYGY has helped organizations build AI capability
            — from multi-agent research workflows to interactive dashboards and tailored front-ends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.slice(0, 3).map((cs) => (
            <CaseStudySummaryCard key={cs.id} cs={cs} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Page card — vertical card for standalone page (click to expand detail below) ─── */
function CaseStudyPageCard({ cs, isSelected, onSelect }: { cs: CaseStudy; isSelected: boolean; onSelect: (cardTop: number) => void }) {
  return (
    <div
      onClickCapture={(e) => onSelect(e.currentTarget.getBoundingClientRect().top)}
      className="bg-white border rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{ borderColor: isSelected ? cs.accentColor : '#E2E8F0' }}
    >
      <div className="h-[6px] w-full" style={{ backgroundColor: cs.accentColor }} />
      <div className="p-6 flex flex-col flex-grow">
        {/* Icon + Level Pills row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="shrink-0 w-[40px] h-[40px] rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${cs.accentColor}14` }}
          >
            <cs.icon size={20} strokeWidth={1.5} style={{ color: cs.accentColor }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cs.levelTags.map((tag) => {
              const colors = LEVEL_COLORS[tag.level];
              return (
                <span
                  key={tag.level}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  Level {tag.level}
                </span>
              );
            })}
          </div>
        </div>

        <h3 className="text-[18px] font-bold text-navy-900 leading-tight mb-2">
          {cs.title}
        </h3>
        <p className="text-[14px] text-[#718096] leading-[1.5] mb-4 italic">
          {cs.subtitle}
        </p>

        <div className="h-px bg-slate-100 w-full mb-4" />

        <p className="text-[14px] text-[#4A5568] leading-[1.7] mb-5 line-clamp-3">
          {cs.challenge}
        </p>

        <div className="mt-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2 block">
            Key Outcomes
          </span>
          <ul className="space-y-2">
            {cs.outcomes.slice(0, 3).map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  className="w-[6px] h-[6px] rounded-full mt-[7px] shrink-0"
                  style={{ backgroundColor: cs.accentColor }}
                />
                <span className="text-[13px] text-[#4A5568] leading-[1.6]">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: cs.accentColor }}
        >
          {isSelected ? 'Viewing details' : 'View full case study'} <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}

/* ─── Expanded detail panel shown below the grid ─── */
function CaseStudyDetail({ cs }: { cs: CaseStudy }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="h-[6px] w-full" style={{ backgroundColor: cs.accentColor }} />
      <div className="p-8 md:p-10">
        <div className="mb-8">
          <h3 className="text-[24px] md:text-[28px] font-bold text-[#1A202C] leading-tight mb-2">
            {cs.title}
          </h3>
          <p className="text-[16px] text-[#718096] leading-[1.5] italic">
            {cs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="mb-8">
              <h4
                className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3"
                style={{ color: cs.accentColor }}
              >
                The Challenge
              </h4>
              <p className="text-[14px] text-[#4A5568] leading-[1.8]">{cs.challenge}</p>
            </div>
            <div>
              <h4
                className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3"
                style={{ color: cs.accentColor }}
              >
                OXYGY Approach
              </h4>
              <ul className="space-y-2.5">
                {cs.approach.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span
                      className="w-[6px] h-[6px] rounded-full mt-[7px] shrink-0"
                      style={{ backgroundColor: cs.accentColor }}
                    />
                    <span className="text-[14px] text-[#4A5568] leading-[1.7]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="mb-8">
              <h4
                className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3"
                style={{ color: cs.accentColor }}
              >
                Outcome
              </h4>
              <ul className="space-y-3">
                {cs.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="w-[20px] h-[20px] rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white mt-0.5"
                      style={{ backgroundColor: cs.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[14px] text-[#4A5568] leading-[1.7]">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3"
                style={{ color: cs.accentColor }}
              >
                AI Learning Level
              </h4>
              <div className="space-y-3">
                {cs.levelTags.map((tag) => {
                  const colors = LEVEL_COLORS[tag.level];
                  return (
                    <div
                      key={tag.level}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.text}20` }}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em] block mb-1" style={{ color: colors.text }}>
                        {colors.label}
                      </span>
                      <span className="text-[13px] text-[#4A5568] leading-[1.5]">
                        {tag.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Standalone page — vertical card grid */
export const CaseStudiesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedCs = CASE_STUDIES.find((cs) => cs.id === selectedId) || null;
  // Only one card is open at a time. When opening a card closes a panel above it,
  // keep the clicked card where it was on screen instead of letting the page jump.
  const pendingAnchor = useRef<{ id: number; top: number } | null>(null);
  const cardRefs = useRef(new Map<number, HTMLDivElement>());

  useLayoutEffect(() => {
    const anchor = pendingAnchor.current;
    pendingAnchor.current = null;
    const el = anchor && cardRefs.current.get(anchor.id);
    if (!anchor || !el) return;
    const shift = el.getBoundingClientRect().top - anchor.top;
    if (shift !== 0) window.scrollBy(0, shift);
  }, [selectedId]);

  const handleSelect = (id: number, cardTop: number) => {
    pendingAnchor.current = { id, top: cardTop };
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Centered Title */}
        <div className="text-center mb-8">
          <div
            className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: '#E6FFFA', color: '#2C9A94', border: '1px solid #38B2AC' }}
          >
            Real-World Impact
          </div>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15]">
            OXYGY AI{' '}
            <span className="relative inline-block">
              Case Studies
              <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-teal opacity-80 rounded-full"></span>
            </span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#718096] leading-[1.7] max-w-[700px] mx-auto mt-2">
            See how we've partnered with organizations across industries to build real AI capability &mdash; from multi-agent research workflows to interactive dashboards and tailored front-ends.
          </p>
        </div>

        {/* Did You Know? Card */}
        <div
          className="relative rounded-2xl px-8 md:px-12 py-8 text-center overflow-hidden mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(56,178,172,0.15) 0%, rgba(44,154,148,0.08) 50%, rgba(56,178,172,0.12) 100%)',
            border: '1.5px solid #38B2AC',
          }}
        >
          <div className="absolute top-3 left-4 flex gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2C9A94', opacity: 0.4 }} />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B2F5EA', opacity: 0.6 }} />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2C9A94', opacity: 0.3 }} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#2C9A94' }}>
            Did you know?
          </p>
          <p className="text-[17px] md:text-[19px] text-[#2D3748] leading-[1.6] font-medium mb-2 max-w-3xl mx-auto">
            Organizations that combine AI training with{' '}
            <span className="font-bold" style={{ color: '#2C9A94' }}>real project delivery</span>{' '}
            see 4&times; higher adoption rates than those relying on classroom-only programs.
          </p>
          <p className="text-[15px] text-[#718096] leading-[1.6] max-w-3xl mx-auto">
            Every case study below was built as part of a live engagement &mdash; not a hypothetical exercise.
          </p>
        </div>

        {/* 2-column card grid with inline detail after each row */}
        <div className="space-y-6">
          {Array.from({ length: Math.ceil(CASE_STUDIES.length / 2) }, (_, rowIdx) => {
            const rowCards = CASE_STUDIES.slice(rowIdx * 2, rowIdx * 2 + 2);
            const rowHasSelected = rowCards.some((cs) => cs.id === selectedId);
            return (
              <React.Fragment key={rowIdx}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rowCards.map((cs) => (
                    <div
                      key={cs.id}
                      className="flex flex-col [&>*]:flex-grow"
                      ref={(el) => {
                        if (el) cardRefs.current.set(cs.id, el);
                        else cardRefs.current.delete(cs.id);
                      }}
                    >
                      <CaseStudyPageCard
                        cs={cs}
                        isSelected={selectedId === cs.id}
                        onSelect={(top) => handleSelect(cs.id, top)}
                      />
                    </div>
                  ))}
                </div>
                {rowHasSelected && selectedCs && (
                  <CaseStudyDetail cs={selectedCs} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 pt-10 border-t border-slate-100">
          <p className="text-[16px] text-[#4A5568] leading-[1.7]">
            Interested in how OXYGY can help your organization build AI capability?{' '}
            <a
              href="mailto:uk@oxygyconsulting.com"
              className="font-semibold transition-colors"
              style={{ color: '#38B2AC', textDecoration: 'none' }}
            >
              Get in touch
            </a>
          </p>
        <ArtifactClosing
          summaryText="Inspired by what you see? Start building your own AI capability with a personalized learning pathway."
          ctaLabel="Start Your Journey"
          ctaHref="#learning-pathway"
          accentColor="#2C9A94"
        />
        </div>
      </div>
    </div>
  );
};
