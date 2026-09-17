import React from 'react';
import { LIKERT_LABELS, AnswerValue } from '../../data/innovationReadinessQuestions';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

export type { AnswerValue };

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Small badge shown on questions that are captured but never fed into a category/axis score. */
const ContextOnlyTag: React.FC = () => (
  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.05em] text-[#A0AEC0] mb-2">Context only &mdash; not scored</span>
);

interface QuestionCardProps {
  label: string;
  scored: boolean;
  children: React.ReactNode;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ label, scored, children }) => (
  <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
    {!scored && <ContextOnlyTag />}
    <p className="text-[14.5px] font-semibold text-[#1A202C] leading-[1.5] mb-4">{label}</p>
    {children}
  </div>
);

interface LikertRowProps {
  value: AnswerValue;
  allowNotApplicable?: boolean;
  onChange: (value: AnswerValue) => void;
}

const LikertRow: React.FC<LikertRowProps> = ({ value, allowNotApplicable, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {LIKERT_LABELS.map((likertLabel, i) => {
      const score = i + 1;
      const active = value === score;
      return (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className="flex-1 min-w-[92px] rounded-lg px-2 py-2.5 text-center transition-all"
          style={{
            backgroundColor: active ? hexA(ACCENT, 0.14) : '#F7FAFC',
            border: active ? `1.5px solid ${ACCENT}` : '1px solid #E2E8F0',
          }}
        >
          <span className="block text-[13px] font-bold" style={{ color: active ? DARK : '#4A5568' }}>{score}</span>
          <span className="block text-[10px] leading-[1.3] mt-0.5" style={{ color: active ? DARK : '#A0AEC0' }}>{likertLabel}</span>
        </button>
      );
    })}
    {allowNotApplicable && (
      <button
        type="button"
        onClick={() => onChange(null)}
        className="rounded-lg px-3 py-2.5 text-[12px] font-semibold transition-all"
        style={{
          backgroundColor: value === null ? hexA('#A0AEC0', 0.18) : '#F7FAFC',
          border: value === null ? '1.5px solid #A0AEC0' : '1px solid #E2E8F0',
          color: value === null ? '#4A5568' : '#A0AEC0',
        }}
      >
        Not Applicable
      </button>
    )}
  </div>
);

interface LikertQuestionProps {
  label: string;
  value: AnswerValue;
  scored: boolean;
  allowNotApplicable?: boolean;
  onChange: (value: AnswerValue) => void;
}

export const LikertQuestion: React.FC<LikertQuestionProps> = ({ label, value, scored, allowNotApplicable, onChange }) => (
  <QuestionCard label={label} scored={scored}>
    <LikertRow value={value} allowNotApplicable={allowNotApplicable} onChange={onChange} />
  </QuestionCard>
);

interface LikertMultiQuestionProps {
  label: string;
  items: string[];
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

/** One Likert row per item (e.g. one per AI tool), rolled up into a single tool→rating map answer. */
export const LikertMultiQuestion: React.FC<LikertMultiQuestionProps> = ({ label, items, value, onChange }) => {
  const record = value && typeof value === 'object' ? (value as Record<string, number | null>) : {};
  const setItem = (item: string, v: AnswerValue) => onChange({ ...record, [item]: typeof v === 'number' ? v : null });

  return (
    <QuestionCard label={label} scored>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item}>
            <p className="text-[12.5px] font-semibold text-[#4A5568] mb-2">{item}</p>
            <LikertRow value={record[item] ?? undefined} allowNotApplicable onChange={(v) => setItem(item, v)} />
          </div>
        ))}
      </div>
    </QuestionCard>
  );
};

interface SingleSelectQuestionProps {
  label: string;
  options: string[];
  value: AnswerValue;
  scored: boolean;
  onChange: (value: AnswerValue) => void;
}

export const SingleSelectQuestion: React.FC<SingleSelectQuestionProps> = ({ label, options, value, scored, onChange }) => (
  <QuestionCard label={label} scored={scored}>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="rounded-full px-4 py-2 text-[13px] font-semibold transition-all"
            style={{
              backgroundColor: active ? hexA(ACCENT, 0.14) : '#F7FAFC',
              border: active ? `1.5px solid ${ACCENT}` : `1px solid ${PALE_BORDER}`,
              color: active ? DARK : '#4A5568',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  </QuestionCard>
);

interface OpenTextQuestionProps {
  label: string;
  value: AnswerValue;
  scored: boolean;
  onChange: (value: AnswerValue) => void;
}

export const OpenTextQuestion: React.FC<OpenTextQuestionProps> = ({ label, value, scored, onChange }) => (
  <QuestionCard label={label} scored={scored}>
    <p className="text-[11.5px] text-[#A0AEC0] mb-3 -mt-2">Optional</p>
    <textarea
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      placeholder="Your thoughts..."
      className="w-full rounded-lg p-3 text-[13.5px] text-[#2D3748] resize-none focus:outline-none"
      style={{ border: `1.5px solid ${PALE_BORDER}`, backgroundColor: '#F7FAFC' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
      onBlur={(e) => (e.currentTarget.style.borderColor = PALE_BORDER)}
    />
  </QuestionCard>
);
