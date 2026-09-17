// OXYGY offering catalogue + quadrant-to-offering mapping.
//
// Transcribed from the OXYGY AI Upskilling & Sandbox Capability Deck. Per the source itself: the
// quadrant-to-offering mapping and priority ordering below are inferred to fit the AI Readiness
// Assessment's Innovator Profile Matrix — not stated verbatim in either deck. Treat the pairing of
// "this quadrant → these two offerings" as a first draft, not a finalised rule.

import type { ProfileId } from './innovationReadinessPersonas';

export interface Offering {
  id: string;
  name: string;
  workstream: string;
  challengeQuote: string | null;
  description: string;
  valueDelivered: string[];
}

export const OFFERINGS: Offering[] = [
  {
    id: 'leadership_stakeholder_alignment',
    name: 'Leadership & Stakeholder Alignment Program',
    workstream: 'Structure / Strategy',
    challengeQuote: 'Leadership has set an ambition to implement AI, but there is not defined strategy for implementation, and no aligned purpose or direction',
    description: 'Helps leaders define their AI transformation vision, align it with organisational goals, and translate it into strategic priorities and actionable initiatives. Includes clarifying the Big Y (AI vision), clustering strategic priorities (Little Ys), and mapping AI initiatives (Xs).',
    valueDelivered: [
      'Aligns the leadership team on strategic AI priorities beyond functional silos',
      'Gives the workforce the strategic rationale behind AI projects, avoiding change fatigue',
      'Defines a dashboard of leading KPIs to measure progress',
      'Project management across multiple workstreams to reach the strategic agenda',
    ],
  },
  {
    id: 'capability_development_program',
    name: 'Capability Development Program',
    workstream: 'Skills & Behaviours',
    challengeQuote: 'We have an AI strategy, but the workforce is lacking the right competencies and awareness to maximise the value of AI use cases',
    description: "Identifies the capability needs and gaps in the organisation, tailors training plans to specific roles, and delivers upskilling through OXYGY's bespoke AI Upskilling Platform. Builds a skills matrix from a set of 'digital personas' capturing how different people engage with data flows, then maps individual roles to those personas.",
    valueDelivered: [
      'Identifies distinct types of data users/personas across the organisation',
      'Defines key capability needs and proficiency levels for a data-enabled organisation',
      'Identifies individual capability needs across all roles to support targeted upskilling',
    ],
  },
  {
    id: 'ai_innovation_sandbox',
    name: 'AI Innovation Sandbox (+ Innovation Tender Program)',
    workstream: 'Process / Structure',
    challengeQuote: "We are ready to start designing new use-cases and accelerating existing pilots to a production-ready state, but don't know how to start!",
    description: "Creates an interactive, governed space for innovation and use-case development — a 'glass-box, not black-box' environment where participants can learn, experiment, and innovate with AI in line with the Leadership AGENDA. Governed by an Innovation Tender program that manages use-case development and resourcing.",
    valueDelivered: [
      'Designs and builds a space for teams to use and build AI safely, in line with practical needs',
      'Upskills the whole team according to technical level, data persona, and use-case',
      'Implements an innovation tender program that grows ideas in line with business objectives',
    ],
  },
  {
    id: 'p2p_scale_up_lab',
    name: 'P2P (Pilot-to-Production) Scale-Up Lab',
    workstream: 'Technology / Process',
    challengeQuote: 'Ready to scale proven pilots into production-grade, governed, measurable value',
    description: "Combines enterprise transformation, legal/regulatory, and technical knowledge to help scale prototypes and get them 'production-ready.' Productionises winners, embeds them into the operating model, and governs them responsibly with clear guardrails and oversight.",
    valueDelivered: [
      'Reusable components — each successful pilot becomes a shared asset',
      'Value tracked against original strategic objectives (ROI, payback period)',
      'Responsible-AI guardrails, model/data registry, and risk & bias monitoring in place',
    ],
  },
  {
    id: 'ai_risk_regulatory_compliance_desk',
    name: 'AI Risk & Regulatory Compliance Desk',
    workstream: 'Structure / Governance',
    challengeQuote: null,
    description: 'Delivered with Bird & Bird — a tried-and-tested regulatory sandbox approach that ensures AI systems are compliant and manages risk to the organisation.',
    valueDelivered: [
      'Compliance by design, backed by a leading technology law firm',
      'Supports scaling AI systems without accumulating unmanaged regulatory risk',
    ],
  },
  {
    id: 'process_redesign_prototype_lab',
    name: 'Process Re-Design & Prototype Development Lab',
    workstream: 'Process',
    challengeQuote: null,
    description: 'In-house capability for identifying suitable processes to enhance with AI prototypes, then planning and developing those prototypes with the client.',
    valueDelivered: [
      'Identifies high-value processes suited to AI enhancement',
      'Hands-on prototype development done jointly with client teams',
    ],
  },
];

export interface QuadrantRecommendation {
  quadrantLabel: string;
  axes: { strategicContext: 'high' | 'low'; workEnvironment: 'high' | 'low' };
  primaryOfferingId: string;
  secondaryOfferingId: string;
  narrative: string;
}

export const QUADRANT_RECOMMENDATIONS: Record<ProfileId, QuadrantRecommendation> = {
  'systematic-innovator': {
    quadrantLabel: 'Systematic AI Innovator',
    axes: { strategicContext: 'high', workEnvironment: 'high' },
    primaryOfferingId: 'p2p_scale_up_lab',
    secondaryOfferingId: 'ai_risk_regulatory_compliance_desk',
    narrative: "Strong strategic direction and a healthy innovation environment mean this organisation is ready to move proven pilots into governed, production-grade value rather than keep experimenting.",
  },
  'disconnected-antenna': {
    quadrantLabel: 'Disconnected Antenna',
    axes: { strategicContext: 'high', workEnvironment: 'low' },
    primaryOfferingId: 'ai_innovation_sandbox',
    secondaryOfferingId: 'process_redesign_prototype_lab',
    narrative: "Strategic direction is clear, but there's no safe, structured space for people to actually experiment and turn that direction into use-cases — the sandbox closes that gap.",
  },
  'island-of-creativity': {
    quadrantLabel: 'Island of Creativity',
    axes: { strategicContext: 'low', workEnvironment: 'high' },
    primaryOfferingId: 'leadership_stakeholder_alignment',
    secondaryOfferingId: 'capability_development_program',
    narrative: "Individuals and teams are already experimenting and innovating with AI, but without a clear strategic mandate that energy risks staying fragmented or going unrecognised — alignment connects it to real priorities.",
  },
  'sitting-duck': {
    quadrantLabel: 'Sitting Duck',
    axes: { strategicContext: 'low', workEnvironment: 'low' },
    primaryOfferingId: 'leadership_stakeholder_alignment',
    secondaryOfferingId: 'capability_development_program',
    narrative: "Neither strategic direction nor an innovation-friendly environment is in place yet. Start with leadership alignment to establish purpose and direction, then build capability before introducing sandbox-style experimentation.",
  },
};

export function getOffering(id: string): Offering | undefined {
  return OFFERINGS.find((o) => o.id === id);
}
