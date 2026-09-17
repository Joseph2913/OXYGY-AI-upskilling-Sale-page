import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import {
  SURVEY_CATEGORY_ORDER,
  SURVEY_CATEGORY_LABELS,
  questionsForCategory,
  SurveyAnswers,
  SurveyQuestion,
} from '../../data/innovationReadinessQuestions';
import { ProgressBar } from './ProgressBar';
import { LikertTable, LikertMultiQuestion, SingleSelectQuestion, OpenTextQuestion, AnswerValue, LikertTableRow } from './QuestionInputs';

/** Groups consecutive Likert questions into one run, so they can render as a single table with
 * the 1–5 scale labels shown once, instead of one card (and one set of labels) per question. */
type RenderGroup = { kind: 'likert-group'; questions: SurveyQuestion[] } | { kind: 'single'; question: SurveyQuestion };

function groupQuestions(questions: SurveyQuestion[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  for (const q of questions) {
    const last = groups[groups.length - 1];
    if (q.type === 'likert' && last?.kind === 'likert-group') {
      last.questions.push(q);
    } else if (q.type === 'likert') {
      groups.push({ kind: 'likert-group', questions: [q] });
    } else {
      groups.push({ kind: 'single', question: q });
    }
  }
  return groups;
}

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface SurveyFormProps {
  /** Pre-fills the form (e.g. from a demo persona) — still fully editable before submit. */
  initialAnswers?: SurveyAnswers;
  /** When set, shows a small banner noting the form was pre-filled from this persona. */
  demoLabel?: string;
  onSubmit: (answers: SurveyAnswers) => void;
}

/**
 * Captures input state for every category in `SURVEY_CATEGORY_ORDER`. Not wired to real scoring —
 * submitting hands the raw answers up to the parent. For a plain walkthrough that's a placeholder
 * confirmation; for a demo persona (`initialAnswers` set) the parent computes results from
 * whatever ends up in the form and shows the dashboard (see InnovationReadinessAssessment).
 */
export const SurveyForm: React.FC<SurveyFormProps> = ({ initialAnswers, demoLabel, onSubmit }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(() => initialAnswers ?? {});

  const categoryId = SURVEY_CATEGORY_ORDER[stepIndex];
  const questions = questionsForCategory(categoryId).filter((q) => {
    if (!q.conditionalOn) return true;
    const triggerValue = answers[q.conditionalOn];
    return typeof triggerValue === 'number' && triggerValue >= (q.conditionalMinValue ?? 4);
  });
  const isLastStep = stepIndex === SURVEY_CATEGORY_ORDER.length - 1;
  const renderGroups = groupQuestions(questions);

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
      {demoLabel && (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold mb-5" style={{ backgroundColor: hexA(ACCENT, 0.1), border: `1.5px solid ${ACCENT}`, color: DARK }}>
          <Sparkles size={13} style={{ color: ACCENT }} />
          Pre-filled from: {demoLabel} &mdash; edit any answer before submitting
        </div>
      )}
      <ProgressBar stepIndex={stepIndex} totalSteps={SURVEY_CATEGORY_ORDER.length} stepLabel={SURVEY_CATEGORY_LABELS[categoryId]} />

      <div className="space-y-6">
        {renderGroups.map((group) => {
          if (group.kind === 'likert-group') {
            const rows: LikertTableRow[] = group.questions.map((q) => ({
              id: q.id,
              label: q.label,
              value: answers[q.id],
              allowNotApplicable: q.allowNotApplicable,
            }));
            return <LikertTable key={group.questions[0].id} rows={rows} onChange={setAnswer} />;
          }

          const q = group.question;
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
                onChange={(v) => setAnswer(q.id, v)}
              />
            );
          }
          return <OpenTextQuestion key={q.id} label={q.label} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />;
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
