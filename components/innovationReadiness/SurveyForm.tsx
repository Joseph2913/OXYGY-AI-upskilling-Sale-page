import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import {
  SURVEY_CATEGORY_ORDER,
  SURVEY_CATEGORY_LABELS,
  questionsForCategory,
  SurveyAnswers,
} from '../../data/innovationReadinessQuestions';
import { ProgressBar } from './ProgressBar';
import { LikertQuestion, LikertMultiQuestion, SingleSelectQuestion, OpenTextQuestion, AnswerValue } from './QuestionInputs';

const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

interface SurveyFormProps {
  onSubmit: (answers: SurveyAnswers) => void;
}

/**
 * Captures input state for every category in `SURVEY_CATEGORY_ORDER`. Not wired to real scoring —
 * submitting hands the raw answers up to the parent, which shows a placeholder confirmation
 * rather than a results dashboard (see InnovationReadinessAssessment).
 */
export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const categoryId = SURVEY_CATEGORY_ORDER[stepIndex];
  const questions = questionsForCategory(categoryId).filter((q) => {
    if (!q.conditionalOn) return true;
    const triggerValue = answers[q.conditionalOn];
    return typeof triggerValue === 'number' && triggerValue >= (q.conditionalMinValue ?? 4);
  });
  const isLastStep = stepIndex === SURVEY_CATEGORY_ORDER.length - 1;

  const setAnswer = (id: string, value: AnswerValue) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const goNext = () => {
    if (isLastStep) {
      onSubmit(answers);
    } else {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <ProgressBar stepIndex={stepIndex} totalSteps={SURVEY_CATEGORY_ORDER.length} stepLabel={SURVEY_CATEGORY_LABELS[categoryId]} />

      <div className="space-y-4">
        {questions.map((q) => {
          if (q.type === 'likert') {
            return (
              <LikertQuestion
                key={q.id}
                label={q.label}
                value={answers[q.id]}
                scored={q.scored}
                allowNotApplicable={q.allowNotApplicable}
                onChange={(v) => setAnswer(q.id, v)}
              />
            );
          }
          if (q.type === 'likert_multi') {
            return (
              <LikertMultiQuestion
                key={q.id}
                label={q.label}
                items={q.multiItems ?? []}
                value={answers[q.id]}
                onChange={(v) => setAnswer(q.id, v)}
              />
            );
          }
          if (q.type === 'single_select') {
            return (
              <SingleSelectQuestion
                key={q.id}
                label={q.label}
                options={q.options ?? []}
                value={answers[q.id]}
                scored={q.scored}
                onChange={(v) => setAnswer(q.id, v)}
              />
            );
          }
          return (
            <OpenTextQuestion key={q.id} label={q.label} value={answers[q.id]} scored={q.scored} onChange={(v) => setAnswer(q.id, v)} />
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-7 pt-5" style={{ borderTop: '1px solid #E2E8F0' }}>
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-0"
          style={{ color: DARK, border: `1px solid ${PALE_BORDER}` }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-white px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: DARK }}
        >
          {isLastStep ? (
            <>
              Submit <CheckCircle2 size={16} />
            </>
          ) : (
            <>
              Next <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
