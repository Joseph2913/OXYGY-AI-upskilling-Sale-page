import type { CSSProperties } from 'react';
import { Frame } from '../../Frame';
import { OxygyLogo } from '../../OxygyLogo';

/**
 * Slide 1 — Title
 * "Strategic Workforce Planning in the Age of AI"
 * Two-column composition: text left, voxel-tower visual right.
 */
export function OpenerHook() {
  return (
    <Frame noContainer>
      <div className="relative w-full h-full grid grid-cols-12 gap-8">
        {/* Top-left OXYGY mark */}
        <div className="absolute top-10 left-12 z-30 text-teal">
          <OxygyLogo variant="mark" className="h-7 w-7" />
        </div>

        {/* Left column — text */}
        <div className="col-span-7 flex flex-col justify-center pl-16 pr-8 z-20">
          <p className="font-mono text-[13px] uppercase tracking-[0.28em] text-teal font-medium">
            OXYGY AI COE
          </p>

          <h1 className="mt-7 font-display font-extrabold text-navy-900 leading-[1.04] tracking-[-0.025em] text-[clamp(2.75rem,5.4vw,5rem)]">
            Strategic <br />
            Workforce <br />
            Planning <span className="text-navy-600">in the </span>
            <br />
            <span className="relative inline-block">
              Age of AI
              <span
                className="underline-sweep absolute left-0 -bottom-2 w-full h-[6px] bg-teal/40 rounded-full"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mt-10 max-w-md font-sans text-lg text-navy-700 leading-snug">
            Working Futures CHRO Event · Barcelona · June 10–11, 2026
          </p>

          {/* Let's Begin CTA */}
          <button
            type="button"
            className="mt-12 group inline-flex items-center gap-4 self-start pl-7 pr-3 py-3 rounded-full border-2 border-navy-900 bg-white hover:bg-navy-900 transition-colors duration-200"
          >
            <span className="font-sans font-semibold text-base text-navy-900 group-hover:text-white transition-colors">
              Let&rsquo;s Begin
            </span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal group-hover:bg-white transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12 H19 M13 6 L19 12 L13 18"
                  stroke="currentColor"
                  className="text-white group-hover:text-teal transition-colors"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Right column — voxel tower visual */}
        <div className="col-span-5 relative flex items-end justify-center pr-12 pb-8 z-10">
          <VoxelTower />
        </div>

        {/* Bottom-right wordmark */}
        <div className="absolute bottom-7 right-10 z-30 text-navy-900">
          <OxygyLogo variant="wordmark" className="h-7" />
        </div>
      </div>
    </Frame>
  );
}

/**
 * Voxel tower hero visual — a stack of small translucent squares that
 * cascade in on mount. Inspired by the deck's pixelated cube render but
 * drawn fresh with motion. The tower has a teal-tinted core and
 * neutral/cool outer squares for depth.
 */
function VoxelTower() {
  // 7 columns wide, 26 rows tall — generated grid of small squares with
  // varied opacity. Some are accent-colored, most are neutral. Falls in
  // from above on mount via .pixel-fall.
  const COLS = 7;
  const ROWS = 28;
  const CELL = 18;
  const GAP = 3;
  const WIDTH = COLS * (CELL + GAP);
  const HEIGHT = ROWS * (CELL + GAP);

  // Stable pseudo-random so the layout is consistent between renders
  const seed = (n: number) => {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  };

  const cells: Array<{
    x: number;
    y: number;
    delay: number;
    opacity: number;
    fill: string;
    border?: boolean;
  }> = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const r = seed(idx + 1);
      const rowFromBottom = ROWS - 1 - row;

      // Skip some cells in upper rows for sparse cascade feel
      if (row < 8 && r < 0.45) continue;
      if (row < 4 && r < 0.65) continue;

      // Most cells: light gray. Some: teal. Some: lavender / yellow.
      let fill = '#E2E8F0'; // surface.border default
      let opacity = 0.55;
      let border = false;

      const tone = seed(idx + 100);
      if (tone < 0.06) {
        fill = '#38B2AC'; // teal
        opacity = 0.9;
      } else if (tone < 0.1) {
        fill = '#C3D0F5'; // lavender
        opacity = 0.85;
      } else if (tone < 0.14) {
        fill = '#F7E8A4'; // yellow
        opacity = 0.85;
      } else if (tone < 0.18) {
        fill = '#1A202C'; // navy
        opacity = 0.85;
      } else {
        fill = '#CBD5E0';
        opacity = 0.4 + r * 0.4;
      }

      // Outline-only treatment for some
      if (tone > 0.92) {
        border = true;
      }

      cells.push({
        x: col * (CELL + GAP),
        y: row * (CELL + GAP),
        delay: Math.max(0, rowFromBottom * 25 + col * 15 + r * 100),
        opacity,
        fill,
        border,
      });
    }
  }

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Soft glow behind tower */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-50 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(56, 178, 172, 0.18) 0%, rgba(195, 208, 245, 0.08) 35%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="relative w-full h-full max-w-[400px] max-h-[640px]"
        aria-hidden="true"
      >
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={CELL}
            height={CELL}
            rx={1.5}
            fill={c.border ? 'none' : c.fill}
            stroke={c.border ? c.fill : 'none'}
            strokeWidth={c.border ? 1 : 0}
            className="pixel-fall"
            style={
              {
                '--pixel-op': c.opacity,
                animationDelay: `${c.delay}ms`,
              } as CSSProperties
            }
          />
        ))}

        {/* Base plinth — solid bar at bottom suggesting the tower sits on a surface */}
        <rect
          x={-12}
          y={HEIGHT - 4}
          width={WIDTH + 24}
          height={4}
          fill="#1A202C"
          opacity={0.85}
          className="pixel-fall"
          style={{ animationDelay: '50ms' } as CSSProperties}
        />

        {/* Drifting particle dots around the tower */}
        {Array.from({ length: 18 }).map((_, i) => {
          const px = seed(i + 500) * (WIDTH + 80) - 40;
          const py = seed(i + 600) * HEIGHT;
          const drift = i % 2 === 0 ? 'drift-a' : 'drift-b';
          const fill = i % 3 === 0 ? '#38B2AC' : i % 3 === 1 ? '#C3D0F5' : '#A0AEC0';
          return (
            <circle
              key={`p${i}`}
              cx={px}
              cy={py}
              r={1.5}
              fill={fill}
              opacity={0.55}
              className={drift}
            />
          );
        })}
      </svg>
    </div>
  );
}
