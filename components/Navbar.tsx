import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Home, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItem {
  label: string;
  href: string;
  emoji?: string;
  /** Small right-aligned tag, e.g. "L1" */
  badge?: string;
}

interface NavSection {
  heading?: string;
  items: readonly NavItem[];
}

type NavEntry =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'menu'; label: string; sections: readonly NavSection[] };

const AI_TOOLS: readonly NavItem[] = [
  { badge: 'L1', emoji: '🎯', label: 'Prompt Engineering Fundamentals', href: '#playground' },
  { badge: 'L2', emoji: '🤖', label: 'Build Your First AI Agent', href: '#agent-builder' },
  { badge: 'L3', emoji: '🗺️', label: 'Workflow Mapping & Design', href: '#workflow-designer' },
  { badge: 'L4', emoji: '💡', label: 'Dashboard Design Thinking', href: '#dashboard-design' },
  { badge: 'L5', emoji: '🏗️', label: 'Product Architecture Sprint', href: '#product-architecture' },
];

const NAV: readonly NavEntry[] = [
  {
    kind: 'menu',
    label: 'AI Readiness',
    sections: [
      {
        items: [
          { emoji: '🧭', label: 'AI Readiness Overview', href: '#ai-readiness' },
          { emoji: '📝', label: 'Take the Self-Assessment', href: '#innovation-readiness' },
        ],
      },
    ],
  },
  { kind: 'link', label: 'AI Sandbox', href: '#innovation-sandbox' },
  {
    kind: 'menu',
    label: 'AI Upskilling',
    sections: [
      {
        items: [
          { emoji: '🎓', label: 'Upskilling Overview', href: '#upskilling' },
          { emoji: '📋', label: 'Learning Plan', href: '#learning-pathway' },
          { emoji: '🗺️', label: 'Learner Journey', href: '#user-journey' },
        ],
      },
      { heading: 'AI Tools', items: AI_TOOLS },
    ],
  },
  { kind: 'link', label: 'Our Methodology', href: '#engagement-model' },
  { kind: 'link', label: 'Case Studies', href: '#case-studies' },
];

const DROPDOWN_CLOSE_DELAY_MS = 150;

const isMenuActive = (sections: readonly NavSection[], hash: string): boolean =>
  sections.some((s) => s.items.some((item) => item.href === hash));

/* Active = dark teal pill, inactive = transparent */
const pillBase =
  'flex items-center gap-1.5 px-4 h-[36px] rounded-full text-[14px] font-medium transition-all duration-150 whitespace-nowrap';
const pillActive = 'bg-[#2C9A94] text-white';
const pillInactive = 'text-[#4A5568] hover:text-[#2D3748]';

const mobileRow = (active: boolean): string =>
  cn(
    'flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors',
    active ? 'bg-[#E6FFFA] text-[#2C9A94]' : 'hover:bg-[#F7FAFC] text-[#2D3748]',
  );

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[11px] font-semibold uppercase tracking-[1px] text-[#A0AEC0]">
    {children}
  </span>
);

/* Thin vertical divider between nav items */
const Divider = () => (
  <div
    className="flex-shrink-0"
    style={{ width: '1px', height: '20px', backgroundColor: '#D1D5DB' }}
  />
);

