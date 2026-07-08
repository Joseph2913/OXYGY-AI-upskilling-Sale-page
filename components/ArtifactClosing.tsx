import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ArtifactClosingProps {
  /** Optional 1-2 sentence summary of what was covered */
  summaryText?: string;
  /** CTA button label, e.g. "Continue to Level 2: Applied Capability" */
  ctaLabel: string;
  /** Hash link for the CTA, e.g. "#agent-builder" */
  ctaHref: string;
  /** The level's dark accent color for the CTA button */
  accentColor: string;
  /** If true, CTA scrolls to a section instead of navigating to a hash page */
  ctaScrollTo?: string;
  /** Optional secondary CTA label, rendered as a bordered secondary button next to the primary CTA */
  secondaryCtaLabel?: string;
  /** Href for the secondary CTA, e.g. a mailto: link */
  secondaryCtaHref?: string;
}

export const ArtifactClosing: React.FC<ArtifactClosingProps> = ({
  summaryText,
  ctaLabel,
  ctaHref,
  accentColor,
  ctaScrollTo,
  secondaryCtaLabel,
  secondaryCtaHref,
}) => {
  const handleCtaClick = (e: React.MouseEvent) => {
    if (ctaScrollTo) {
      e.preventDefault();
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(ctaScrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div
      style={{ borderTop: '1px solid #E2E8F0', paddingTop: '48px' }}
      className="mt-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        {summaryText && (
          <p
            style={{
              fontSize: '15px',
              color: '#718096',
              lineHeight: 1.7,
              marginBottom: '32px',
            }}
          >
            {summaryText}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={ctaHref}
            onClick={ctaScrollTo ? handleCtaClick : undefined}
            className="inline-flex items-center gap-2 text-white font-semibold rounded-full transition-all duration-150 hover:-translate-y-0.5"
            style={{
              backgroundColor: accentColor,
              padding: '14px 28px',
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </a>

          {secondaryCtaLabel && secondaryCtaHref && (
            <a
              href={secondaryCtaHref}
              className="inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-150 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                color: '#1A202C',
                border: '1px solid #1A202C',
                padding: '14px 28px',
                fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              {secondaryCtaLabel}
            </a>
          )}
        </div>

        <div className="mt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#A0AEC0',
              textDecoration: 'none',
            }}
            className="hover:!text-[#38B2AC] transition-colors duration-150"
          >
            &larr; Home
          </a>
        </div>
      </div>
    </div>
  );
};
