import { useState } from 'react';
import type { FrameMeta } from '../types';
import { useHashState } from '../hooks/useHashState';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

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
      {/* Frame content (BackgroundMesh inserted in Task 7 once component exists) */}
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

      {/* Cockpit placeholder — full implementation in Task 6 */}
      {cockpitOpen && (
        <div
          className="absolute inset-0 z-30 bg-stage-base/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setCockpitOpen(false)}
        >
          <div className="text-stage-white">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur mb-4">
              Facilitator cockpit
            </p>
            <p>Frame {frameIndex + 1} of {frames.length}: {currentFrame.title}</p>
            <p className="text-stage-murmur mt-4 max-w-xl">{currentFrame.speakerNotes}</p>
            <p className="text-stage-murmur/60 mt-8 font-mono text-xs">Press Esc to close · Thumbnails arrive in Task 6</p>
          </div>
        </div>
      )}
    </div>
  );
}
