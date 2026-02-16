// Dashboard Designer (Level 4) — Static Content & Configuration

// ─── Step Overview (now 3 steps, matching L3 pattern) ───
export const DASHBOARD_STEPS = [
  {
    num: 1,
    label: 'Define Your Brief',
    question: 'What does your dashboard need to do?',
    desc: 'Describe your dashboard\'s purpose, audience, and the key metrics it needs to display.',
    examples: 'Sales performance, HR learning tracker, customer success',
  },
  {
    num: 2,
    label: 'Generate Mockup',
    question: 'What should it look like?',
    desc: 'AI generates a visual dashboard mockup based on your brief. Review it, approve it, or give feedback to refine.',
    examples: 'KPI cards, trend charts, data tables, metric breakdowns',
  },
  {
    num: 3,
    label: 'Generate PRD',
    question: 'How do you hand it off?',
    desc: 'Get a comprehensive Product Requirements Document you can give to developers or AI coding tools.',
    examples: 'Widget specs, data integration, tech stack, acceptance criteria',
  },
];

// ─── Example Briefs ───
export const EXAMPLE_BRIEFS = [
  {
    q1_purpose: 'Track real-time sales performance across regions and flag underperforming territories for the VP of Sales.',
    q2_audience: 'Regional sales managers, VP of Sales, Sales operations team',
    q3_type: 'Operational Dashboard',
    q4_metrics: 'Revenue, Conversion Rate, Pipeline Value, Win Rate, Average Deal Size, Deals Closed This Month',
    q5_dataSources: 'CRM (Salesforce), SQL database, sales activity logs',
    q7_visualStyle: 'data-dense',
    label: 'Sales Performance',
  },
  {
    q1_purpose: 'Monitor employee learning progress, completion rates, and identify skill gaps across departments for our L&D team.',
    q2_audience: 'HR and L&D teams, Department heads',
    q3_type: 'Learning & Development Tracker',
    q4_metrics: 'Completion Rate, Skill Gap Score, Training Hours, Certification Count, Course Satisfaction Rating',
    q5_dataSources: 'LMS platform, Google Sheets, survey responses',
    q7_visualStyle: 'clean-minimal',
    label: 'HR Learning Tracker',
  },
  {
    q1_purpose: 'Show NPS trends, support ticket volume by category, feature adoption rates, and churn risk indicators.',
    q2_audience: 'Customer success managers, Product team leads',
    q3_type: 'Analytical Dashboard',
    q4_metrics: 'NPS Score, Ticket Volume, Feature Adoption Rate, Churn Risk Score, CSAT, First Response Time',
    q5_dataSources: 'Mixpanel, Zendesk API, product analytics',
    q7_visualStyle: 'executive-polished',
    label: 'Customer Success',
  },
];

// ─── Dashboard Type Options (dropdown) ───
export const DASHBOARD_TYPE_OPTIONS = [
  'Executive Overview',
  'Operational Dashboard',
  'Analytical Dashboard',
  'Client-Facing Report',
  'Learning & Development Tracker',
  'Project Management Hub',
];

// ─── Visual Style Options (dropdown) ───
export const VISUAL_STYLE_OPTIONS = [
  { id: 'clean-minimal', label: 'Clean & Minimal' },
  { id: 'data-dense', label: 'Data-Dense' },
  { id: 'executive-polished', label: 'Executive & Polished' },
  { id: 'colorful-visual', label: 'Colorful & Visual' },
];

