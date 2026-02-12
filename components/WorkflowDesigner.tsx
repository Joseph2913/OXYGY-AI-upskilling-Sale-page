import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, ClipboardList, Brain, GitBranch, FileOutput, Send,
  ChevronRight, ChevronDown, ChefHat, Map, Link, Users, Sparkles, Workflow,
  BarChart3, CheckCircle, Loader2, User,
} from 'lucide-react';
import { ArtifactClosing } from './ArtifactClosing';

/* ═══════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════ */

interface SkillAssessment {
  name: string;
  level: string;
  percentage: number;
}

interface GapItem {
  skill: string;
  severity: 'critical' | 'secondary' | 'growth';
  detail: string;
}

interface Module {
  name: string;
  duration: string;
  format: string;
}

interface ProfileData {
  id: string;
  name: string;
  fullName: string;
  role: string;
  department: string;
  seniority: string;
  traits: string;
  initials: string;
  avatarColor: string;
  skillTags: string[];
  analysis: { skills: SkillAssessment[]; patterns: string };
  gapMap: { gaps: GapItem[]; routing: string };
  trainingPlan: {
    title: string;
    startingLevel: string;
    modules: Module[];
    stretchGoal: string;
    timeline: string;
    successMetrics: string;
  };
  email: {
    to: string;
    subject: string;
    cc: string;
    ccRole: string;
    bodyPreview: string;
    attachment: string;
  };
}

interface ToolDef {
  name: string;
  color: string;
}

interface PipelineStepDef {
  num: number;
  label: string;
  icon: React.ElementType;
  tools: ToolDef[];
  oneLiner: string;
}

interface EducationalCardDef {
  borderColor: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  analogyHook: string;
  description: string;
  learnOutcome: string;
  tools: ToolDef[];
  toolsLabel: string;
}

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS — PIPELINE
   ═══════════════════════════════════════════════════════════════════ */

const PIPELINE: PipelineStepDef[] = [
  { num: 1, label: 'Collect', icon: ClipboardList, tools: [{ name: 'Google Forms', color: '#673AB7' }, { name: 'Typeform', color: '#262627' }, { name: 'Airtable', color: '#18BFFF' }], oneLiner: 'Gather structured input from users via forms or surveys' },
  { num: 2, label: 'Analyze', icon: Brain, tools: [{ name: 'ChatGPT', color: '#10A37F' }, { name: 'Claude', color: '#D4A574' }], oneLiner: 'AI agents process, tag, and interpret the raw data' },
  { num: 3, label: 'Map', icon: GitBranch, tools: [{ name: 'Make', color: '#6D00CC' }, { name: 'Zapier', color: '#FF4A00' }, { name: 'n8n', color: '#EA4B71' }], oneLiner: 'Route results through logic trees based on roles and rules' },
  { num: 4, label: 'Generate', icon: FileOutput, tools: [{ name: 'ChatGPT', color: '#10A37F' }, { name: 'Claude', color: '#D4A574' }], oneLiner: 'Produce personalized outputs (plans, reports, emails)' },
  { num: 5, label: 'Deliver', icon: Send, tools: [{ name: 'Gmail API', color: '#EA4335' }, { name: 'Slack API', color: '#4A154B' }], oneLiner: 'Automatically send tailored results to the right people' },
];

const STEP_LABELS = ['Collect', 'Analyze', 'Map', 'Generate', 'Deliver'];

const STEP_ANALOGIES = [
  '\u{1F4E6} Ingredients received — raw survey responses checked in',
  '\u{1F52A} Prep station — sorting and categorizing ingredients',
  '\u{1F5FA}\uFE0F The head chef checks the order — adjusting for dietary needs',
  '\u{1F37D}\uFE0F Plating the dish — assembled to order',
  '\u{1F69A} Service — delivered to the diner\'s table',
];

const STEP_HITL = [
  '\u2713 Data validated — no PII issues detected',
  '\u{1F464} Analyst review recommended — verify AI skill assessments against manager input',
  '\u{1F464} Manager approval point — confirm gap assessment aligns with team priorities',
  '\u{1F464} L&D review — verify plan is realistic and aligned with available resources',
  '\u2713 Delivery confirmed — feedback loop activated for Week 4 check-in',
];

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS — EDUCATIONAL CARDS
   ═══════════════════════════════════════════════════════════════════ */

