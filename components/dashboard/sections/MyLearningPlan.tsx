import React, { useState } from 'react';
import { ChevronDown, Check, BookOpen } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { generateDefaultLearningPlan, LEVEL_ACCENTS, DEFAULT_PROFILE } from '../../../data/dashboard-content';
import type { LevelBlock, UserProfile } from '../../../data/dashboard-types';

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  'not-started': { label: 'Not Started', bg: '#EDF2F7', text: '#718096' },
  'in-progress': { label: 'In Progress', bg: '#E6FFFA', text: '#38B2AC' },
  'complete': { label: 'Complete', bg: '#C6F6D5', text: '#276749' },
};

export const MyLearningPlan: React.FC = () => {
  const [profile] = useLocalStorage<UserProfile>('oxygy_user_profile', DEFAULT_PROFILE);
  const [plan, setPlan] = useLocalStorage<LevelBlock[]>('oxygy_learning_plan', []);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(() => {
    // Expand the first in-progress level by default
    const inProgress = plan.find((l) => l.status === 'in-progress');
    return new Set(inProgress ? [inProgress.level] : plan.length > 0 ? [plan[0].level] : []);
  });

  const isProfileComplete = profile.fullName && profile.function && profile.seniority;

  const handleGeneratePlan = () => {
    const defaultPlan = generateDefaultLearningPlan();
    setPlan(defaultPlan);
    setExpandedLevels(new Set([2])); // Expand Level 2 (first in-progress)
  };

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const toggleActivity = (levelIdx: number, activityIdx: number) => {
    setPlan((prev) => {
      const next = prev.map((block, i) => {
        if (i !== levelIdx) return block;
        const activities = block.activities.map((a, j) =>
          j === activityIdx ? { ...a, completed: !a.completed } : a,
        );
        const completedCount = activities.filter((a) => a.completed).length;
        const total = activities.length;
        const status =
          completedCount === 0 ? 'not-started' as const
          : completedCount === total ? 'complete' as const
          : 'in-progress' as const;
        return { ...block, activities, status };
      });
      return next;
    });
  };

  // Empty state
  if (plan.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '48px 28px',
          textAlign: 'center',
        }}
      >
        <BookOpen size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, color: '#4A5568', margin: '0 0 8px', fontWeight: 500 }}>
          {isProfileComplete
            ? 'You haven\'t generated a learning plan yet.'
            : 'You haven\'t generated a learning plan yet. Complete your profile to get a personalized plan.'}
        </p>
        <button
          onClick={handleGeneratePlan}
          className="dash-focus"
          style={{
            marginTop: 16,
            padding: '10px 20px',
            borderRadius: 24,
            border: 'none',
            backgroundColor: '#38B2AC',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2C9A94'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#38B2AC'; }}
        >
          Generate My Plan →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {plan.map((block, blockIdx) => {
        const accent = LEVEL_ACCENTS[block.level];
        const isExpanded = expandedLevels.has(block.level);
        const statusInfo = STATUS_LABELS[block.status];
        const completedCount = block.activities.filter((a) => a.completed).length;
        const progressPct = block.activities.length > 0
          ? Math.round((completedCount / block.activities.length) * 100)
          : 0;

        return (
          <div
            key={block.level}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: `4px solid ${accent.light}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <button
              onClick={() => toggleLevel(block.level)}
              aria-expanded={isExpanded}
              className="dash-focus"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A202C', flex: 1 }}>
                {block.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                  backgroundColor: statusInfo.bg,
                  color: statusInfo.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {statusInfo.label}
              </span>
              <ChevronDown
                size={18}
                color="#718096"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 250ms ease',
                  flexShrink: 0,
                }}
              />
            </button>

            {/* Progress bar */}
            <div style={{ padding: '0 20px', marginBottom: isExpanded ? 0 : 16 }}>
              <div
                style={{
                  height: 4,
                  backgroundColor: '#E2E8F0',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    backgroundColor: accent.light,
                    borderRadius: 2,
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: '#A0AEC0',
                  marginTop: 4,
                  textAlign: 'right',
                }}
              >
                {completedCount} of {block.activities.length} — {progressPct}%
              </span>
            </div>

            {/* Expanded content */}
            <div
              style={{
                maxHeight: isExpanded ? 500 : 0,
                opacity: isExpanded ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 250ms ease-out, opacity 200ms ease',
              }}
            >
              <div style={{ padding: '8px 20px 20px' }}>
                {block.activities.map((activity, actIdx) => (
                  <label
                    key={activity.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 0',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: activity.completed ? '#A0AEC0' : '#4A5568',
                      textDecoration: activity.completed ? 'line-through' : 'none',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: activity.completed ? 'none' : '2px solid #E2E8F0',
                        backgroundColor: activity.completed ? '#38B2AC' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                        transition: 'all 150ms ease',
                      }}
                    >
                      {activity.completed && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </span>
                    <input
                      type="checkbox"
                      checked={activity.completed}
                      onChange={() => toggleActivity(blockIdx, actIdx)}
                      style={{ display: 'none' }}
                    />
                    <span>{activity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
