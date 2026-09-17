import React from 'react';
import { AlertTriangle, Compass, Target, Users, Shield, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PROFILES, Evidence, ProfileId } from '../readinessData';
import { QUADRANT_RECOMMENDATIONS, getOffering } from '../../data/innovationReadinessOfferings';

const ACCENT = '#2B4C7E';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const EVIDENCE_ICON: Record<Evidence['icon'], LucideIcon> = {
  compass: Compass,
  target: Target,
  users: Users,
  shield: Shield,
  warning: AlertTriangle,
  trophy: Trophy,
  'trending-up': TrendingUp,
};

/* Readable per-quadrant accent for the evidence callout text (mirrors ReadinessAssessment.tsx). */
const EVIDENCE_ACCENT: Record<ProfileId, string> = {
  'sitting-duck': '#2D3748',
  'disconnected-antenna': '#2C9A94',
  'island-of-creativity': '#2B4C7E',
  'systematic-innovator': '#B8860B',
};

interface RoadmapPanelProps {
  quadrant: ProfileId;
}

/** "Your roadmap" — rationale, guardrails and a supporting evidence citation for a quadrant.
 * Reuses the content already written for the org-level AI Readiness Assessment page
 * (components/readinessData.ts, PROFILES[].results.decisions/evidence) rather than duplicating it,
 * since both features describe the same four-quadrant matrix. */
export const RoadmapPanel: React.FC<RoadmapPanelProps> = ({ quadrant }) => {
  const profile = PROFILES.find((p) => p.id === quadrant);
  if (!profile) return null;
  const accent = EVIDENCE_ACCENT[quadrant];
  const Icon = EVIDENCE_ICON[profile.results.evidence.icon];

  // Primary offering (from data/innovationReadinessOfferings.ts) that this roadmap opens with —
  // ties the "what to do" of Recommendations to the "why now, why not yet" of the roadmap below.
  const primaryOffering = getOffering(QUADRANT_RECOMMENDATIONS[quadrant].primaryOfferingId);

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Your roadmap</p>

      {primaryOffering && (
        <div className="flex items-start gap-3 rounded-xl p-4 mb-4" style={{ backgroundColor: hexA(ACCENT, 0.06), border: `1px solid ${hexA(ACCENT, 0.22)}` }}>
          <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(ACCENT, 0.15) }}>
            <Sparkles size={18} style={{ color: ACCENT }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: ACCENT }}>Start here &mdash; primary offering</p>
            <p className="text-[13.5px] font-bold text-[#1A202C] leading-tight">{primaryOffering.name}</p>
            <p className="text-[12px] text-[#4A5568] leading-[1.5] mt-1">{primaryOffering.description}</p>
          </div>
        </div>
      )}

      <p className="text-[13px] text-[#4A5568] leading-[1.6] mb-4">{profile.results.decisions.rationale}</p>

      <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: '#C53030' }} />
          <p className="text-[13.5px] font-bold" style={{ color: '#C53030' }}>Guardrails &mdash; what not to do right now</p>
        </div>
        <ul className="space-y-2 mb-4">
          {profile.results.decisions.guardrails.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#742A2A] leading-[1.5]">
              <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C53030' }} />
              <span>{g}</span>
            </li>
          ))}
        </ul>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: '#C53030' }}>Why this matters</p>
        <div className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: hexA(accent, 0.06), border: `1px solid ${hexA(accent, 0.22)}` }}>
          <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(accent, 0.13) }}>
            <Icon size={18} style={{ color: accent }} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] leading-[1.5] text-[#2D3748]">
              <span className="font-bold" style={{ color: accent }}>{profile.results.evidence.figure}</span> {profile.results.evidence.statement}
            </p>
            <p className="text-[11px] text-[#A0AEC0] mt-1.5">Source: {profile.results.evidence.source}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
