import React from 'react';
import { AlertTriangle, Clock, Compass, Target, Users, Shield, Trophy, TrendingUp, GraduationCap, FlaskConical, RefreshCw, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PROFILES, Evidence, Offering, ProfileId } from '../readinessData';

const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

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

const OFFERING_ICON: Record<Offering['icon'], LucideIcon> = {
  compass: Compass,
  graduationCap: GraduationCap,
  flask: FlaskConical,
  shield: Shield,
  refresh: RefreshCw,
  broadcast: Share2,
  target: Target,
};

/* Readable per-quadrant accent (mirrors ReadinessAssessment.tsx's EVIDENCE_ACCENT, and doubles as
 * the offering-card accent so this panel reads consistently with the L0 page it's sourced from). */
const QUADRANT_ACCENT: Record<ProfileId, string> = {
  'sitting-duck': '#2D3748',
  'disconnected-antenna': '#2C9A94',
  'island-of-creativity': '#2B4C7E',
  'systematic-innovator': '#B8860B',
};

const OfferingCard: React.FC<{ offering: Offering; accent: string }> = ({ offering, accent }) => {
  const Icon = OFFERING_ICON[offering.icon];
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ backgroundColor: hexA(accent, 0.04), border: `1px solid ${hexA(accent, 0.2)}` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: hexA(accent, 0.15) }}>
          <Icon size={19} style={{ color: accent }} />
        </span>
        <p className="text-[14.5px] font-bold text-[#1A202C] leading-tight">{offering.title}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 self-start text-[10.5px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: hexA(accent, 0.1), color: accent }}>
        <Clock size={11} /> {offering.duration}
      </span>
      <p className="text-[12.5px] text-[#4A5568] leading-[1.55] mb-3">{offering.description}</p>
      <div className="mt-auto rounded-lg p-3" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hexA(accent, 0.2)}` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: accent }}>For you</p>
        <p className="text-[12.5px] text-[#2D3748] leading-[1.5]">{offering.valueAdd}</p>
      </div>
      {offering.href && (
        <a href={offering.href} className="inline-flex items-center gap-1 text-[12px] font-bold mt-3 hover:underline" style={{ color: accent }}>
          Explore this offering &rarr;
        </a>
      )}
    </div>
  );
};

interface RoadmapPanelProps {
  quadrant: ProfileId;
}

/** "Your roadmap" — same content as the org-level AI Readiness Assessment page's Phase 2 section
 * (components/readinessData.ts, PROFILES[].results), reused rather than duplicated: the offerings
 * grid ("Where OXYGY can help"), the rationale, and the guardrails/evidence callout. */
export const RoadmapPanel: React.FC<RoadmapPanelProps> = ({ quadrant }) => {
  const profile = PROFILES.find((p) => p.id === quadrant);
  if (!profile) return null;
  const accent = QUADRANT_ACCENT[quadrant];
  const EvidenceIcon = EVIDENCE_ICON[profile.results.evidence.icon];

  return (
    <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
          Phase 2
        </span>
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A202C]">Your roadmap</h2>
      </div>

      <p className="text-[14px] text-[#4A5568] leading-[1.6] mt-1 mb-6 max-w-[760px]">{profile.results.decisions.rationale}</p>

      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Where OXYGY can help</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {profile.results.offerings.map((o) => (
          <OfferingCard key={o.title} offering={o} accent={accent} />
        ))}
      </div>

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
            <EvidenceIcon size={18} style={{ color: accent }} />
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
