import { Frame } from '../../Frame';

/**
 * Frame 1 — Title / theme opener.
 * Sets the day's theme: "Strategy Meets Data" + the CHRO's role in defining
 * AI use cases that get funded. Single viewport, atmospheric breathing Venn,
 * staggered title cascade.
 */
export function OpenerHook() {
  return (
    <Frame>
      {/* Top metadata bar */}
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-stage-murmur/60">
          Working Futures × OXYGY · CHRO Event · Barcelona · June 10–11, 2026
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-stage-murmur/60">
          1-hour working session
        </p>
      </div>

      {/* Centre stage: title block left, breathing Venn right */}
      <div className="flex-1 flex items-center gap-12 mt-6">
        <div className="flex-1 max-w-[60%] relative z-10">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-teal">
            Day 01 · Session One
          </p>

          <h1
            className="mt-8 font-sans font-semibold text-stage-white tracking-[-0.025em] leading-[0.95] text-[clamp(4.5rem,10vw,9.5rem)]"
            aria-label="Strategy Meets Data"
          >
            <span className="block">
              <span className="title-letter" style={{ animationDelay: '120ms' }}>
                Strategy
              </span>
            </span>
            <span className="block text-stage-murmur">
              <span className="title-letter" style={{ animationDelay: '320ms' }}>
                Meets
              </span>
            </span>
            <span className="block relative inline-block">
              <span className="title-letter" style={{ animationDelay: '520ms' }}>
                Data.
              </span>
            </span>
          </h1>

          <p className="mt-10 font-sans text-stage-murmur leading-snug max-w-[28ch] text-[clamp(1.15rem,1.5vw,1.5rem)]">
            The CHRO&rsquo;s role in defining AI use cases that get{' '}
            <span className="relative inline-block text-stage-white">
              funded
              <span
                className="underline-sweep absolute left-0 -bottom-1 w-full h-[2px] bg-teal rounded-full"
                aria-hidden="true"
              />
            </span>
            .
          </p>
        </div>

        {/* Breathing Venn — right side */}
        <div className="hidden md:flex relative w-[42%] h-full max-h-[78vh] items-center justify-center">
          <svg
            viewBox="-40 -40 480 480"
            className="w-full h-full max-w-[640px]"
            aria-hidden="true"
          >
            {/* Soft halo */}
            <defs>
              <radialGradient id="halo-strategy" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="rgba(247, 232, 164, 0.18)" />
                <stop offset="100%" stopColor="rgba(247, 232, 164, 0)" />
              </radialGradient>
              <radialGradient id="halo-data" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="rgba(195, 208, 245, 0.18)" />
                <stop offset="100%" stopColor="rgba(195, 208, 245, 0)" />
              </radialGradient>
            </defs>

            {/* Strategy group — left circle */}
            <g className="breathe-a" style={{ transformOrigin: '160px 200px' }}>
              <circle cx="160" cy="200" r="220" fill="url(#halo-strategy)" />
              <circle
                cx="160"
                cy="200"
                r="170"
                fill="rgba(247, 232, 164, 0.06)"
                stroke="rgba(247, 232, 164, 0.4)"
                strokeWidth="1.25"
              />
            </g>

            {/* Data group — right circle */}
            <g className="breathe-b" style={{ transformOrigin: '240px 200px' }}>
              <circle cx="240" cy="200" r="220" fill="url(#halo-data)" />
              <circle
                cx="240"
                cy="200"
                r="170"
                fill="rgba(195, 208, 245, 0.06)"
                stroke="rgba(195, 208, 245, 0.4)"
                strokeWidth="1.25"
              />
            </g>

            {/* Labels */}
            <text
              x="40"
              y="40"
              fill="rgba(247, 232, 164, 0.55)"
              fontFamily="Geist Mono, monospace"
              fontSize="11"
              letterSpacing="2"
              style={{ textTransform: 'uppercase' }}
            >
              Strategy
            </text>
            <text
              x="290"
              y="395"
              fill="rgba(195, 208, 245, 0.55)"
              fontFamily="Geist Mono, monospace"
              fontSize="11"
              letterSpacing="2"
              style={{ textTransform: 'uppercase' }}
            >
              Data
            </text>

            {/* Intersection marker — tiny teal pulse dot */}
            <circle cx="200" cy="200" r="3" fill="#38B2AC">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* Bottom byline */}
      <div className="flex items-baseline justify-between mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-stage-murmur/60">
          Hosted by Joseph Thomas · Edoardo Monopoli · Yuji Develle
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-stage-murmur/40">
          Press <span className="text-stage-murmur/80">→</span> to begin
        </p>
      </div>
    </Frame>
  );
}
