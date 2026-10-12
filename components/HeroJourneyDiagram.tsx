import React from 'react';
import { JOURNEY } from '../data/home-offerings';
import type { Offering } from '../data/home-offerings';
import { ConcentricCircles } from './DriversDiagram';

const OfferingCircle: React.FC<{ offering: Offering }> = ({ offering }) => {
  const Icon = offering.icon;
  return (
    <a
      href={offering.href}
      className="group flex flex-col items-center gap-1"
      style={{ textDecoration: 'none' }}
    >
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
        style={{ backgroundColor: '#1E3A5F', boxShadow: `0 0 0 3px ${offering.accent}` }}
        aria-hidden="true"
      >
        <Icon size={18} color="#FFFFFF" />
      </span>
      <span className="text-[11px] font-bold text-[#1A202C] leading-tight whitespace-nowrap group-hover:text-[#2C9A94] transition-colors">
        {offering.title}
      </span>
    </a>
  );
};

/** The three offerings as circles in a triangle, shown at the heart of the rings. */
const OfferingCircles: React.FC = () => {
  const [first, ...rest] = JOURNEY;
  return (
    <div className="flex flex-col items-center gap-2" aria-label="OXYGY offerings">
      <OfferingCircle offering={first} />
      <div className="flex w-full justify-between">
        {rest.map((offering) => (
          <OfferingCircle key={offering.id} offering={offering} />
        ))}
      </div>
    </div>
  );
};

/**
 * Hero diagram: the orbiting rings of what your people bring (inner) and
 * what we provide (outer), surrounding the three offerings.
 */
export const HeroJourneyDiagram: React.FC = () => (
  <ConcentricCircles isMobile={false} center={<OfferingCircles />} />
);
