import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';
import { SurveyForm } from './innovationReadiness/SurveyForm';
import { ResultsDashboard } from './innovationReadiness/ResultsDashboard';
import { OrgResultsDashboard } from './innovationReadiness/OrgResultsDashboard';
import { SurveyAnswers } from '../data/innovationReadinessQuestions';
import { DEMO_PERSONA_INPUTS, DemoPersonaInput, AssessmentResult, computeAssessmentResult } from '../data/innovationReadinessPersonas';
import { ORG_MOCK_RESULTS } from '../data/innovationReadinessOrgMockData';

const DARK = '#1E3A5F';
const ACCENT = '#2B4C7E';
const PALE_BORDER = '#C7D3E8';

type ResultsTab = 'individual' | 'org';

/** `demo` carries the persona whose answers pre-filled the form, if any — submitting a demo-backed
 * form computes real results from whatever ended up in it; a blank form just shows a placeholder. */
type ViewState = { mode: 'survey'; demo?: DemoPersonaInput } | { mode: 'submitted' } | { mode: 'results'; result: AssessmentResult };

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const InnovationReadinessAssessment: React.FC = () => {
  const [view, setView] = useState<ViewState>({ mode: 'survey' });
  const [resultsTab, setResultsTab] = useState<ResultsTab>('org');

  // Submitting (or going back) swaps in an entirely new page below — land at the top of it
  // rather than wherever the survey happened to be scrolled to.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view.mode]);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToSurvey = () => {
    setView({ mode: 'survey' });
    setResultsTab('org');
  };

  const handleSubmit = (answers: SurveyAnswers, demo?: DemoPersonaInput) => {
    if (demo) {
      setView({ mode: 'results', result: computeAssessmentResult({ ...demo, answers }) });
      setResultsTab('org');
    } else {
      setView({ mode: 'submitted' });
    }
  };

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

        {/* Demo mode — one pill per persona in DEMO_PERSONA_INPUTS, no UI change needed to add more.
            Clicking a pill pre-fills the survey with that persona's answers so it can be clicked
            through (and edited) before landing on the results dashboard on submit. */}
        {view.mode === 'survey' && (
          <div className="flex flex-col items-center gap-2.5 mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Click through a populated example instead</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {DEMO_PERSONA_INPUTS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setView({ mode: 'survey', demo: persona })}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: hexA(ACCENT, 0.1), border: `1.5px solid ${ACCENT}`, color: DARK }}
                >
                  <Sparkles size={15} style={{ color: ACCENT }} />
                  Demo: {persona.personaLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Once you've clicked through the assessment, results show two lenses on the same
            submission: your own scores (Individual) and where you sit within the wider
            organisation (Org View, mock data standing in for prior submissions). */}
        {view.mode === 'results' && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full p-1" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
              {(['org', 'individual'] as ResultsTab[]).map((t) => {
                const active = resultsTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setResultsTab(t)}
                    className="rounded-full px-5 py-2 text-[13px] font-bold transition-all"
                    style={{ backgroundColor: active ? DARK : 'transparent', color: active ? '#FFFFFF' : '#4A5568' }}
                  >
                    {t === 'individual' ? 'Individual' : 'Org View'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          {view.mode === 'survey' && (
            <SurveyForm
              key={view.demo?.id ?? 'blank'}
              initialAnswers={view.demo?.answers}
              demoLabel={view.demo?.personaLabel}
              onSubmit={(answers) => handleSubmit(answers, view.demo)}
            />
          )}

          {view.mode === 'submitted' && (
            <div className="rounded-2xl flex flex-col items-center justify-center text-center px-6 py-16" style={{ backgroundColor: '#F7FAFC', border: `1.5px dashed ${PALE_BORDER}` }}>
              <span className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: hexA('#38A169', 0.14) }}>
                <CheckCircle2 size={22} style={{ color: '#38A169' }} />
              </span>
              <p className="text-[16px] font-bold text-[#1A202C]">Responses captured</p>
              <p className="text-[13.5px] text-[#718096] mt-1.5 max-w-[420px]">
                This blank walkthrough isn't wired to real scoring yet &mdash; that's the next build. Try one of the demo pills above to see pre-filled answers score through to the individual and org-level results a real submission will eventually reach.
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

          {view.mode === 'results' && resultsTab === 'individual' && <ResultsDashboard result={view.result} onBack={resetToSurvey} />}

          {view.mode === 'results' && resultsTab === 'org' && (
            // The just-submitted response joins the mock org dataset, so it's visible in context
            // (e.g. filter by its own department) rather than the org picture being someone else's.
            <OrgResultsDashboard results={[...ORG_MOCK_RESULTS, view.result]} />
          )}
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
