import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';
import { SurveyForm, SurveyAnswers } from './innovationReadiness/SurveyForm';
import { ResultsDashboard } from './innovationReadiness/ResultsDashboard';
import { DEMO_PERSONAS, AssessmentResult } from '../data/innovationReadinessPersonas';

const DARK = '#1E3A5F';
const ACCENT = '#2B4C7E';
const PALE_BORDER = '#C7D3E8';

type ViewState = { mode: 'survey' } | { mode: 'submitted' } | { mode: 'results'; result: AssessmentResult };

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const InnovationReadinessAssessment: React.FC = () => {
  const [view, setView] = useState<ViewState>({ mode: 'survey' });

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToSurvey = () => setView({ mode: 'survey' });

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <a href="#" onClick={goHome} className="inline-flex items-center gap-1.5 text-[14px] mb-8 transition-colors hover:text-[#1E3A5F]" style={{ color: '#718096' }}>
          <ArrowLeft size={16} /> Home
        </a>

        <div className="mb-4 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
            AI Change & Innovation Readiness
          </div>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15] mb-6">
            Where do you stand,<br />
            as an <span className="relative inline-block">
              individual
              <span className="absolute left-0 -bottom-1 w-full h-[4px] rounded-full opacity-80" style={{ backgroundColor: DARK }} />
            </span>?
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4A5568] text-center max-w-[620px] mx-auto mb-2 leading-[1.6]">
            A short survey that places you on the AI Innovator Profile Matrix &mdash; how curious and capable you are with AI, set against how ready your organisation is to back it.
          </p>
        </div>

        {/* Demo mode — one pill per persona in DEMO_PERSONAS, no UI change needed to add more */}
        <div className="flex flex-col items-center gap-2.5 mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">See a populated example instead</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setView({ mode: 'results', result: persona })}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: hexA(ACCENT, 0.1), border: `1.5px solid ${ACCENT}`, color: DARK }}
              >
                <Sparkles size={15} style={{ color: ACCENT }} />
                Demo: {persona.personaLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          {view.mode === 'survey' && <SurveyForm onSubmit={(_answers: SurveyAnswers) => setView({ mode: 'submitted' })} />}

          {view.mode === 'submitted' && (
            <div className="rounded-2xl flex flex-col items-center justify-center text-center px-6 py-16" style={{ backgroundColor: '#F7FAFC', border: `1.5px dashed ${PALE_BORDER}` }}>
              <span className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: hexA('#38A169', 0.14) }}>
                <CheckCircle2 size={22} style={{ color: '#38A169' }} />
              </span>
              <p className="text-[16px] font-bold text-[#1A202C]">Responses captured</p>
              <p className="text-[13.5px] text-[#718096] mt-1.5 max-w-[420px]">
                In this pass, answers aren't scored yet &mdash; that's the next build. Once the scoring engine is wired up, submitting here will land on the same results dashboard shown by the demo pill above.
              </p>
              <button
                type="button"
                onClick={resetToSurvey}
                className="mt-6 text-[13px] font-semibold px-4 py-2 rounded-full transition-colors"
                style={{ color: DARK, border: `1px solid ${PALE_BORDER}` }}
              >
                Start over
              </button>
            </div>
          )}

          {view.mode === 'results' && <ResultsDashboard result={view.result} onBack={resetToSurvey} />}
        </div>

        <ArtifactClosing
          summaryText="This individual view is one input into the org-wide picture — see how readiness rolls up across the whole organisation in the AI Readiness Assessment."
          ctaLabel="See the org-level AI Readiness Assessment"
          ctaHref="#ai-readiness"
          secondaryCtaLabel="Talk to us about your AI readiness"
          secondaryCtaHref="mailto:uk@oxygyconsulting.com"
          accentColor={DARK}
        />
      </div>
    </div>
  );
};
