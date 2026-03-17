import React from 'react';

export const PartnershipBanner: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#E6FFFA',
        padding: '12px 0',
      }}
    >
      <div className="flex items-center justify-center gap-3">
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#718096',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          In partnership with
        </span>
        <img
          src="/logos/tools/WF24_Positive RGB.png"
          alt="Working Futures"
          style={{ height: '22px', width: 'auto' }}
        />
      </div>
    </div>
  );
};