const EDUCATIONAL_CARDS: EducationalCardDef[] = [
  {
    borderColor: '#38B2AC', icon: Map, iconColor: '#38B2AC',
    title: 'AI Workflow Mapping',
    analogyHook: 'Designing the kitchen layout before you cook',
    description: 'Before building anything, you map where AI fits into your existing processes. Just like a chef designs the kitchen layout so ingredients flow efficiently from station to station, workflow mapping identifies which steps in a process can be enhanced or automated by AI — and in what order.',
    learnOutcome: 'Identify where and how AI fits into end-to-end processes like surveys, onboarding, or reporting.',
    tools: [{ name: 'Google Forms', color: '#673AB7' }, { name: 'Airtable', color: '#18BFFF' }, { name: 'Miro', color: '#FFD02F' }],
    toolsLabel: 'Use case mapping templates, swimlane flowcharts',
  },
  {
    borderColor: '#C4A934', icon: Link, iconColor: '#C4A934',
    title: 'Agent Chaining',
    analogyHook: 'Passing dishes from station to station',
    description: "Agent chaining connects multiple AI agents so they perform multi-step actions in sequence — analyze \u2192 recommend \u2192 email. Like a kitchen brigade where the prep cook's output becomes the sauce chef's input, each agent takes the previous agent's output and transforms it further.",
    learnOutcome: 'Connect multiple GPTs to perform multi-step actions (e.g., analyze \u2192 recommend \u2192 email).',
    tools: [{ name: 'Zapier', color: '#FF4A00' }, { name: 'Make', color: '#6D00CC' }, { name: 'n8n', color: '#EA4B71' }],
    toolsLabel: 'Tools like Zapier, Make, or n8n',
  },
  {
    borderColor: '#F5B8A0', icon: Users, iconColor: '#D47B5A',
    title: 'Input Logic & Role Mapping',
    analogyHook: "Knowing the diner's dietary requirements before cooking",
    description: "Not every user is the same, and neither is their data. Input logic interprets who the user is and what their input means — a junior's survey response needs different processing than a manager's. Role mapping ensures the workflow tailors its processing based on the persona, seniority, or department of each individual.",
    learnOutcome: 'Build logic for interpreting who the user is and what their input means (e.g., junior vs. manager).',
    tools: [],
    toolsLabel: 'Prompt logic trees, persona-linked tagging',
  },
  {
    borderColor: '#C3D0F5', icon: Sparkles, iconColor: '#5B6DC2',
    title: 'Automated Output Generation',
    analogyHook: 'The perfectly plated dish, made to order',
    description: "Once data has been collected, analyzed, and mapped, automated output generation triggers dynamic, personalized results. Like a kitchen that plates each dish exactly to the diner's order, this step produces tailored training plans, recommendations, or emails — no manual drafting required.",
    learnOutcome: 'Trigger dynamic, personalized outputs based on data (e.g., survey results \u2192 training plan).',
    tools: [{ name: 'ChatGPT', color: '#10A37F' }, { name: 'Claude', color: '#D4A574' }],
    toolsLabel: 'Output tailoring agent, email automation',
  },
  {
    borderColor: '#A8F0E0', icon: Workflow, iconColor: '#38B2AC',
    title: 'Process Use Case — The Full Pipeline',
    analogyHook: 'From farm to table — the complete dining experience',
    description: "This is the capstone: build a full system from end to end. The example you'll explore below demonstrates the complete flow: Skills Survey \u2192 AI Analysis \u2192 Gap Mapping \u2192 Training Plan \u2192 Email to User. Like orchestrating an entire restaurant service, you'll see how each agent contributes to a seamless multi-agent workflow.",
    learnOutcome: 'Build full systems: e.g., Skills Survey \u2192 AI Analysis \u2192 Gap Mapping \u2192 Training Plan \u2192 Email to User.',
    tools: [{ name: 'Make', color: '#6D00CC' }, { name: 'Zapier', color: '#FF4A00' }, { name: 'n8n', color: '#EA4B71' }, { name: 'Airtable', color: '#18BFFF' }],
    toolsLabel: 'Walkthrough of a complete multi-agent flow',
  },
  {
    borderColor: '#F7E8A4', icon: BarChart3, iconColor: '#C4A934',
    title: 'Performance & Feedback Loops',
    analogyHook: 'Reading the restaurant reviews and improving the menu',
    description: "A great restaurant doesn't just serve food — it tracks reviews, customer satisfaction, and ingredient quality to continuously improve. AI workflows need the same: tracking adoption, flagging gaps, and incorporating user feedback so the system gets better over time.",
    learnOutcome: 'Track adoption, flag gaps, and incorporate user feedback for continuous improvement.',
    tools: [],
    toolsLabel: 'KPI dashboard, AI usage tracker, feedback forms',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS — PROFILE DATA
   ═══════════════════════════════════════════════════════════════════ */

const PROFILES: ProfileData[] = [
  {
    id: 'sarah', name: 'Sarah', fullName: 'Sarah Chen',
    role: 'Junior Consultant', department: 'Consulting & Delivery', seniority: '1 year',
    traits: 'Enthusiastic about AI but limited experience. Strong writing, weak data analysis. Wants to learn prompt engineering.',
    initials: 'SC', avatarColor: '#38B2AC',
    skillTags: ['Prompt Curious', 'Strong Writer', 'Creative AI'],
    analysis: {
      skills: [
        { name: 'Prompt Engineering', level: 'Beginner', percentage: 25 },
        { name: 'Data Analysis', level: 'Needs Development', percentage: 15 },
        { name: 'Creative AI Tools', level: 'Moderate Interest', percentage: 55 },
        { name: 'Communication & Writing', level: 'Strong', percentage: 80 },
        { name: 'AI Ethics Awareness', level: 'Basic', percentage: 30 },
      ],
      patterns: 'Shows strong enthusiasm for creative applications. Writing skills can accelerate prompt engineering learning. Biggest gaps in analytical and technical foundations.',
    },
    gapMap: {
      gaps: [
        { skill: 'Prompt Engineering Fundamentals', severity: 'critical', detail: 'Level 1 priority' },
        { skill: 'Data Analysis for AI', severity: 'secondary', detail: 'Level 1 module' },
        { skill: 'Creative AI', severity: 'growth', detail: 'Level 1 then Level 2' },
      ],
      routing: "As a Junior Consultant with 1 year experience, Sarah's plan starts at Level 1 with emphasis on prompt engineering and everyday use cases. Her strong writing skills mean she can progress quickly to Level 2 agent building within 6\u20138 weeks.",
    },
    trainingPlan: {
      title: "Sarah's AI Upskilling Journey \u2014 Q1 2026",
      startingLevel: 'Level 1: Fundamentals & Awareness',
      modules: [
        { name: 'What is an LLM?', duration: '1hr', format: 'Self-paced microlearning' },
        { name: 'Prompting Basics', duration: '2hrs', format: 'Live workshop + practice' },
        { name: 'Everyday Use Cases', duration: '1.5hrs', format: 'Hands-on with real consulting tasks' },
        { name: 'Intro to Creative AI', duration: '1hr', format: 'Creative AI Playground session' },
        { name: 'Responsible Use', duration: '1hr', format: 'Case scenarios + discussion' },
        { name: 'Prompt Library Creation', duration: 'Ongoing', format: 'Build your consulting prompt toolkit' },
      ],
      stretchGoal: 'Level 2 \u2014 "Build Your First AI Agent" workshop (target: Week 8)',
      timeline: '6-week program, 2\u20133 hours per week',
      successMetrics: 'Complete prompt library with 20+ consulting-specific prompts. Demonstrate confident daily AI use in 3+ work tasks.',
    },
    email: {
      to: 'sarah.chen@company.com',
      subject: 'Your Personalized AI Learning Plan is Ready \u{1F680}',
      cc: 'james.williams@company.com', ccRole: 'Manager',
      bodyPreview: "Hi Sarah, Your AI upskilling journey starts now! Based on your skills assessment, we've created a personalized 6-week learning plan focused on building your prompt engineering foundations and exploring creative AI tools...",
      attachment: 'Training_Plan_Sarah_Chen_Q1_2026.pdf',
    },
  },
  {
    id: 'marcus', name: 'Marcus', fullName: 'Marcus Okonkwo',
    role: 'Operations Director', department: 'Ops & Process Excellence', seniority: '8 years',
    traits: 'Skeptical of AI. Strong process management, limited tech fluency. Needs to see ROI before adopting.',
    initials: 'MO', avatarColor: '#C4A934',
    skillTags: ['Process Expert', 'ROI-Focused', 'Change Leader'],
    analysis: {
      skills: [
        { name: 'Process Management', level: 'Expert', percentage: 90 },
        { name: 'AI Tool Familiarity', level: 'Limited', percentage: 10 },
        { name: 'Data Interpretation', level: 'Strong', percentage: 70 },
        { name: 'Change Management', level: 'Advanced', percentage: 75 },
        { name: 'Technical Fluency', level: 'Needs Development', percentage: 20 },
      ],
      patterns: 'Strong operational and process expertise but significant AI skepticism. Needs clear ROI framing. Will benefit most from seeing AI applied to processes he already manages well.',
    },
    gapMap: {
      gaps: [
        { skill: 'AI Fundamentals & Practical Exposure', severity: 'critical', detail: 'Level 1 with executive framing' },
        { skill: 'Workflow Automation Awareness', severity: 'secondary', detail: 'Level 3 overview' },
        { skill: 'Process expertise', severity: 'growth', detail: 'Bridge to Level 3 concepts' },
      ],
      routing: "As an Operations Director with 8 years experience, Marcus needs ROI-focused introduction. His process expertise is an asset \u2014 Level 1 should emphasize operational use cases. Fast-track to Level 3 concepts where his process mapping skills directly apply.",
    },
    trainingPlan: {
      title: "Marcus's AI Integration Pathway \u2014 Q1 2026",
      startingLevel: 'Level 1: Fundamentals (ROI-focused track)',
      modules: [
        { name: 'What is an LLM?', duration: '45min', format: 'Executive briefing format' },
        { name: 'Everyday Use Cases', duration: '2hrs', format: 'Focus on ops & reporting tasks' },
        { name: 'Prompting Basics', duration: '1.5hrs', format: 'Applied to process documentation' },
        { name: 'Responsible Use', duration: '1hr', format: 'Risk and governance focus' },
        { name: 'AI Workflow Mapping (L3 preview)', duration: '2hrs', format: 'Connecting AI to operations' },
        { name: 'ROI Framework Workshop', duration: '1.5hrs', format: 'Building the business case' },
      ],
      stretchGoal: 'Level 3 \u2014 "Workflow Mapping & Design" workshop (target: Week 10)',
      timeline: '8-week program, 1.5\u20132 hours per week',
      successMetrics: 'Identify 3 operational processes suitable for AI automation. Present ROI case for one process to leadership.',
    },
    email: {
      to: 'marcus.okonkwo@company.com',
      subject: 'Your AI Integration Pathway \u2014 Designed for Operations Leaders',
      cc: 'lisa.park@company.com', ccRole: 'VP Operations',
      bodyPreview: "Hi Marcus, We've designed an AI learning pathway that speaks directly to your operational expertise. Rather than starting from scratch, your plan leverages your deep process management skills and focuses on where AI creates the most operational ROI...",
      attachment: 'AI_Integration_Pathway_Marcus_Okonkwo_Q1_2026.pdf',
    },
  },
  {
    id: 'priya', name: 'Priya', fullName: 'Priya Sharma',
    role: 'L&D Manager', department: 'HR & People', seniority: '4 years',
    traits: 'AI-curious, already using ChatGPT for content creation. Wants to build AI-powered training programs. Moderate technical skills.',
    initials: 'PS', avatarColor: '#5B6DC2',
    skillTags: ['AI User', 'Learning Designer', 'Builder Mindset'],
    analysis: {
      skills: [
        { name: 'AI Tool Usage', level: 'Moderate', percentage: 50 },
        { name: 'Prompt Engineering', level: 'Intermediate', percentage: 45 },
        { name: 'Learning Design', level: 'Expert', percentage: 85 },
        { name: 'Technical Skills', level: 'Moderate', percentage: 40 },
        { name: 'Content Creation with AI', level: 'Good', percentage: 60 },
      ],
      patterns: 'Already an active AI user with strong learning design expertise. Ideal candidate for accelerated pathway. Can contribute to building AI-powered training content for others.',
    },
    gapMap: {
      gaps: [
        { skill: 'Structured Agent Building', severity: 'critical', detail: 'Level 2 priority' },
        { skill: 'Workflow Integration for L&D', severity: 'secondary', detail: 'Level 3 module' },
        { skill: 'Learning design expertise', severity: 'growth', detail: 'Contribute to L&D AI tools' },
      ],
      routing: "As an L&D Manager with existing AI experience, Priya can fast-track through Level 1 (assessment only) and begin at Level 2. Her learning design expertise makes her a natural fit for building AI-powered training agents.",
    },
    trainingPlan: {
      title: "Priya's AI Builder Journey \u2014 Q1 2026",
      startingLevel: 'Level 2: Applied Capability (Level 1 assessment completed)',
      modules: [
        { name: 'Level 1 Assessment', duration: '30min', format: 'Validate foundations (fast-track)' },
        { name: 'What Are AI Agents?', duration: '1hr', format: 'Understanding the agent landscape' },
        { name: 'Custom GPTs', duration: '2hrs', format: 'Build an L&D-specific agent' },
        { name: 'Instruction Design', duration: '1.5hrs', format: 'System prompt engineering' },
        { name: 'Human-in-the-Loop', duration: '1hr', format: 'Applied to training assessment' },
        { name: 'Agent Templates', duration: '1.5hrs', format: 'Create reusable L&D agent library' },
      ],
      stretchGoal: 'Level 3 \u2014 "Build an automated skills assessment pipeline" (target: Week 10)',
      timeline: '8-week program, 2.5 hours per week',
      successMetrics: 'Build and deploy 2 custom AI agents for L&D use. Create a shareable agent template library for the L&D team.',
    },
    email: {
      to: 'priya.sharma@company.com',
      subject: 'Your AI Builder Journey Starts at Level 2 \u{1F6E0}\uFE0F',
      cc: 'david.nakamura@company.com', ccRole: 'Head of People',
      bodyPreview: "Hi Priya, Great news \u2014 your existing AI experience means you're ready to skip ahead! Your personalized learning plan starts at Level 2: Applied Capability, where you'll learn to build custom AI agents specifically for learning and development...",
      attachment: 'AI_Builder_Journey_Priya_Sharma_Q1_2026.pdf',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

const ToolPill: React.FC<ToolDef> = ({ name, color }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-medium text-[#2D3748] whitespace-nowrap">{name}</span>
    </span>
  );
}

const TopicCard: React.FC<{ card: EducationalCardDef }> = ({ card }) => {
  const Icon = card.icon;
  return (
    <div className="bg-white rounded-lg p-6"
      style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.borderColor}` }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={24} color={card.iconColor} strokeWidth={1.5} />
        <h3 className="text-lg font-bold text-[#1A202C]">{card.title}</h3>
      </div>
      <p className="text-sm font-medium italic mb-2" style={{ color: '#C4A934' }}>
        &ldquo;{card.analogyHook}&rdquo;
      </p>
      <p className="text-sm text-[#4A5568] leading-relaxed mb-4">{card.description}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">What you&rsquo;ll learn</p>
      <p className="text-sm text-[#2D3748] mb-4">{card.learnOutcome}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {card.tools.map(t => <ToolPill key={t.name} name={t.name} color={t.color} />)}
        {card.toolsLabel && (
          <span className="text-[11px] text-[#A0AEC0]">{card.toolsLabel}</span>
        )}
      </div>
    </div>
  );
}

const ProfileCard: React.FC<{
  profile: ProfileData; selected: boolean; onSelect: () => void;
}> = ({ profile, selected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="bg-white rounded-xl p-5 text-left transition-all w-full"
      style={{
        border: selected ? '2px solid #38B2AC' : '1px solid #E2E8F0',
        backgroundColor: selected ? '#F0FFF4' : '#FFFFFF',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: profile.avatarColor }}>
          {profile.initials}
        </div>
        <div>
          <p className="font-bold text-[#1A202C]">{profile.name}</p>
          <p className="text-sm text-[#718096]">{profile.role}</p>
          <p className="text-xs text-[#A0AEC0]">{profile.department}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {profile.skillTags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: 'rgba(247,232,164,0.3)', color: '#C4A934' }}>
            {tag}
          </span>
        ))}
      </div>
      <div className="w-full py-2 rounded-full text-sm font-semibold text-center transition-colors"
        style={selected
          ? { backgroundColor: '#38B2AC', color: '#FFFFFF' }
          : { border: '1px solid #1A202C', color: '#1A202C' }
        }>
        {selected ? '\u2713 Selected' : 'Select'}
      </div>
    </button>
  );
}

const SkillBar: React.FC<{ skill: SkillAssessment }> = ({ skill }) => {
  const barColor = skill.percentage >= 70 ? '#38B2AC' : skill.percentage >= 40 ? '#C4A934' : '#E53E3E';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-[#1A202C]">{skill.name}</span>
        <span className="text-[#718096]">{skill.level} ({skill.percentage}%)</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${skill.percentage}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

const GapCard: React.FC<{ gap: GapItem }> = ({ gap }) => {
  const cfg = {
    critical: { border: '#E53E3E', bg: '#FFF5F5', label: 'Critical Gap' },
    secondary: { border: '#C4A934', bg: '#FFFFF0', label: 'Secondary Gap' },
    growth: { border: '#38B2AC', bg: '#F0FFF4', label: 'Growth Opportunity' },
  }[gap.severity];
  return (
    <div className="rounded-lg p-3" style={{ borderLeft: `4px solid ${cfg.border}`, backgroundColor: cfg.bg }}>
      <span className="text-xs font-semibold" style={{ color: cfg.border }}>{cfg.label}</span>
      <p className="text-sm font-medium text-[#1A202C] mt-0.5">{gap.skill}</p>
      <p className="text-xs text-[#718096]">&rarr; {gap.detail}</p>
    </div>
  );
}

const TrainingPlanDisplay: React.FC<{ plan: ProfileData['trainingPlan'] }> = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0', borderTop: '4px solid #38B2AC' }}>
      <h4 className="text-xl font-bold text-[#1A202C] mb-2">{plan.title}</h4>
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
        style={{ backgroundColor: 'rgba(168,240,224,0.3)', color: '#2D3748' }}>
        {plan.startingLevel}
      </span>
      <div className="space-y-2 mb-4">
        {plan.modules.map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg"
            style={{ borderLeft: '3px solid #38B2AC', backgroundColor: i % 2 === 0 ? '#F7FAFC' : '#FFFFFF' }}>
            <span className="text-xs font-bold text-[#38B2AC] w-5 text-center shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-[#1A202C]">{m.name}</span>
              <span className="text-xs text-[#A0AEC0] ml-2">&mdash; {m.duration}</span>
            </div>
            <span className="text-xs text-[#718096] shrink-0 hidden sm:inline">{m.format}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Stretch Goal</p>
          <p className="text-[#4A5568] text-sm">{plan.stretchGoal}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Timeline</p>
          <p className="text-[#4A5568] text-sm">{plan.timeline}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Success Metrics</p>
          <p className="text-[#4A5568] text-sm">{plan.successMetrics}</p>
        </div>
      </div>
    </div>
  );
}

const EmailPreview: React.FC<{ email: ProfileData['email'] }> = ({ email }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      <div className="px-4 py-2 flex items-center gap-2"
        style={{ backgroundColor: '#F7FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FC8181]" />
          <span className="w-3 h-3 rounded-full bg-[#F6E05E]" />
          <span className="w-3 h-3 rounded-full bg-[#48BB78]" />
        </div>
        <span className="text-xs text-[#A0AEC0] ml-2">New Message</span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex text-sm">
          <span className="font-medium text-[#A0AEC0] w-16 shrink-0">To:</span>
          <span className="text-[#1A202C]">{email.to}</span>
        </div>
        <div className="flex text-sm">
          <span className="font-medium text-[#A0AEC0] w-16 shrink-0">CC:</span>
          <span className="text-[#1A202C]">{email.cc} ({email.ccRole})</span>
        </div>
        <div className="flex text-sm">
          <span className="font-medium text-[#A0AEC0] w-16 shrink-0">Subject:</span>
          <span className="font-semibold text-[#1A202C]">{email.subject}</span>
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
          <p className="text-sm text-[#4A5568] leading-relaxed">{email.bodyPreview}</p>
        </div>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
          <span className="text-xs text-[#718096]">{'\u{1F4CE}'}</span>
          <span className="text-xs font-medium text-[#2D3748]">{email.attachment}</span>
        </div>
      </div>
    </div>
  );
}

const StepContent: React.FC<{ stepNum: number; profile: ProfileData }> = ({ stepNum, profile }) => {
  switch (stepNum) {
    case 1:
      return (
        <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-3">
            Survey Response &mdash; {profile.fullName}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[#A0AEC0]">Name:</span> <span className="text-[#1A202C] font-medium">{profile.fullName}</span></div>
            <div><span className="text-[#A0AEC0]">Role:</span> <span className="text-[#1A202C] font-medium">{profile.role}</span></div>
            <div><span className="text-[#A0AEC0]">Department:</span> <span className="text-[#1A202C] font-medium">{profile.department}</span></div>
            <div><span className="text-[#A0AEC0]">Seniority:</span> <span className="text-[#1A202C] font-medium">{profile.seniority}</span></div>
          </div>
          <p className="text-sm text-[#4A5568] mt-3 leading-relaxed">{profile.traits}</p>
        </div>
      );
    case 2:
      return (
        <div className="space-y-3">
          {profile.analysis.skills.map((s, idx) => <SkillBar key={idx} skill={s} />)}
          <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E2E8F0' }}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">AI-Detected Patterns</p>
            <p className="text-sm text-[#4A5568] leading-relaxed">{profile.analysis.patterns}</p>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-3">
          {profile.gapMap.gaps.map((g, idx) => <GapCard key={idx} gap={g} />)}
          <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E2E8F0' }}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Routing Logic</p>
            <p className="text-sm text-[#4A5568] leading-relaxed">{profile.gapMap.routing}</p>
          </div>
        </div>
      );
    case 4:
      return <TrainingPlanDisplay plan={profile.trainingPlan} />;
    case 5:
      return <EmailPreview email={profile.email} />;
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export function WorkflowDesigner() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [workflowState, setWorkflowState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeViewStep, setActiveViewStep] = useState(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );

  const workflowRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const selectedProfileData = PROFILES.find(p => p.id === selectedProfile) || null;

  /* Step progression timer */
  useEffect(() => {
    if (workflowState !== 'running' || currentStep === 0 || currentStep > 5) return;
    const delay = reducedMotion ? 100 : 1200;
    const timer = setTimeout(() => {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        setActiveViewStep(currentStep + 1);
      } else {
        setWorkflowState('complete');
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [workflowState, currentStep, reducedMotion]);

  const handleRunWorkflow = useCallback(() => {
    if (!selectedProfile) return;
    setWorkflowState('running');
    setCurrentStep(1);
    setActiveViewStep(1);
    setCompletedSteps(new Set());
    setTimeout(() => workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [selectedProfile]);

  const handleReset = useCallback(() => {
    setSelectedProfile(null);
    setWorkflowState('idle');
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setActiveViewStep(1);
    setTimeout(() => profileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.location.hash = ''; }}
          className="inline-flex items-center gap-1.5 text-[14px] mb-8 transition-colors hover:text-[#C4A934]"
          style={{ color: '#718096', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Back to Level 3
        </a>

        {/* Badge */}
        <div className="text-center mb-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ backgroundColor: 'rgba(247,232,164,0.2)', color: '#C4A934', border: '1px solid #F7E8A4' }}
          >
            Level 03 &mdash; Interactive Tool
          </span>
        </div>

        {/* Centered Title */}
        <div className="mb-8 text-center">
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1A202C] leading-[1.15] mb-4">
            Design Your First AI
            <br />
            <span className="relative inline-block">
              Workflow
              <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-[#C4A934] opacity-80 rounded-full" />
            </span>
          </h1>
          <p className="text-[15px] text-[#4A5568] leading-relaxed mx-auto" style={{ maxWidth: 600 }}>
            See how individual AI agents connect into an end-to-end automated pipeline &mdash; from data collection to personalized delivery &mdash; with human oversight at every step.
          </p>
        </div>

        {/* ═══ Did You Know? ═══ */}
        <div className="mb-8">
          <div
            className="relative rounded-2xl px-8 md:px-12 py-8 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(251,232,166,0.15) 0%, rgba(196,169,52,0.08) 50%, rgba(251,232,166,0.12) 100%)',
              border: '1.5px solid #FBE8A6',
            }}
          >
            <div className="absolute top-3 left-4 flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C4A934] opacity-40" />
              <span className="w-2 h-2 rounded-full bg-[#FBE8A6] opacity-60" />
              <span className="w-2 h-2 rounded-full bg-[#C4A934] opacity-30" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#C4A934] mb-2">Did you know?</p>
            <p className="text-[17px] md:text-[19px] font-medium text-[#2D3748] leading-[1.6] mb-2">
              The average enterprise employee switches between{' '}
              <span className="text-[#C4A934] font-bold">9 different applications</span> per day
              to complete a single process. Companies using integrated AI workflows report up to{' '}
              <span className="text-[#C4A934] font-bold">40% reduction</span> in process cycle times
              and <span className="text-[#C4A934] font-bold">60% fewer</span> manual handoffs.
            </p>
            <p className="text-[15px] text-[#718096] leading-[1.6] max-w-3xl mx-auto">
              &mdash; McKinsey Digital, 2024
            </p>
          </div>
        </div>

        {/* ═══ 5-Step Pipeline Overview ═══ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1A202C] mb-2">The 5-Step Workflow Pipeline</h2>
          <p className="text-sm text-[#4A5568] leading-relaxed mb-6" style={{ maxWidth: 600 }}>
            Every automated AI workflow follows a pattern: collect structured input, process it
            through specialized agents, and deliver tailored outputs &mdash; with human checkpoints along the way.
          </p>

          {/* Kitchen analogy callout */}
          <div className="bg-white rounded-lg p-6 mb-8"
            style={{ border: '1px solid #E2E8F0', borderLeft: '4px solid #38B2AC' }}>
            <div className="flex items-start gap-3">
              <ChefHat size={24} color="#38B2AC" className="shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-[#1A202C] mb-1">Think of it like a kitchen brigade</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed" style={{ maxWidth: 600 }}>
                  In a professional kitchen, raw ingredients don&rsquo;t become a finished dish in one step.
                  They flow through specialized stations &mdash; prep, sauces, grill, plating &mdash; each with
                  an expert who adds their skill. The head chef inspects at critical points before anything
                  reaches the diner. AI workflows work the same way.
                </p>
              </div>
            </div>
          </div>

          {/* Pipeline cards */}
          <div className={isMobile ? 'flex flex-col' : 'flex items-stretch'}>
            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.num}>
                  <div
                    className={`bg-white rounded-lg p-4 transition-all hover:-translate-y-0.5 ${isMobile ? '' : 'flex-1'}`}
                    style={{ border: '1px solid #E2E8F0' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                        style={{ backgroundColor: '#F7E8A4', color: '#C4A934' }}
                      >
                        {step.num}
                      </span>
                      <Icon size={20} color="#1A202C" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-bold text-[#1A202C] mb-1">{step.label}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {step.tools.map(t => <ToolPill key={t.name} name={t.name} color={t.color} />)}
                    </div>
                    <p className="text-xs text-[#718096]">{step.oneLiner}</p>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className={`flex items-center justify-center shrink-0 ${isMobile ? 'py-1' : 'px-1'}`}>
                      {isMobile
                        ? <ChevronDown size={20} color="#C4A934" />
                        : <ChevronRight size={20} color="#C4A934" />
                      }
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ═══ Educational Topic Cards ═══ */}
        <div className="mb-16 rounded-2xl py-12 px-6 md:px-8" style={{ backgroundColor: '#F7FAFC' }}>
          <h2 className="text-2xl font-bold text-[#1A202C] mb-8">Level 3 Topics &mdash; Systemic Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATIONAL_CARDS.map((card, idx) => <TopicCard key={idx} card={card} />)}
          </div>
        </div>

        {/* ═══ Interactive Workflow Section ═══ */}
        <div className="mb-16" ref={profileRef}>
          <h2 className="text-2xl font-bold text-[#1A202C] mb-2">Try It: Run the Skills Survey Workflow</h2>
          <p className="text-sm text-[#4A5568] leading-relaxed mb-8" style={{ maxWidth: 600 }}>
            Walk through each step of a real multi-agent pipeline. Select a sample employee profile,
            watch data flow through 5 connected agents, and see personalized outputs generated at each stage.
          </p>

          {/* Profile selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {PROFILES.map((p, idx) => (
              <ProfileCard
                key={idx}
                profile={p}
                selected={selectedProfile === p.id}
                onSelect={() => {
                  if (workflowState === 'idle') setSelectedProfile(p.id);
                }}
              />
            ))}
          </div>

          {/* Run Workflow CTA */}
          <div className="text-center mb-8">
            <button
              onClick={handleRunWorkflow}
              disabled={!selectedProfile || workflowState !== 'idle'}
              className="px-7 py-3 rounded-full text-[15px] font-semibold text-white inline-flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: '#38B2AC',
                opacity: (!selectedProfile || workflowState !== 'idle') ? 0.5 : 1,
                cursor: (!selectedProfile || workflowState !== 'idle') ? 'not-allowed' : 'pointer',
              }}
            >
              {workflowState === 'running'
                ? <><Loader2 size={16} className="animate-spin" /> Running...</>
                : <>Run Workflow <ArrowRight size={16} /></>
              }
            </button>
          </div>

          {/* ═══ Workflow Execution Visualization ═══ */}
          {workflowState !== 'idle' && selectedProfileData && (
            <div ref={workflowRef} className="scroll-mt-24">
              <div className={isMobile ? 'flex flex-col gap-6' : 'flex gap-8'}>

                {/* Stepper */}
                <div
                  className={isMobile ? 'flex overflow-x-auto gap-4 pb-3' : 'flex flex-col items-center shrink-0'}
                  style={{ width: isMobile ? 'auto' : '28%' }}
                >
                  {STEP_LABELS.map((label, i) => {
                    const stepNum = i + 1;
                    const isCompleted = completedSteps.has(stepNum);
                    const isActive = currentStep === stepNum && !isCompleted;
                    const isViewable = isCompleted || isActive;

                    return (
                      <React.Fragment key={stepNum}>
                        <button
                          type="button"
                          className={`flex items-center gap-3 transition-all ${isMobile ? 'flex-col text-center shrink-0' : 'w-full'}`}
                          onClick={() => isViewable && setActiveViewStep(stepNum)}
                          style={{ opacity: isViewable ? 1 : 0.4, cursor: isViewable ? 'pointer' : 'default' }}
                          disabled={!isViewable}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                            style={{
                              backgroundColor: isCompleted ? '#38B2AC' : 'transparent',
                              border: isActive ? '2px solid #C4A934' : isCompleted ? 'none' : '2px solid #E2E8F0',
                            }}
                          >
                            {isCompleted
                              ? <CheckCircle size={16} color="#FFFFFF" />
                              : isActive
                                ? <Loader2 size={16} color="#C4A934" className={reducedMotion ? '' : 'animate-spin'} />
                                : <span className="text-xs font-bold text-[#A0AEC0]">{stepNum}</span>
                            }
                          </div>
                          <span className={`text-sm font-medium ${activeViewStep === stepNum ? 'text-[#1A202C]' : 'text-[#A0AEC0]'}`}>
                            {label}
                          </span>
                        </button>
                        {/* Connecting line */}
                        {!isMobile && i < 4 && (
                          <div
                            className="w-0.5 h-8 transition-all duration-500"
                            style={{ backgroundColor: isCompleted ? '#38B2AC' : '#E2E8F0', margin: '0 auto' }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Content panel */}
                <div className="flex-1 min-w-0">
                  {(currentStep >= activeViewStep || completedSteps.has(activeViewStep)) && (
                    <div className="rounded-xl p-6" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E2E8F0' }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#1A202C]">
                          Step {activeViewStep}: {STEP_LABELS[activeViewStep - 1]}
                        </h3>
                        {completedSteps.has(activeViewStep) && (
                          <span className="text-xs font-semibold text-[#38B2AC] flex items-center gap-1">
                            <CheckCircle size={14} /> Complete
                          </span>
                        )}
                      </div>

                      {/* Kitchen analogy note */}
                      <span
                        className="inline-block text-xs italic text-[#718096] px-3 py-1.5 rounded-full mb-4"
                        style={{ backgroundColor: '#FFFDF0' }}
                      >
                        {STEP_ANALOGIES[activeViewStep - 1]}
                      </span>

                      {/* Step content */}
                      <StepContent stepNum={activeViewStep} profile={selectedProfileData} />

                      {/* HITL badge */}
                      <div
                        className="mt-4 px-3 py-2 rounded-lg text-xs text-[#2D3748] flex items-center gap-2"
                        style={{ backgroundColor: '#F0FFF4', border: '1px solid rgba(56,178,172,0.2)' }}
                      >
                        <User size={14} color="#38B2AC" />
                        {STEP_HITL[activeViewStep - 1]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ Post-Workflow Summary ═══ */}
          {workflowState === 'complete' && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[#1A202C] mb-2">Workflow Complete</h2>
              <p className="text-sm text-[#4A5568] mb-6">
                Here&rsquo;s what just happened &mdash; and what it would look like in production.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { stat: '5 agents', desc: 'Specialized AI agents chained in sequence' },
                  { stat: '3 checkpoints', desc: 'Human-in-the-loop validation points' },
                  { stat: '< 30 seconds', desc: 'Total processing time (in production)' },
                ].map(s => (
                  <div key={s.stat} className="bg-white rounded-xl p-5 text-center"
                    style={{ border: '1px solid #E2E8F0' }}>
                    <p className="text-xl font-bold text-[#1A202C] mb-1">{s.stat}</p>
                    <p className="text-xs text-[#718096]">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
                <h3 className="text-lg font-bold text-[#1A202C] mb-2">In production, this runs automatically</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed" style={{ maxWidth: 600 }}>
                  What you just walked through step by step happens in seconds in a real deployment.
                  Using tools like Make, Zapier, or n8n, the entire pipeline triggers automatically
                  when a new survey response is submitted. The AI agents process in sequence, human
                  reviewers get notified at checkpoint steps, and the final training plan lands in
                  the employee&rsquo;s inbox &mdash; all without anyone manually copying data between tools.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors hover:bg-gray-50"
                  style={{ border: '1px solid #1A202C', color: '#1A202C' }}
                >
                  Try a different profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══ Closing Educational Note ═══ */}
        <div className="mb-12" style={{ maxWidth: 600 }}>
          <h2 className="text-2xl font-bold text-[#1A202C] mb-3">This Is Where Real ROI Happens</h2>
          <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
            Level 3 is where AI stops being a side tool and becomes embedded in how work actually gets done.
            The skills survey workflow you just explored is one example &mdash; but the same pattern applies to
            onboarding, reporting, client delivery, knowledge management, and dozens of other processes. The
            key principles remain the same: map the workflow, chain specialized agents, build in human
            oversight, and close the feedback loop.
          </p>
          <p className="text-sm text-[#4A5568] leading-relaxed">
            What you&rsquo;re looking at above is the workflow engine &mdash; but the output is still data
            in a system. In Level 4, we take these automated outputs and present them in beautifully
            designed, interactive dashboards built for the people who need them.
          </p>
        </div>

        {/* ─── PAGE CLOSING ─── */}
        <ArtifactClosing
          summaryText="You've explored how individual AI agents connect into end-to-end automated workflows — from data collection through analysis, mapping, and personalized delivery. Ready to turn these outputs into designed intelligence?"
          ctaLabel="Continue to Level 4: Interactive Dashboards"
          ctaHref="#dashboard-design"
          accentColor="#C4A934"
        />
      </div>
    </div>
  );
}
