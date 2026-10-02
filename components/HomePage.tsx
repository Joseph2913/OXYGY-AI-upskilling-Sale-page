import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ConcentricCircles } from './DriversDiagram';
import { OFFERINGS } from '../data/home-offerings';
import type { Offering } from '../data/home-offerings';
import { Footer } from './Footer';
import { OfferingJourney } from './OfferingJourney';

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const HomeHero: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <section id="hero" className="bg-[#F7FAFC] pt-28 pb-10 md:pt-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center gap-10 md:gap-8">
        <div className="md:w-[45%] shrink-0">
          <span
            className="inline-block uppercase text-[13px] font-semibold rounded-full px-4 py-1.5"
            style={{ border: '1px solid #38B2AC', color: '#38B2AC', letterSpacing: '1.5px' }}
          >
            OXYGY AI Centre of Excellence
          </span>

          <h1 className="mt-5 max-w-[720px] text-[36px] md:text-[52px] font-extrabold text-[#1A202C] leading-[1.15]">
            From AI ambition to{' '}
            <span className="relative inline-block">
              everyday impact
              <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-sm bg-[#38B2AC]" />
            </span>
            .
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] md:text-[17px] text-[#4A5568] leading-[1.7]">
            We help organisations adopt AI with confidence: understanding where they stand, testing what
            works in a safe space, and building the skills to make it part of everyday work.
          </p>

          <a
            href="#offerings"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('offerings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 mt-8 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white bg-[#38B2AC] hover:bg-[#2C9A94] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            Explore Our Offerings <ChevronRight size={16} />
          </a>
        </div>

        <div className="flex-1 flex justify-center mx-auto w-full max-w-[440px] md:max-w-none">
          <ConcentricCircles isMobile={isMobile} />
        </div>
      </div>
    </section>
  );
};

const OfferingCard: React.FC<{ offering: Offering }> = ({ offering }) => {
  const Icon = offering.icon;
  return (
    <div
      className="flex flex-col bg-white rounded-2xl p-8 h-full"
      style={{ border: '1px solid #E2E8F0', borderTop: `4px solid ${offering.accent}` }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <Icon size={22} color="#FFFFFF" />
      </div>
      <h3 className="mt-5 text-[20px] font-bold text-[#1A202C]">{offering.title}</h3>
      <p className="mt-3 flex-1 text-[15px] text-[#718096] leading-[1.7]">{offering.summary}</p>
      <a
        href={offering.href}
        className="mt-6 inline-flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-[14px] font-semibold text-[#1A202C] hover:border-[#38B2AC] hover:text-[#2C9A94] transition-colors"
        style={{ border: '1px solid #E2E8F0', textDecoration: 'none' }}
      >
        {offering.ctaLabel} <ArrowRight size={16} />
      </a>
    </div>
  );
};

const OfferingsSection: React.FC = () => (
  <section id="offerings" className="bg-white pt-12 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A202C] leading-[1.2]">
        One journey, three{' '}
        <span className="relative inline-block">
          offerings
          <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-sm bg-[#38B2AC]" />
        </span>
      </h2>
      <p className="mt-4 max-w-[560px] text-[16px] text-[#4A5568] leading-[1.7]">
        Start wherever you are. Each offering stands on its own, and together they take you from
        first assessment to organisation-wide adoption.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {OFFERINGS.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} />
        ))}
      </div>
    </div>
  </section>
);

/** Homepage: overview of OXYGY's three offerings, each linking to its own page. */
export const HomePage: React.FC = () => (
  <>
    <HomeHero />
    <OfferingsSection />
    <OfferingJourney />
    <Footer
      heading="Not sure where to start?"
      body="Most organisations begin with an AI Readiness assessment. Let's talk about where you stand."
    />
  </>
);
