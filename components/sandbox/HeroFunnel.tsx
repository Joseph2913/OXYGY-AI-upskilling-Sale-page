import React from 'react';
import { Lightbulb, FlaskConical, Rocket } from 'lucide-react';
import { HERO_CHIPS, REDUCED_MOTION, SBX_ACCENT, SBX_TEAL, hexA } from '../sandboxData';

/* Fixed stage geometry: three zones of decreasing height (the narrowing IS the
   funnel), chips travel left → right along fixed lanes. Distances are passed to
   the keyframes as CSS custom properties (--sbx-x1 / --sbx-x2). */
const ZONE_W = 132; // px, width of each zone column
const ZONE_GAP = 14; // px, gap between zones
const X1 = ZONE_W + ZONE_GAP; // travel to the Sandbox zone
const X2 = (ZONE_W + ZONE_GAP) * 2; // travel to the Production zone

const LANE_TOPS = [64, 118, 172, 226, 280]; // px, one lane per chip

interface ZoneProps {
  label: string;
  icon: React.ReactNode;
  height: number;
  border: string;
  dashed?: boolean;
  children?: React.ReactNode;
}

const Zone: React.FC<ZoneProps> = ({ label, icon, height, border, dashed, children }) => (
  <div className="flex flex-col items-center" style={{ width: ZONE_W }}>
    <div
      className="w-full rounded-2xl relative"
      style={{
        height,
        border: dashed ? `1.5px dashed ${border}` : `1.5px solid ${border}`,
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="absolute top-3 left-0 right-0 flex flex-col items-center gap-1">
        {icon}
        <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#718096]">{label}</span>
      </div>
      {children}
    </div>
  </div>
);

/* Static chip used by the reduced-motion / small-screen fallback frame */
const StaticChip: React.FC<{ label: string; state: 'idea' | 'out' | 'live' }> = ({ label, state }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
    style={
      state === 'live'
        ? { backgroundColor: SBX_TEAL, border: `1.5px solid ${SBX_TEAL}`, color: '#FFFFFF' }
        : state === 'out'
          ? { backgroundColor: '#F7FAFC', border: '1.5px dashed #CBD5E0', color: '#A0AEC0' }
          : { backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E0', color: '#4A5568' }
    }
  >
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: state === 'live' ? '#FFFFFF' : state === 'out' ? '#CBD5E0' : '#A0AEC0' }}
    />
    {label}
  </span>
);

/* Reduced-motion fallback: same stage, chips statically distributed so the
   static frame still tells the whole story. */
const StaticFrame: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {[
      { label: 'Ideas', border: '#CBD5E0', dashed: true, icon: <Lightbulb size={15} className="text-[#A0AEC0]" />, chips: [<StaticChip key="a" label={HERO_CHIPS[0].label} state="idea" />, <StaticChip key="b" label={HERO_CHIPS[1].label} state="idea" />] },
      { label: 'Sandbox', border: SBX_ACCENT, dashed: false, icon: <FlaskConical size={15} style={{ color: SBX_ACCENT }} />, chips: [<StaticChip key="c" label={HERO_CHIPS[2].label} state="idea" />, <StaticChip key="d" label={HERO_CHIPS[3].label} state="out" />] },
      { label: 'Production', border: SBX_TEAL, dashed: false, icon: <Rocket size={15} style={{ color: SBX_TEAL }} />, chips: [<StaticChip key="e" label={HERO_CHIPS[4].label} state="live" />] },
    ].map((zone) => (
      <div key={zone.label} className="rounded-2xl p-3 flex flex-col items-center gap-2" style={{ border: zone.dashed ? `1.5px dashed ${zone.border}` : `1.5px solid ${zone.border}`, backgroundColor: '#FFFFFF' }}>
        {zone.icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#718096]">{zone.label}</span>
        <div className="flex flex-col items-center gap-1.5">{zone.chips}</div>
      </div>
    ))}
  </div>
);

export const HeroFunnel: React.FC = () => {
  if (REDUCED_MOTION) {
    return (
      <div className="rounded-2xl p-5" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
        <StaticFrame />
        <p className="text-[11.5px] text-[#A0AEC0] text-center mt-3 leading-[1.5]">
          Ideas enter, the sandbox filters, the best go live.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      {/* Animated stage on sm+; compact static frame on the smallest screens */}
      <div className="hidden sm:block">
        <div className="relative mx-auto" style={{ width: ZONE_W * 3 + ZONE_GAP * 2, height: 340 }}>
          {/* Zones */}
          <div className="absolute inset-0 flex items-start" style={{ gap: ZONE_GAP }}>
            <Zone label="Ideas" height={340} border="#CBD5E0" dashed icon={<Lightbulb size={16} className="text-[#A0AEC0]" />} />
            <Zone label="Sandbox" height={280} border={SBX_ACCENT} icon={<FlaskConical size={16} style={{ color: SBX_ACCENT }} />} />
            <Zone label="Production" height={220} border={SBX_TEAL} icon={<Rocket size={16} style={{ color: SBX_TEAL }} />}>
              <span
                className="sbx-live-badge absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: SBX_TEAL }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
              </span>
              <span className="absolute bottom-3 left-0 right-0 text-center text-[10.5px] font-semibold" style={{ color: SBX_TEAL }}>
                3 of 5 live
              </span>
            </Zone>
          </div>

          {/* Travelling chips — one 9s loop, staggered so the conveyor never sits idle */}
          {HERO_CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className={`absolute inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${chip.outcome === 'live' ? 'sbx-chip-live' : 'sbx-chip-out'}`}
              style={{
                left: 10,
                top: LANE_TOPS[i],
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E0',
                color: '#4A5568',
                opacity: 0,
                animationDelay: `${i * 1.8}s`,
                ['--sbx-x1' as string]: `${X1}px`,
                ['--sbx-x2' as string]: `${X2}px`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: hexA(SBX_ACCENT, 0.5) }} />
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <StaticFrame />
      </div>

      <p className="text-[11.5px] text-[#A0AEC0] text-center mt-3 leading-[1.5]">
        Ideas enter, the sandbox filters, the best go live.
      </p>
    </div>
  );
};
