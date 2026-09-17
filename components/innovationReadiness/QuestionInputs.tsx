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

interface QuestionCardProps {
  label: string;
  children: React.ReactNode;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ label, children }) => (
  <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
    <p className="text-[14.5px] font-semibold text-[#1A202C] leading-[1.5] mb-4">{label}</p>
    {children}
  </div>
);

export interface LikertTableRow {
  id: string;
  label: string;
  value: AnswerValue;
  allowNotApplicable?: boolean;
}

interface LikertTableProps {
  rows: LikertTableRow[];
  onChange: (id: string, value: AnswerValue) => void;
}

/** A block of Likert questions rendered as one table: the 1–5 scale labels (and "N/A") appear
 * once in the header instead of repeating under every question. */
export const LikertTable: React.FC<LikertTableProps> = ({ rows, onChange }) => {
  const showNA = rows.some((r) => r.allowNotApplicable);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: showNA ? 860 : 750 }}>
          <thead>
            <tr style={{ backgroundColor: '#F7FAFC' }}>
              <th className="text-left px-5 py-5" />
              {LIKERT_LABELS.map((l) => (
                <th key={l} className="px-2 py-5 text-center align-bottom" style={{ width: 108 }}>
                  <span className="block text-[13px] font-semibold text-[#4A5568] leading-[1.35]">{l}</span>
                </th>
              ))}
              {showNA && (
                <th className="px-2 py-5 text-center align-bottom" style={{ width: 68 }}>
                  <span className="block text-[12px] font-bold uppercase text-[#A0AEC0]">N/A</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} style={{ backgroundColor: i % 2 === 1 ? '#EDF2F7' : 'transparent' }}>
                <td className="px-5 py-7 align-middle max-w-[280px] sm:max-w-[360px]">
                  <span className="text-[14.5px] font-semibold text-[#2D3748] leading-[1.45]">{row.label}</span>
                </td>
                {[1, 2, 3, 4, 5].map((score) => {
                  const active = row.value === score;
                  return (
                    <td key={score} className="text-center align-middle">
                      <button
                        type="button"
                        onClick={() => onChange(row.id, score)}
                        aria-label={`${row.label}: ${LIKERT_LABELS[score - 1]}`}
                        className="w-9 h-9 rounded-full mx-auto flex items-center justify-center text-[13px] font-bold transition-all"
                        style={{
                          backgroundColor: active ? ACCENT : '#F7FAFC',
                          border: active ? `1.5px solid ${ACCENT}` : '1px solid #E2E8F0',
                          color: active ? '#FFFFFF' : '#A0AEC0',
                        }}
                      >
                        {score}
                      </button>
                    </td>
                  );
                })}
                {showNA && (
                  <td className="text-center align-middle">
                    {row.allowNotApplicable && (
                      <button
                        type="button"
                        onClick={() => onChange(row.id, null)}
                        aria-label={`${row.label}: Not Applicable`}
                        className="w-9 h-9 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold transition-all"
                        style={{
                          backgroundColor: row.value === null ? '#A0AEC0' : '#F7FAFC',
                          border: row.value === null ? '1.5px solid #A0AEC0' : '1px solid #E2E8F0',
                          color: row.value === null ? '#FFFFFF' : '#CBD5E0',
                        }}
                      >
                        &ndash;
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface LikertMultiQuestionProps {
  label: string;
  items: string[];
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

/** One Likert row per item (e.g. one per AI tool), rolled up into a single tool→rating map answer. */
export const LikertMultiQuestion: React.FC<LikertMultiQuestionProps> = ({ label, items, value, onChange }) => {
  const record = value && typeof value === 'object' ? (value as Record<string, number | null>) : {};
  const rows: LikertTableRow[] = items.map((item) => ({ id: item, label: item, value: record[item] ?? undefined, allowNotApplicable: true }));
  const setItem = (item: string, v: AnswerValue) => onChange({ ...record, [item]: typeof v === 'number' ? v : null });

  return (
    <QuestionCard label={label}>
      <LikertTable rows={rows} onChange={setItem} />
    </QuestionCard>
  );
};

interface SingleSelectQuestionProps {
  label: string;
  options: string[];
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export const SingleSelectQuestion: React.FC<SingleSelectQuestionProps> = ({ label, options, value, onChange }) => (
  <QuestionCard label={label}>
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
  onChange: (value: AnswerValue) => void;
}

export const OpenTextQuestion: React.FC<OpenTextQuestionProps> = ({ label, value, onChange }) => (
  <QuestionCard label={label}>
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
