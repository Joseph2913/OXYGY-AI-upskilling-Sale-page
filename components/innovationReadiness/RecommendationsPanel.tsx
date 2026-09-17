import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProfileId } from '../../data/innovationReadinessPersonas';
import { QUADRANT_RECOMMENDATIONS, getOffering, Offering } from '../../data/innovationReadinessOfferings';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';
const SECONDARY = '#A0AEC0';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Collapsed by default — just the title and workstream — since three of these plus a narrative
 * was too much text to take in at once. Click to expand the quote/description/value bullets. */
const OfferingCard: React.FC<{ offering: Offering; tag: string; accent: string }> = ({ offering, tag, accent }) => {
  const [open, setOpen] = useState(false);
  const tagColor = accent === SECONDARY ? '#4A5568' : accent;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${hexA(accent, 0.28)}`, backgroundColor: hexA(accent, 0.05) }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full" style={{ backgroundColor: hexA(accent, 0.14), color: tagColor }}>
              {tag}
            </span>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#A0AEC0]">{offering.workstream}</p>
          </div>
          <p className="text-[18px] font-bold text-[#1A202C] leading-tight">{offering.name}</p>
        </div>
        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: hexA(accent, open ? 0.18 : 0.1) }}>
          <ChevronDown size={15} style={{ color: accent === SECONDARY ? '#4A5568' : accent, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {offering.challengeQuote && <p className="text-[12.5px] italic text-[#4A5568] leading-[1.5] mb-2.5">&ldquo;{offering.challengeQuote}&rdquo;</p>}
          <p className="text-[12.5px] text-[#4A5568] leading-[1.55] mb-3">{offering.description}</p>
          <ul className="space-y-1.5">
            {offering.valueDelivered.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-[#2D3748] leading-[1.5]">
                <span className="shrink-0 mt-[6px] w-1 h-1 rounded-full" style={{ backgroundColor: accent === SECONDARY ? '#A0AEC0' : accent }} />
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

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Recommended offerings</p>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
          {rec.quadrantLabel}
        </span>
      </div>
      <p className="text-[13px] text-[#4A5568] leading-[1.6] mb-4">{rec.narrative}</p>
      <div className="space-y-3">
        <OfferingCard offering={primary} tag="Primary" accent={ACCENT} />
        <OfferingCard offering={secondary} tag="Secondary" accent={SECONDARY} />
      </div>
    </div>
  );
};
