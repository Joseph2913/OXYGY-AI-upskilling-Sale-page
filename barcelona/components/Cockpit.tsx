import { useEffect, useState } from 'react';
import type { FrameMeta } from '../types';

interface CockpitProps {
  frames: FrameMeta[];
  currentIndex: number;
  onJumpTo: (index: number) => void;
  onClose: () => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function Cockpit({ frames, currentIndex, onJumpTo, onClose }: CockpitProps) {
  const [startTime] = useState<number>(() => Date.now());
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentFrame = frames[currentIndex];
  const targetTotalMin = frames.reduce((acc, f) => acc + f.targetMinutes, 0);

  return (
    <div
      className="absolute inset-0 z-30 bg-stage-base/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="max-w-6xl mx-auto p-12" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
            Facilitator cockpit
          </h2>
          <div className="flex items-baseline gap-8 font-mono text-xs uppercase tracking-[0.15em] text-stage-murmur">
            <span>Elapsed <span className="text-teal ml-2">{formatElapsed(elapsed)}</span></span>
            <span>Target <span className="text-teal ml-2">{targetTotalMin} min</span></span>
            <button onClick={onClose} className="text-stage-white hover:text-teal transition-colors">
              Esc to close
            </button>
          </div>
        </div>

        {/* Speaker notes for current frame */}
        <div className="mb-12 border-l-2 border-teal pl-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-2">
            Now showing · Frame {currentIndex + 1} · {currentFrame.targetMinutes} min target
          </p>
          <h3 className="text-2xl text-stage-white mb-3">{currentFrame.title}</h3>
          <p className="text-stage-murmur leading-relaxed max-w-2xl">
            {currentFrame.speakerNotes}
          </p>
        </div>

        {/* Thumbnail grid */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur mb-4">
            All frames · click to jump
          </p>
          <div className="grid grid-cols-4 gap-3">
            {frames.map((frame, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={frame.id}
                  onClick={() => {
                    onJumpTo(idx);
                    onClose();
                  }}
                  className={`text-left p-4 border transition-colors ${
                    active
                      ? 'border-teal bg-teal/10'
                      : 'border-stage-murmur/30 hover:border-stage-white/60'
                  }`}
                >
                  <p className="font-mono text-xs text-stage-murmur mb-2">
                    {String(idx + 1).padStart(2, '0')} · {frame.targetMinutes} min
                  </p>
                  <p className={`text-sm ${active ? 'text-stage-white' : 'text-stage-murmur'}`}>
                    {frame.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
