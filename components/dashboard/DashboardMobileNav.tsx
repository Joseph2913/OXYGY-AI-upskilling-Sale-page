import React from 'react';
import { User, BarChart2, Lightbulb, Library } from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from '../../data/dashboard-content';
import type { DashboardSection } from '../../data/dashboard-types';

const ICON_MAP: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  User, BarChart2, Lightbulb, Library,
};

interface Props {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export const DashboardMobileNav: React.FC<Props> = ({ activeSection, onSectionChange }) => {
  return (
    <nav
      role="tablist"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: '#1A202C',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {SIDEBAR_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.iconName];
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSectionChange(item.id)}
            className="dash-focus"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#38B2AC' : '#A0AEC0',
              padding: '8px 4px',
              minWidth: 48,
              transition: 'color 150ms ease',
            }}
          >
            {Icon && <Icon size={20} strokeWidth={1.5} />}
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
};