// ─── PRD Section Definitions (with descriptions & examples for the overview dropdown) ───
export const PRD_SECTIONS = [
  {
    key: 'dashboard_overview',
    title: 'Dashboard Overview',
    description: 'The elevator pitch for your dashboard — what it does, who requested it, what business problem it solves, and success metrics for the dashboard itself.',
    example: 'Dashboard name, one-line pitch, 3-5 success KPIs (e.g., adoption rate >80%, time-to-insight <30s), scope boundaries.',
  },
  {
    key: 'target_users',
    title: 'Target Users & User Stories',
    description: 'Detailed user personas with roles, goals, and technical comfort, plus concrete user stories in the "As a [role], I want to [action] so that [outcome]" format.',
    example: '2-3 personas (e.g., VP of Sales, Regional Manager), 5-8 user stories, usage frequency per persona.',
  },
  {
    key: 'information_architecture',
    title: 'Information Architecture',
    description: 'How the dashboard is structured — page layout, content zones, navigation patterns, and state management (default view, filtered view, error states).',
    example: 'Top banner: 4 KPI cards. Middle: 2-column chart area. Bottom: paginated data table. Tab navigation between Overview / Detail views.',
  },
  {
    key: 'widget_specifications',
    title: 'Widget Specifications',
    description: 'A per-metric breakdown specifying widget type, data displayed, visualization details, grid position, interaction behavior, and update frequency.',
    example: 'Revenue: KPI card, Row 1 Col 1, shows current value + % change vs. last period, click drills into regional breakdown.',
  },
  {
    key: 'visual_design',
    title: 'Visual Design Requirements',
    description: 'Complete design system — color palette with hex codes, typography scale, spacing system (4px/8px grid), card specs, chart color sequences, and accessibility requirements.',
    example: 'Primary: #38B2AC, Font: DM Sans, H1: 32px/700, Cards: white bg, 16px radius, 1px #E2E8F0 border, WCAG 2.1 AA.',
  },
  {
    key: 'tech_stack',
    title: 'Recommended Tech Stack',
    description: 'Frontend framework, charting library, backend/API layer, database, hosting, and authentication — with rationale for each choice based on the dashboard\'s requirements.',
    example: 'React + TypeScript, Recharts for charts, Supabase for backend, Vercel for hosting, Clerk for auth.',
  },
  {
    key: 'data_integration',
    title: 'Data Integration',
    description: 'Every data source with connection method, refresh strategy, transformation pipeline, caching approach, error handling, and access control.',
    example: 'Salesforce: REST API, 15-min polling, raw → cleaned → aggregated, Redis cache (5-min TTL), stale-data indicator on failure.',
  },
  {
    key: 'interactions_filtering',
    title: 'Interactions & Filtering',
    description: 'Global filters (date range, refresh), dimension filters, cross-filtering between widgets, drill-down paths, search, sort behavior, and export options.',
    example: 'Date presets: Today / 7D / 30D / 90D / Custom. Clicking a KPI card filters all charts. Export: CSV, PDF, scheduled email.',
  },
  {
    key: 'responsive_behavior',
    title: 'Responsive Behavior',
    description: 'Layout specifications for desktop (>1200px), tablet (768-1200px), and mobile (<768px) — including which widgets stack, collapse, or hide at each breakpoint.',
    example: 'Desktop: 12-col grid. Tablet: 2-col stack, charts full-width. Mobile: single column, KPIs as horizontal scroll.',
  },
  {
    key: 'human_checkpoints',
    title: 'Human-in-the-Loop Checkpoints',
    description: 'Review processes for data accuracy, metric definitions, alert thresholds, access control, change management, and anomaly escalation.',
    example: 'Data team verifies metric calculations before launch. Product owner approves threshold changes. Anomaly alerts go to Slack #data-alerts.',
  },
  {
    key: 'acceptance_criteria',
    title: 'Acceptance Criteria',
    description: 'Specific, binary pass/fail testable criteria covering data accuracy, performance, responsiveness, accessibility, edge cases, and cross-browser compatibility.',
    example: '1. Dashboard loads in <2s. 2. All KPIs show live data. 3. Filters persist across page refresh. 4. WCAG 2.1 AA compliant.',
  },
];

// ─── "Why Mockup First?" tooltip content ───
export const WHY_MOCKUP_TOOLTIP = 'Generating a visual mockup before writing code is a powerful shortcut. Vibe coding tools like Lovable, Bolt.new, V0, and Cursor can accept mockup images as input and recreate layouts in code far more accurately than text descriptions. A picture eliminates ambiguity, iteration is cheaper at the image stage, and the structured JSON prompt can serve as a configuration file for your actual build.';

// ─── Inspiration Sites (with clickable links) ───
export const INSPIRATION_SITES = [
  { name: 'Tableau Public Gallery', url: 'https://public.tableau.com/app/discover' },
  { name: 'Dribbble', url: 'https://dribbble.com/search/dashboard' },
  { name: 'Behance', url: 'https://www.behance.net/search/projects?search=dashboard+design' },
  { name: 'Databox Templates', url: 'https://databox.com/dashboard-examples' },
  { name: 'Looker Studio Gallery', url: 'https://lookerstudio.google.com/gallery' },
];

export const INSPIRATION_TOOLTIP_CONTENT = 'Browse the inspiration sites below for dashboard layout ideas, then paste a URL or upload a screenshot to guide your mockup generation.';
