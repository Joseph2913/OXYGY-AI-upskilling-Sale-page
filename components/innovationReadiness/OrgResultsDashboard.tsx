import React, { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { AssessmentResult, AssessmentRespondent, QUADRANT_INFO, ProfileId, CategoryScore } from '../../data/innovationReadinessPersonas';
import { MaturityProfileChart } from './MaturityProfileChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { SummaryStatsRow } from './SummaryStatsRow';

const ACCENT = '#2B4C7E';
const DARK = '#1E3A5F';
const PALE_BORDER = '#C7D3E8';
const BORDER = '#CBD5E0';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

type FilterDim = keyof AssessmentRespondent;
const FILTER_DIMS: { key: FilterDim; label: string }[] = [
  { key: 'department', label: 'Department' },
  { key: 'roleLevel', label: 'Role level' },
  { key: 'tenure', label: 'Tenure' },
  { key: 'location', label: 'Location' },
];

const mean = (values: number[]): number => (values.length === 0 ? 0 : values.reduce((s, v) => s + v, 0) / values.length);

interface FilterChipGroupProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}

/** Fixed at 3 rows regardless of how many options a dimension has, so every filter column takes
 * up the same amount of space — options beyond the top 3 (by frequency) aren't shown as chips. */
const FilterChipGroup: React.FC<FilterChipGroupProps> = ({ label, options, selected, onToggle }) => (
  <div>
    <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#A0AEC0] mb-2">{label}</p>
    <div className="flex flex-col items-start gap-1.5">
      {options.map((option) => {
        const active = selected.has(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className="self-start rounded-full px-3 py-1 text-[12px] font-semibold transition-all truncate max-w-full"
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

interface OrgResultsDashboardProps {
  results: AssessmentResult[];
}

/**
 * Aggregates many individual `AssessmentResult`s into an org-level picture: average axis
 * placement, quadrant distribution, per-category averages, and demographic filter chips built
 * from whatever values are actually present in the dataset (department, role level, tenure,
 * location) — since those are the same fields the individual survey already collects.
 */
export const OrgResultsDashboard: React.FC<OrgResultsDashboardProps> = ({ results }) => {
  const [filters, setFilters] = useState<Record<FilterDim, Set<string>>>({
    roleLevel: new Set(),
    department: new Set(),
    tenure: new Set(),
    location: new Set(),
  });

  /** Top 3 values by respondent count, not every distinct value — keeps each filter column the
   * same fixed height instead of growing with however many departments/locations exist. */
  const optionsFor = (dim: FilterDim): string[] => {
    const counts = new Map<string, number>();
    results.forEach((r) => {
      const value = r.respondent[dim];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([value]) => value);
  };

  const toggleFilter = (dim: FilterDim, value: string) => {
    setFilters((prev) => {
      const next = new Set(prev[dim]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [dim]: next };
    });
  };

  const clearFilters = () => setFilters({ roleLevel: new Set(), department: new Set(), tenure: new Set(), location: new Set() });
  const activeFilterCount = FILTER_DIMS.reduce((n, { key }) => n + filters[key].size, 0);

  const filtered = useMemo(
    () =>
      results.filter((r) =>
        FILTER_DIMS.every(({ key }) => filters[key].size === 0 || filters[key].has(r.respondent[key]))
      ),
    [results, filters]
  );

  const meanStrategic = mean(filtered.map((r) => r.axisScores.strategicContext));
  const meanWork = mean(filtered.map((r) => r.axisScores.workEnvironment));
  const overall = (meanStrategic + meanWork) / 2;

  const categoryAverages: CategoryScore[] = useMemo(() => {
    if (filtered.length === 0) return [];
    const byCategory = filtered[0].categoryScores.map((c) => c.category);
    return byCategory.map((category) => {
      const matching = filtered.flatMap((r) => r.categoryScores.filter((c) => c.category === category));
      return { category, label: matching[0]?.label ?? category, score: mean(matching.map((c) => c.score)) };
    });
  }, [filtered]);

  const strongest = categoryAverages.length > 0 ? categoryAverages.reduce((a, b) => (b.score > a.score ? b : a)) : null;
  const gap = categoryAverages.length > 0 ? categoryAverages.reduce((a, b) => (b.score < a.score ? b : a)) : null;
  const responseRate = results.length === 0 ? 0 : Math.round((filtered.length / results.length) * 100);

  const quadrantCounts = useMemo(() => {
    const counts: Record<ProfileId, number> = { 'sitting-duck': 0, 'disconnected-antenna': 0, 'island-of-creativity': 0, 'systematic-innovator': 0 };
    filtered.forEach((r) => {
      counts[r.quadrant] += 1;
    });
    return counts;
  }, [filtered]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-1">Org View &mdash; your response within the wider organisation (mock data)</p>
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#1A202C]">Where the organisation stands</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold" style={{ backgroundColor: '#EAF0F8', color: DARK, border: `1px solid ${PALE_BORDER}` }}>
          <Users size={14} /> {filtered.length} of {results.length} respondents
        </span>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-4 sm:p-5 mb-6" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0]">Segment by</p>
          {activeFilterCount > 0 && (
            <button type="button" onClick={clearFilters} className="text-[12px] font-semibold" style={{ color: ACCENT }}>
              Clear filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FILTER_DIMS.map(({ key, label }) => (
            <FilterChipGroup key={key} label={label} options={optionsFor(key)} selected={filters[key]} onToggle={(v) => toggleFilter(key, v)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center text-center px-6 py-14" style={{ backgroundColor: '#F7FAFC', border: `1.5px dashed ${PALE_BORDER}` }}>
          <p className="text-[15px] font-bold text-[#1A202C]">No respondents match these filters</p>
          <p className="text-[13.5px] text-[#718096] mt-1">Try clearing one or more segments.</p>
        </div>
      ) : (
        <>
          <SummaryStatsRow
            stats={[
              { label: 'Overall score', value: `${overall.toFixed(1)} / 5` },
              { label: 'Strongest area', value: strongest?.label ?? '—' },
              { label: 'Biggest gap', value: gap?.label ?? '—' },
              { label: 'Response rate', value: `${responseRate}%` },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: category averages */}
            <div className="rounded-xl p-5" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-4">Score by category (group average)</p>
              <CategoryBreakdownChart categories={categoryAverages} />
            </div>

            {/* Right: maturity scatter + quadrant distribution */}
            <div>
              <div className="rounded-xl p-5" style={{ border: `1.5px dashed ${BORDER}`, backgroundColor: '#FAFBFC' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-4">Maturity profile</p>
                <MaturityProfileChart
                  points={[{ id: 'group-average', strategicContext: meanStrategic, workEnvironment: meanWork, color: DARK, size: 'lg' as const, title: 'Group average' }]}
                />
                <p className="text-[11px] font-semibold text-[#A0AEC0] text-center mt-4">
                  Average across the {filtered.length} selected respondent{filtered.length === 1 ? '' : 's'} &mdash; moves as filters change
                </p>
              </div>

              <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A0AEC0] mb-3">Quadrant distribution</p>
                <div className="space-y-2">
                  {(Object.keys(QUADRANT_INFO) as ProfileId[]).map((id) => {
                    const info = QUADRANT_INFO[id];
                    const count = quadrantCounts[id];
                    const pct = filtered.length === 0 ? 0 : (count / filtered.length) * 100;
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: info.color }} />
                        <span className="text-[12.5px] font-semibold text-[#2D3748] w-[150px] shrink-0">{info.name}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: info.color }} />
                        </div>
                        <span className="text-[12px] font-bold text-[#4A5568] w-[42px] text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
