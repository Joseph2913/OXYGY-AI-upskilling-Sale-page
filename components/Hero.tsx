import React, { useEffect, useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

const PLATFORM_LOGIN_URL = 'https://oxygy-ai-upskilling-site.web.app/app/dashboard';

// ── Hero Component (Upskilling page) ─────────────────────────────────
export const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  );

  // Track mobile breakpoint
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="hero" style={{ background: '#F7FAFC' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: isMobile ? '100px 24px 48px' : '140px 48px 80px',
        }}
      >
        {/* Badge */}
        <div>
          <span
            className="inline-block uppercase tracking-widest"
            style={{
              border: '1px solid #38B2AC',
              color: '#38B2AC',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '1.5px',
            }}
          >
            OXYGY AI CENTRE OF EXCELLENCE
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: isMobile ? '36px' : 'clamp(42px, 4vw, 52px)',
            fontWeight: 800,
            color: '#1A202C',
            lineHeight: 1.15,
            marginTop: '20px',
            maxWidth: '720px',
          }}
        >
          Your AI Transformation Starts With{' '}
          <span className="relative inline-block">
            Your People
            <span
              className="absolute left-0 w-full"
              style={{
                bottom: '-4px',
                height: '3px',
                background: '#38B2AC',
                borderRadius: '2px',
              }}
            />
          </span>
          .
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: 400,
            color: '#4A5568',
            lineHeight: 1.7,
            marginTop: '24px',
            maxWidth: '560px',
          }}
        >
          There is no one-size-fits-all model for AI adoption. It starts
          with your people discovering what works best for them — then
          aggregating those learnings into the processes, frameworks,
          and operating models that transform your entire organization.
        </p>

        {/* CTAs */}
        <div
          className={
            isMobile
              ? 'flex flex-col gap-3 w-full'
              : 'flex flex-row gap-4'
          }
          style={{ marginTop: '32px' }}
        >
          <a
            href="#learning-pathway"
            className="inline-flex items-center justify-center gap-2 transition-colors"
            style={{
              background: '#38B2AC',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = '#2C9A94')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = '#38B2AC')
            }
          >
            Start the Journey <ChevronRight size={16} />
          </a>
          <button
            onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center transition-colors cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid #1A202C',
              color: '#1A202C',
              borderRadius: '28px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1A202C';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1A202C';
            }}
          >
            Explore the Framework
          </button>
        </div>

        {/* Login for existing platform users */}
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          Already enrolled?{' '}
          <a
            href={PLATFORM_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#2C9A94] hover:text-[#1A202C] transition-colors"
          >
            Log in to the Upskilling Platform <ExternalLink size={14} />
          </a>{' '}
          <span style={{ color: '#A0AEC0' }}>(active users only)</span>
        </p>
      </div>
    </section>
  );
};
