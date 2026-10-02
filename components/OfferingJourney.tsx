import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { JOURNEY } from '../data/home-offerings';
import type { Offering } from '../data/home-offerings';
import { OFFERING_ILLUSTRATIONS } from './OfferingIllustrations';

interface JourneyStepProps {
  offering: Offering;
  index: number;
  isLast: boolean;
}

const JourneyStep: React.FC<JourneyStepProps> = ({ offering, index, isLast }) => {
  const Icon = offering.icon;
  const Illustration = OFFERING_ILLUSTRATIONS[offering.id];
  return (
    <li className="flex gap-5 md:gap-8">
      {/* Node + connector to the next step */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#1E3A5F' }}
          aria-hidden="true"
        >
          <Icon size={22} color="#FFFFFF" />
        </div>
        {!isLast && (
          <div className="flex flex-1 flex-col items-center" aria-hidden="true">
            <div className="flex-1 w-[2px] bg-[#CBD5E0]" />
            <ChevronDown size={20} className="-mt-1.5 text-[#A0AEC0]" />
          </div>
        )}
      </div>

      {/* Step card */}
      <div
        className={`flex-1 flex items-start gap-6 bg-white rounded-2xl p-6 md:p-7 ${isLast ? '' : 'mb-10'}`}
        style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${offering.accent}` }}
      >
        <div className="flex-1 min-w-0 max-w-[680px]">
          <h3 className="text-[20px] font-bold text-[#1A202C]">
            <span className="text-[#A0AEC0]">{String(index + 1).padStart(2, '0')}.</span>{' '}
            {offering.title}
          </h3>
          <p className="mt-1.5 text-[16px] font-semibold text-[#2D3748]">{offering.tagline}</p>
          <p className="mt-3 text-[15px] text-[#4A5568] leading-[1.7]">{offering.description}</p>
          <ul className="mt-4 space-y-2.5">
            {offering.steps.map((step) => (
              <li key={step.label} className="flex gap-2.5 text-[15px] text-[#4A5568] leading-[1.6]">
                <span
                  className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: '#38B2AC' }}
                />
                <span>
                  <strong className="font-semibold text-[#1A202C]">{step.label}:</strong> {step.text}
                </span>
              </li>
            ))}
          </ul>
          <a
            href={offering.href}
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1A202C] hover:text-[#2C9A94] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            Learn more <ArrowRight size={15} />
          </a>
        </div>
        {Illustration && <Illustration className="hidden sm:block ml-auto w-[140px] md:w-[180px] shrink-0" />}
      </div>
    </li>
  );
};

/** Vertical diagram showing how the three offerings connect: Readiness → Sandbox → Upskilling. */
export const OfferingJourney: React.FC = () => (
  <section id="how-it-connects" className="bg-white pt-12 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A202C] leading-[1.2]">
        How it all{' '}
        <span className="relative inline-block">
          connects
          <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-sm bg-[#38B2AC]" />
        </span>
      </h2>
      <p className="mt-4 max-w-[560px] text-[16px] text-[#4A5568] leading-[1.7]">
        Each offering builds on the last, so every step starts from a stronger position.
      </p>

      <ol className="mt-12">
        {JOURNEY.map((offering, i) => (
          <JourneyStep
            key={offering.id}
            offering={offering}
            index={i}
            isLast={i === JOURNEY.length - 1}
          />
        ))}
      </ol>
    </div>
  </section>
);
