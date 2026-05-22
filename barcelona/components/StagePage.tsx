import { useState } from 'react';
import type { FrameMeta } from '../types';
import { useHashState } from '../hooks/useHashState';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { Cockpit } from './Cockpit';
import { OxygyLogo } from './OxygyLogo';

interface StagePageProps {
  routeKey: string;
  dayLabel: string;
  frames: FrameMeta[];
}

export function StagePage({ routeKey, dayLabel, frames }: StagePageProps) {
  const maxIndex = frames.length - 1;
  const [frameIndex, setFrameIndex] = useHashState(routeKey, maxIndex);
  const [cockpitOpen, setCockpitOpen] = useState(false);
  const [timerOn, setTimerOn] = useState(false);

  useKeyboardNav({
    onNext: () => setFrameIndex(frameIndex + 1),
    onPrev: () => setFrameIndex(frameIndex - 1),
    onFirst: () => setFrameIndex(0),
    onLast: () => setFrameIndex(maxIndex),
    onToggleCockpit: () => setCockpitOpen((open) => !open),
    onToggleTimer: () => setTimerOn((on) => !on),
  });

  const currentFrame = frames[frameIndex];
  const FrameComponent = currentFrame.component;

  return (
    <div className="relative h-screen w-full bg-white text-navy-900 overflow-hidden">
      {/* Frame content */}
      <main className="relative z-10 h-screen w-full">
        <FrameComponent />
      </main>

      {/* Brand mark — bottom-left, OXYGY logo only on non-title frames */}
      {frameIndex > 0 && (
        <div className="absolute left-8 bottom-7 z-20 select-none pointer-events-none flex items-center gap-3 text-navy-600">
          <OxygyLogo variant="wordmark" className="h-[18px] text-navy-800" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
            {dayLabel}
          </span>
        </div>
      )}

      {/* Frame counter — bottom-right, low opacity */}
      <div className="absolute right-8 bottom-8 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-navy-500 select-none pointer-events-none">
        {String(frameIndex + 1).padStart(2, '0')} <span className="text-navy-400">·</span> {String(frames.length).padStart(2, '0')}
      </div>

      {/* Optional per-frame timer badge */}
      {timerOn && (
        <div className="absolute right-8 top-8 z-20 font-mono text-[11px] uppercase tracking-[0.2em] text-teal-dark border border-teal/50 bg-teal-pale px-3 py-1.5 rounded-full">
          {currentFrame.targetMinutes} min target
        </div>
      )}

      {cockpitOpen && (
        <Cockpit
          frames={frames}
          currentIndex={frameIndex}
          onJumpTo={setFrameIndex}
          onClose={() => setCockpitOpen(false)}
        />
      )}
    </div>
  );
}
