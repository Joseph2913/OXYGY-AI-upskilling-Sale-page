import React from 'react';
import { LIKERT_LABELS } from '../../data/innovationReadinessQuestions';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';

export type AnswerValue = number | 'na' | string | undefined;

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface LikertQuestionProps {
  label: string;
  value: AnswerValue;
  allowNotApplicable?: boolean;
  onChange: (value: AnswerValue) => void;
}

export const LikertQuestion: React.FC<LikertQuestionProps> = ({ label, value, allowNotApplicable, onChange }) => (
  <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
    <p className="text-[14.5px] font-semibold text-[#1A202C] leading-[1.5] mb-4">{label}</p>
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
          onClick={() => onChange('na')}
          className="rounded-lg px-3 py-2.5 text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: value === 'na' ? hexA('#A0AEC0', 0.18) : '#F7FAFC',
            border: value === 'na' ? '1.5px solid #A0AEC0' : '1px solid #E2E8F0',
            color: value === 'na' ? '#4A5568' : '#A0AEC0',
          }}
        >
          Not Applicable
        </button>
      )}
    </div>
  </div>
);

interface SingleSelectQuestionProps {
  label: string;
  options: string[];
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export const SingleSelectQuestion: React.FC<SingleSelectQuestionProps> = ({ label, options, value, onChange }) => (
  <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
    <p className="text-[14.5px] font-semibold text-[#1A202C] leading-[1.5] mb-4">{label}</p>
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
  </div>
);

interface OpenTextQuestionProps {
  label: string;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export const OpenTextQuestion: React.FC<OpenTextQuestionProps> = ({ label, value, onChange }) => (
  <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
    <p className="text-[14.5px] font-semibold text-[#1A202C] leading-[1.5] mb-1">{label}</p>
    <p className="text-[11.5px] text-[#A0AEC0] mb-3">Optional</p>
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
  </div>
);