interface DropdownProps {
  label: string;
  sections: readonly NavSection[];
  currentHash: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, sections, currentHash }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), DROPDOWN_CLOSE_DELAY_MS);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        className={cn(pillBase, 'cursor-pointer', isMenuActive(sections, currentHash) ? pillActive : pillInactive)}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform duration-150', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute top-full left-1/2 pt-3 transition-all duration-150',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{ transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-4px)' }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            minWidth: '300px',
            overflow: 'hidden',
          }}
        >
          {sections.map((section, i) => (
            <div key={section.heading ?? i}>
              {i > 0 && <div style={{ height: '1px', backgroundColor: '#E2E8F0' }} />}
              {section.heading && (
                <div className="px-4 pt-3 pb-1">
                  <SectionHeading>{section.heading}</SectionHeading>
                </div>
              )}
              {section.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 transition-colors duration-150 hover:bg-[#F7FAFC] hover:text-[#38B2AC]"
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2D3748',
                    textDecoration: 'none',
                    background: currentHash === item.href ? '#E6FFFA' : undefined,
                  }}
                  onClick={() => setOpen(false)}
                >
                  {item.emoji && (
                    <span className="shrink-0 flex items-center justify-center" style={{ width: '24px', height: '24px', fontSize: '15px' }}>
                      {item.emoji}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto shrink-0 text-[11px] font-semibold" style={{ color: '#A0AEC0' }}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash);
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const isHome = !currentHash || currentHash === '#';

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isHome) {
      window.location.hash = '';
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white',
      )}
      style={{ height: '68px' }}
    >
      <div
        className="mx-auto flex items-center justify-between h-full"
        style={{ maxWidth: '1200px', padding: '0 24px' }}
      >
        {/* Left — Logo */}
        <a href="#" onClick={goHome} className="flex items-center gap-2 shrink-0">
          <img
            src="/logos/oxygy-logo-darkgray-teal.png"
            alt="OXYGY"
            style={{ height: '36px', width: 'auto' }}
          />
        </a>

        {/* Center — Desktop Nav Bar (rounded container) */}
        <div
          className="hidden lg:flex items-center gap-1.5"
          style={{ backgroundColor: '#F0F2F5', borderRadius: '28px', padding: '5px 6px' }}
        >
          <a
            href="#"
            onClick={goHome}
            className={cn(
              'flex items-center justify-center rounded-full transition-all duration-150 flex-shrink-0',
              isHome ? pillActive : 'bg-[#E2E6EB] text-[#4A5568] hover:bg-[#D1D5DB]',
            )}
            style={{ width: '36px', height: '36px' }}
            title="Home"
          >
            <Home size={17} />
          </a>

          {NAV.map((entry) => (
            <React.Fragment key={entry.label}>
              <Divider />
              {entry.kind === 'link' ? (
                <a
                  href={entry.href}
                  className={cn(pillBase, currentHash === entry.href ? pillActive : pillInactive)}
                  style={{ textDecoration: 'none' }}
                >
                  {entry.label}
                </a>
              ) : (
                <Dropdown label={entry.label} sections={entry.sections} currentHash={currentHash} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right — Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} color="#2D3748" /> : <Menu size={22} color="#2D3748" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg"
          style={{ maxHeight: 'calc(100vh - 68px)', overflowY: 'auto' }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setMobileOpen(false);
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-1" style={{ fontSize: '14px', fontWeight: 500 }}>
            <a href="#" onClick={goHome} className={mobileRow(isHome)} style={{ textDecoration: 'none' }}>
              <Home size={16} />
              <span>Home</span>
            </a>

            {NAV.map((entry) => (
              <React.Fragment key={entry.label}>
                <div className="h-px bg-gray-100 my-2" />
                {entry.kind === 'link' ? (
                  <a href={entry.href} className={mobileRow(currentHash === entry.href)} style={{ textDecoration: 'none' }}>
                    {entry.label}
                  </a>
                ) : (
                  <>
                    <div className="py-2">
                      <SectionHeading>{entry.label}</SectionHeading>
                    </div>
                    {entry.sections.map((section, i) => (
                      <React.Fragment key={section.heading ?? i}>
                        {section.heading && (
                          <div className="pt-2 pb-1 px-3">
                            <SectionHeading>{section.heading}</SectionHeading>
                          </div>
                        )}
                        {section.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className={mobileRow(currentHash === item.href)}
                            style={{ textDecoration: 'none' }}
                          >
                            {item.emoji && <span style={{ fontSize: '15px' }}>{item.emoji}</span>}
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
