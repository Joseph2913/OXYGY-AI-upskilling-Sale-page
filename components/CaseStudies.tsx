import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, FileSearch, Globe, Users } from 'lucide-react';

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
    id: 1,
    title: 'AI-Driven Market Intelligence Workflow',
    subtitle: 'Turning 30+ Industry Reports into Structured Strategic Insight',
    accentColor: '#C4A934',
    icon: FileSearch,
    challenge:
      'A large digital service provider needed to synthesize insights from over 30 global industry and policy reports to inform growth strategy in a new market. Manual review was time-intensive, inconsistent, and difficult to compare across sources. The client wanted structured insights mapped to PESTLE categories (Political, Economic, Social, Technological, Legal, Environmental) to inform long-term positioning.',
    approach: [
      'Ingestion Agent — Extracted structured insights from each report',
      'Classification Agent — Categorized findings into PESTLE dimensions',
      'Synthesis Agent — Identified cross-report patterns and emerging themes',
      'Validation Layer — Human-in-the-loop review for strategic relevance',
    ],
    outcomes: [
      '60% reduction in analysis time',
      'Standardized PESTLE classification across all reports',
      'Clear identification of high-impact strategic themes',
      'Reusable AI research pipeline for future reports',
    ],
    levelTags: [
      { level: 3, type: 'primary', description: 'AI embedded into a repeatable intelligence workflow with feedback loops.' },
      { level: 2, type: 'secondary', description: 'Custom agent architecture built for a specific strategic use case.' },
    ],
  },
  {
    id: 2,
    title: 'AIFOD Conference Intelligence Dashboard',
    subtitle: 'Building an Interactive AI Policy Intelligence Tool for a Global Conference',
    accentColor: '#D47B5A',
    icon: Globe,
    challenge:
      'Before the AIFOD conference, OXYGY wanted an interactive way to engage the audience by showing them synthesized results of research and policy documents. The goal was to present a structural framework for understanding AI policy production across the Global South — moving beyond aggregate rankings to benchmark the unique governance architectures, infrastructure gaps, and human capital strategies of emerging nations. The tool included an interactive map with AI readiness classifications based on studies from the University of Oxford and the World Bank.',
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
  {
    id: 3,
    title: 'HR AI Persona Matching & Service Alignment Tool',
    subtitle: 'From Survey Data to Personalized AI Enablement Pathways',
    accentColor: '#2C9A94',
    icon: Users,
    challenge:
      'OXYGY developed distinct HR AI personas to represent different ambitions, maturity levels, and barriers among HR leaders. The challenge was then to use survey data and AI agents to accurately pair each respondent with the appropriate persona and translate that into tailored service pathways and engagement strategies.',
    approach: [
      'Survey Response Analysis Agent — Clustered HR leaders by goals, risk appetite, and innovation readiness; identified latent patterns in qualitative responses',
      'Service Matching Logic — Mapped personas to specific OXYGY services; generated tailored recommendations aligned to strategic goals',
      'Personalized Feedback Reports — Each HR leader received a summary of their persona with recommended next steps and service pathways',
    ],
    outcomes: [
      'Transformed static survey into a strategic engagement engine',
      'Increased relevance of OXYGY service positioning',
      'Enabled personalized follow-up conversations',
      'Strengthened thought leadership positioning in HR AI',
    ],
    levelTags: [
      { level: 3, type: 'primary', description: 'Integrated survey analysis, classification logic, and recommendation engine into one workflow.' },
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

/* ─── Expandable case study card for standalone page ─── */
function CaseStudyExpandableCard({ cs, isExpanded, onToggle }: { cs: CaseStudy; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300"
      style={{ borderColor: isExpanded ? cs.accentColor : undefined }}
    >
      <div className="h-[6px] w-full" style={{ backgroundColor: cs.accentColor }} />

      {/* Collapsed header — always visible, clickable */}
      <div
        className="p-6 md:p-8 cursor-pointer flex items-start gap-5"
        onClick={onToggle}
      >
        {/* Icon */}
        <div
          className="shrink-0 w-[48px] h-[48px] rounded-xl flex items-center justify-center mt-0.5 hidden md:flex"
          style={{ backgroundColor: `${cs.accentColor}14` }}
        >
          <cs.icon size={24} strokeWidth={1.5} style={{ color: cs.accentColor }} />
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap gap-1.5 mb-3">
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
          <h3 className="text-[20px] md:text-[24px] font-bold text-[#1A202C] leading-tight mb-1.5">
            {cs.title}
          </h3>
          <p className="text-[14px] md:text-[15px] text-[#718096] leading-[1.5] italic mb-3">
            {cs.subtitle}
          </p>

          {/* Outcome preview chips — visible when collapsed */}
          {!isExpanded && (
            <div className="flex flex-wrap gap-2 mt-1">
              {cs.outcomes.slice(0, 2).map((outcome, idx) => (
                <span
                  key={idx}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${cs.accentColor}12`, color: cs.accentColor }}
                >
                  {outcome}
                </span>
              ))}
              {cs.outcomes.length > 2 && (
                <span
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#F0F2F5', color: '#718096' }}
                >
                  +{cs.outcomes.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 mt-1"
          style={{
            backgroundColor: isExpanded ? cs.accentColor : '#F0F2F5',
            color: isExpanded ? '#FFFFFF' : '#718096',
          }}
        >
          <ChevronDown
            size={18}
            className="transition-transform duration-300"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      {/* Expanded content */}
      <div
        className="transition-all duration-400 ease-in-out overflow-hidden"
        style={{
          maxHeight: isExpanded ? '1200px' : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="px-6 md:px-8 pb-8 md:pb-10">
          <div className="h-px bg-slate-100 w-full mb-8" />

          {/* Content in two columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column */}
            <div>
              {/* The Challenge */}
              <div className="mb-8">
                <h4
                  className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3"
                  style={{ color: cs.accentColor }}
                >
                  The Challenge
                </h4>
                <p className="text-[14px] text-[#4A5568] leading-[1.8]">{cs.challenge}</p>
              </div>

              {/* OXYGY Approach */}
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

            {/* Right Column */}
            <div>
              {/* Outcomes */}
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

              {/* AI Learning Level Tags */}
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
    </div>
  );
}

/** Homepage section — condensed cards */
export const CaseStudiesSection: React.FC = () => {
  return (
    <section id="case-studies-section" className="py-24 bg-[#F7FAFC] border-t border-gray-100">
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
            Real examples of how OXYGY has helped organisations build AI capability
            — from multi-agent research workflows to interactive dashboards and tailored front-ends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((cs) => (
            <CaseStudySummaryCard key={cs.id} cs={cs} />
          ))}
        </div>
      </div>
    </section>
  );
};

/** Standalone page — expandable case studies */
export const CaseStudiesPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#718096] hover:text-[#38B2AC] transition-colors mb-10"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </a>

        {/* Centered Title */}
        <div className="text-center mb-6">
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15]">
            OXYGY AI{' '}
            <span className="relative inline-block">
              Case Studies
              <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-teal opacity-80 rounded-full"></span>
            </span>
          </h1>
        </div>

        <p className="text-center text-[16px] md:text-[18px] text-[#718096] leading-[1.7] max-w-[680px] mx-auto mb-16">
          See how we've partnered with organisations across industries to build real AI capability — from multi-agent research workflows to interactive dashboards and tailored front-ends.
        </p>

        {/* Expandable Case Study Cards — stacked */}
        <div className="space-y-4">
          {CASE_STUDIES.map((cs) => (
            <CaseStudyExpandableCard
              key={cs.id}
              cs={cs}
              isExpanded={expandedId === cs.id}
              onToggle={() => toggleCard(cs.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
