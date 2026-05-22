import { Frame } from '../../Frame';
import {
  OpenAIIcon,
  AnthropicIcon,
  GeminiIcon,
  MetaIcon,
  OpenSourceIcon,
} from '../../BrandLogos';

/**
 * Slide 3 — The Shift
 * "The AI advantage isn't where you think it is."
 *
 * Three layered cards (Data + Adoption / Strategy / Model). Right-side
 * TO/FROM axis with a teal arrow drawing in on mount. The model layer
 * carries the actual brand logos (OpenAI · Anthropic · Gemini · open source)
 * grounding the commoditisation point.
 */
export function DataPicture() {
  return (
    <Frame>
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-navy-900 leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4vw,3.5rem)]">
          The AI advantage isn&rsquo;t where you think it is.
        </h2>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.3em] text-teal font-medium">
          The Shift
        </p>
      </div>

      {/* Three-layer stack + TO/FROM axis */}
      <div className="flex-1 flex items-center mt-6">
        <div className="flex-1 flex flex-col gap-4 pr-12">
          {/* Top — Data + Adoption Layer (highlighted dark) */}
          <div
            className="layer-slide relative bg-navy-900 text-white rounded-lg px-8 py-6"
            style={{ animationDelay: '720ms' }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal font-medium">
                  The Data + Adoption Layer
                </p>
                <h3 className="mt-3 font-display font-bold text-[clamp(1.4rem,2vw,1.85rem)] leading-tight">
                  Where AI actually works.
                </h3>
                <p className="mt-2 text-sm text-navy-400 leading-snug max-w-2xl">
                  Your workforce footprint, capabilities, projects, processes — connected and accessible.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md bg-teal text-white font-mono text-[10px] uppercase tracking-[0.18em] font-medium">
                Your Foundation
              </span>
            </div>
          </div>

          {/* Middle — Strategy Layer (teal border) */}
          <div
            className="layer-slide relative bg-white border-l-[4px] border-teal rounded-lg px-8 py-6 border-y border-r border-surface-border"
            style={{ animationDelay: '480ms' }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal font-medium">
                  The Strategy Layer
                </p>
                <h3 className="mt-3 font-display font-bold text-navy-900 text-[clamp(1.4rem,2vw,1.85rem)] leading-tight">
                  Where AI plays a role in your firm.
                </h3>
                <p className="mt-2 text-sm text-navy-600 leading-snug max-w-2xl">
                  Which functions, which workflows, which decisions, which outcomes.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md border border-teal text-teal-dark font-mono text-[10px] uppercase tracking-[0.18em] font-medium">
                Your Advantage
              </span>
            </div>
          </div>

          {/* Bottom — Model Layer (faded, with company logos) */}
          <div
            className="layer-slide relative bg-surface-alt rounded-lg px-8 py-5 border border-surface-border"
            style={{ animationDelay: '240ms' }}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-navy-500 font-medium">
                  The Model Layer
                </p>
                <div className="mt-3 flex items-center gap-5 flex-wrap">
                  <h3 className="font-display font-semibold text-navy-600 text-[clamp(1.1rem,1.5vw,1.45rem)] leading-tight">
                    GPT · Claude · open source
                  </h3>
                  <div className="flex items-center gap-3 text-navy-500">
                    <OpenAIIcon className="w-6 h-6" />
                    <AnthropicIcon className="w-6 h-6" />
                    <GeminiIcon className="w-6 h-6" />
                    <MetaIcon className="w-6 h-6" />
                    <OpenSourceIcon className="w-6 h-6" />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-navy-500 italic">
                  Converging into table-stakes.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md bg-surface-muted text-navy-500 font-mono text-[10px] uppercase tracking-[0.18em] font-medium">
                Commoditising
              </span>
            </div>
          </div>
        </div>

        {/* TO/FROM axis */}
        <div className="w-20 h-full flex flex-col items-center justify-center py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-teal font-semibold mb-3">
            To
          </p>
          <svg
            viewBox="0 0 24 200"
            className="flex-1 w-6"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line
              x1="12"
              y1="195"
              x2="12"
              y2="14"
              stroke="#38B2AC"
              strokeWidth="2"
              strokeLinecap="round"
              className="arrow-draw"
            />
            <polygon
              points="12,4 6,16 18,16"
              fill="#38B2AC"
              className="arrow-draw"
              style={{ animationDelay: '1800ms' }}
            />
          </svg>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-navy-500 mt-3">
            From
          </p>
        </div>
      </div>

      {/* Footer line */}
      <p className="font-sans italic text-navy-700 text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed mt-4">
        The model is what everyone will have. The bottom two layers are{' '}
        <span className="text-teal-dark font-semibold not-italic">what only you can build</span>.
      </p>
    </Frame>
  );
}
