import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Compass, FlaskConical } from 'lucide-react';

export interface JourneyStep {
  label: string;
  text: string;
}

export interface Offering {
  id: string;
  icon: LucideIcon;
  /** Light accent used for the icon circle and card top border */
  accent: string;
  title: string;
  /** Short summary shown on the homepage offering card */
  summary: string;
  ctaLabel: string;
  href: string;
  /** Short headline shown under the title in the journey diagram */
  tagline: string;
  /** One-sentence description shown in the journey diagram */
  description: string;
  /** Labelled steps shown in the journey diagram */
  steps: readonly JourneyStep[];
}

export const OFFERINGS: readonly Offering[] = [
  {
    id: 'upskilling',
    icon: GraduationCap,
    accent: '#38B2AC',
    title: 'AI Upskilling',
    summary: 'Build the role-specific AI skills that turn adoption into everyday practice.',
    ctaLabel: 'Explore Upskilling',
    href: '#upskilling',
    tagline: 'Make adoption stick across the organisation.',
    description:
      'Our AI Upskilling Platform gives each person the skills that matter for their role, so AI becomes part of how work gets done.',
    steps: [
      {
        label: 'Map',
        text: 'We identify capability needs by role, using personas and a tailored skills matrix.',
      },
      {
        label: 'Learn by doing',
        text: 'We deliver personalised learning plans that combine hands-on platform exercises with workshops and coaching led by OXYGY.',
      },
    ],
  },
  {
    id: 'ai-readiness',
    icon: Compass,
    accent: '#C3D0F5',
    title: 'AI Readiness',
    summary: 'Find out how ready your organisation really is for AI, and where to focus first.',
    ctaLabel: 'Explore AI Readiness',
    href: '#ai-readiness',
    tagline: 'Know where you stand before you build.',
    description:
      'We assess how ready your organisation is for AI, so that every initiative starts from a realistic baseline instead of inflated expectations.',
    steps: [
      {
        label: 'Assess',
        text: 'We score your organisation on a matrix of strategic context and work environment, to show where it stands today.',
      },
      {
        label: 'Prioritise',
        text: 'We turn the findings into a clear scope of the functions, processes and use cases most ready for AI.',
      },
    ],
  },
  {
    id: 'ai-sandbox',
    icon: FlaskConical,
    accent: '#FBE8A6',
    title: 'AI Sandbox',
    summary: 'Give your teams a safe, governed space to turn priority use cases into working solutions.',
    ctaLabel: 'Explore the Sandbox',
    href: '#innovation-sandbox',
    tagline: 'Turn priorities into working use cases.',
    description:
      'A safe and transparent space where your teams experiment with AI and build solutions tied to your business objectives.',
    steps: [
      {
        label: 'Set up',
        text: 'We design the Sandbox with a clear mandate, scope and governance, so people can innovate safely.',
      },
      {
        label: 'Build and scale',
        text: 'Teams take high-value use cases from idea to proof of concept to pilot. An innovation tender process then moves the strongest ones into day-to-day operations.',
      },
    ],
  },
];

/** Order the offerings connect in: assess readiness → experiment in the sandbox → scale through upskilling. */
const JOURNEY_ORDER = ['ai-readiness', 'ai-sandbox', 'upskilling'] as const;

export const JOURNEY: readonly Offering[] = JOURNEY_ORDER.map((id) => {
  const offering = OFFERINGS.find((o) => o.id === id);
  if (!offering) throw new Error(`Unknown offering in JOURNEY_ORDER: ${id}`);
  return offering;
});
