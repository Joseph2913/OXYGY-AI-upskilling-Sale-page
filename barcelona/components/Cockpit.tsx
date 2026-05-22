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

/**
 * Facilitator overlay. Dark on light — pops above the white slide surface
 * with a navy-tinted backdrop for strong contrast. Shows current frame's
 * speaker notes, elapsed-time, total target minutes, and a clickable
 * thumbnail grid.
 */
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
      className="absolute inset-0 z-30 bg-navy-900/97 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div className="max-w-6xl mx-auto p-12" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-navy-400">
            Facilitator cockpit
          </h2>
          <div className="flex items-baseline gap-8 font-mono text-xs uppercase tracking-[0.15em] text-navy-400">
            <span>Elapsed <span className="text-teal ml-2">{formatElapsed(elapsed)}</span></span>
            <span>Target <span className="text-teal ml-2">{targetTotalMin} min</span></span>
            <button onClick={onClose} className="text-white hover:text-teal transition-colors">
              Esc to close
            </button>
          </div>
        </div>

        {/* Speaker notes */}
        <div className="mb-12 border-l-2 border-teal pl-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-teal mb-2">
            Now showing · Frame {currentIndex + 1} · {currentFrame.targetMinutes} min target
          </p>
          <h3 className="font-display text-2xl text-white mb-3">{currentFrame.title}</h3>
          <p className="text-navy-400 leading-relaxed max-w-2xl">
            {currentFrame.speakerNotes}
          </p>
        </div>

        {/* Thumbnail grid */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-navy-400 mb-4">
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
                      ? 'border-teal bg-teal/15'
                      : 'border-navy-700 hover:border-navy-500'
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy-400 mb-2">
                    {String(idx + 1).padStart(2, '0')} · {frame.targetMinutes} min
                  </p>
                  <p className={`text-sm ${active ? 'text-white' : 'text-navy-500'}`}>
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
