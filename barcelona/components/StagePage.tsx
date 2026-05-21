import { useState } from 'react';
import type { FrameMeta } from '../types';
import { useHashState } from '../hooks/useHashState';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { Cockpit } from './Cockpit';
import { BackgroundMesh } from './BackgroundMesh';

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
    <div className="relative min-h-screen w-full bg-stage-base text-stage-white overflow-hidden">
      {/* Atmospheric background — sits behind frame content */}
      <BackgroundMesh />

      {/* Frame content */}
      <main className="relative z-10 min-h-screen w-full">
        <FrameComponent />
      </main>

      {/* Brand mark — bottom-left, low opacity */}
      <div className="absolute left-8 bottom-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur/60 select-none pointer-events-none">
        OXYGY × Working Futures — {dayLabel}
      </div>

      {/* Frame counter — bottom-right, low opacity */}
      <div className="absolute right-8 bottom-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur/60 select-none pointer-events-none">
        {String(frameIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
      </div>

      {/* Optional per-frame timer badge */}
      {timerOn && (
        <div className="absolute right-8 top-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-teal/80 border border-teal/40 px-3 py-1.5 rounded-full">
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
