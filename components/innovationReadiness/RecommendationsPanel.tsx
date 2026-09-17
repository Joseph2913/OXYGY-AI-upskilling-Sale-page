import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { QUADRANT_INFO, ProfileId } from '../../data/innovationReadinessPersonas';
import { QUADRANT_RECOMMENDATIONS, getOffering, Offering } from '../../data/innovationReadinessOfferings';

/* Brand teal — used for the secondary offering so it reads distinctly from the quadrant's own
 * colour on the primary card, instead of falling back to a flat grey. */
const TEAL = '#2C9A94';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Collapsed by default — title, workstream and the challenge quote stay visible; only the
 * description and value-delivered bullets sit behind the click-to-expand toggle. */
const OfferingCard: React.FC<{ offering: Offering; tag: string; accent: string }> = ({ offering, tag, accent }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${hexA(accent, 0.35)}`, backgroundColor: hexA(accent, 0.08) }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: accent }}>
              {tag}
            </span>
            <p className="text-[12px] font-semibold uppercase tracking-[0.05em]" style={{ color: accent }}>{offering.workstream}</p>
          </div>
          <p className="text-[20px] font-bold text-[#1A202C] leading-tight mb-2">{offering.name}</p>
          {offering.challengeQuote && <p className="text-[14px] italic text-[#4A5568] leading-[1.55]">&ldquo;{offering.challengeQuote}&rdquo;</p>}
        </div>
        <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: hexA(accent, open ? 0.28 : 0.16) }}>
          <ChevronDown size={16} style={{ color: accent, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="text-[13.5px] text-[#4A5568] leading-[1.6] mb-3">{offering.description}</p>
          <ul className="space-y-2">
            {offering.valueDelivered.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#2D3748] leading-[1.55]">
                <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface RecommendationsPanelProps {
  quadrant: ProfileId;
}

/** Tailored offering recommendations for a quadrant, from the OXYGY offering catalogue
 * (data/innovationReadinessOfferings.ts). Sits under the category breakdown on the results
 * dashboard, superseding the earlier free-text placeholder recommendations. */
export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ quadrant }) => {
  const rec = QUADRANT_RECOMMENDATIONS[quadrant];
  const primary = getOffering(rec.primaryOfferingId);
  const secondary = getOffering(rec.secondaryOfferingId);
  if (!primary || !secondary) return null;

  const quadrantColor = QUADRANT_INFO[quadrant].color;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: `linear-gradient(135deg, ${hexA(quadrantColor, 0.1)} 0%, ${hexA(quadrantColor, 0.03)} 60%)`, border: `1.5px solid ${hexA(quadrantColor, 0.3)}` }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Recommended offerings</p>
        <span className="text-[11.5px] font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: quadrantColor }}>
          {rec.quadrantLabel}
        </span>
      </div>
      <p className="text-[14.5px] text-[#4A5568] leading-[1.6] mb-4">{rec.narrative}</p>
      <div className="space-y-3">
        <OfferingCard offering={primary} tag="Primary" accent={quadrantColor} />
        <OfferingCard offering={secondary} tag="Secondary" accent={TEAL} />
      </div>
    </div>
  );
};
