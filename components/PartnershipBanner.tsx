import React from 'react';

const LOGOS = [
  { src: '/logos/tools/WF24_Positive RGB.png', alt: 'Working Futures' },
];

export const PartnershipBanner: React.FC = () => {
  /* 20 logos per half — plenty to fill any screen width */
  const set = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#E6FFFA',
        overflow: 'hidden',
        padding: '10px 0',
      }}
    >
      <div className="flex items-center justify-center gap-6" style={{ flexWrap: 'nowrap' }}>
        {/* Static label */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#718096',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Our HR Advisory Partner
        </span>

        {/* Scrolling logo track with fade edges */}
        <div
          style={{
            overflow: 'hidden',
            flexShrink: 1,
            flexGrow: 1,
            maxWidth: '600px',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* Two identical sets for seamless loop */}
          <div
            className="partnership-scroll"
            style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
          >
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center" style={{ gap: '48px', paddingRight: '48px' }}>
                {set.map((i) => (
                  <img
                    key={`${half}-${i}`}
                    src={LOGOS[0].src}
                    alt={LOGOS[0].alt}
                    style={{ height: '22px', width: 'auto', flexShrink: 0 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes partnerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partnership-scroll {
          animation: partnerScroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};
