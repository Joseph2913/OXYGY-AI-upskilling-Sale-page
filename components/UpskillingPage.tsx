import React from 'react';
import { Hero } from './Hero';
import { PartnershipBanner } from './PartnershipBanner';
import { LevelJourney } from './LevelJourney';
import { PersonaCarousel } from './PersonaCarousel';
import { LearningModel } from './Extras';
import { CaseStudiesSection } from './CaseStudies';
import { Footer } from './Footer';

/** The five-level AI upskilling programme — formerly the homepage. */
export const UpskillingPage: React.FC = () => (
  <>
    <Hero />
    <PartnershipBanner />
    <LevelJourney />
    <PersonaCarousel />
    <LearningModel />
    <CaseStudiesSection />
    <Footer />
  </>
);
