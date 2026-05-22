import { Frame } from '../../Frame';
import {
  OpenAIIcon,
  AnthropicIcon,
  GeminiIcon,
  MetaIcon,
  MistralIcon,
  OpenSourceIcon,
} from '../../BrandLogos';

/**
 * Slide 2 — The Hook
 * "In five years, every company in this room will have the same AI models.
 *  What will set yours apart?"
 *
 * Centered composition. Floating AI brand logos in the periphery grounding
 * the "same AI models" idea. The question lands large in teal.
 */
export function ChroPosition() {
  return (
    <Frame noContainer>
      <div className="relative w-full h-full">
        {/* Floating brand logos — drift around the canvas at low opacity */}
        <FloatingLogos />

        {/* Centered text composition */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-16 z-20">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-navy-500 mb-12">
            The Question
          </p>

          <p className="text-center max-w-5xl font-sans font-medium text-navy-700 leading-[1.18] text-[clamp(2rem,3.8vw,3.4rem)] tracking-[-0.012em]">
            <span className="word-reveal" style={{ animationDelay: '200ms' }}>In</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '280ms' }}>five</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '360ms' }}>years,</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '460ms' }}>every</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '540ms' }}>company</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '620ms' }}>in</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '680ms' }}>this</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '740ms' }}>room</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '820ms' }}>will</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '880ms' }}>have</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '940ms' }}>the</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '1000ms' }}>same</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '1060ms' }}>AI</span>{' '}
            <span className="word-reveal" style={{ animationDelay: '1140ms' }}>models.</span>
          </p>

          <p
            className="word-reveal mt-10 text-center font-display font-extrabold text-teal teal-pulse leading-[1.08] text-[clamp(2.5rem,5.4vw,5rem)] tracking-[-0.02em]"
            style={{ animationDelay: '1700ms' }}
          >
            What will set yours apart?
          </p>
        </div>
      </div>
    </Frame>
  );
}

/**
 * Floating logos at low opacity in the periphery. Each drifts subtly.
 * Position chosen so they frame the centered question without crowding it.
 */
function FloatingLogos() {
  const logos = [
    { Cmp: OpenAIIcon, top: '12%', left: '8%', size: 'w-12 h-12', drift: 'drift-a', color: 'text-navy-400' },
    { Cmp: AnthropicIcon, top: '24%', right: '11%', size: 'w-14 h-14', drift: 'drift-b', color: 'text-navy-400' },
    { Cmp: GeminiIcon, bottom: '20%', left: '12%', size: 'w-12 h-12', drift: 'drift-b', color: 'text-navy-400' },
    { Cmp: MetaIcon, bottom: '14%', right: '14%', size: 'w-14 h-14', drift: 'drift-a', color: 'text-navy-400' },
    { Cmp: MistralIcon, top: '46%', left: '4%', size: 'w-10 h-10', drift: 'drift-a', color: '' },
    { Cmp: OpenSourceIcon, top: '52%', right: '5%', size: 'w-12 h-12', drift: 'drift-b', color: 'text-navy-400' },
    { Cmp: OpenAIIcon, bottom: '36%', right: '22%', size: 'w-8 h-8', drift: 'drift-b', color: 'text-navy-300' },
    { Cmp: GeminiIcon, top: '32%', left: '24%', size: 'w-8 h-8', drift: 'drift-a', color: 'text-navy-300' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {logos.map((l, i) => (
        <div
          key={i}
          className={`absolute ${l.size} ${l.drift} ${l.color} opacity-30 float-soft`}
          style={{
            top: l.top,
            left: l.left,
            right: l.right,
            bottom: l.bottom,
            animationDelay: `${i * 250}ms`,
          }}
        >
          <l.Cmp className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}
