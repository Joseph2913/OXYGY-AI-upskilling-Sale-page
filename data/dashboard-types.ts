// ─── Dashboard Section IDs ───

export type DashboardSection =
  | 'profile'
  | 'progress'
  | 'insights'
  | 'prompt-library';

// ─── Sidebar Navigation ───

export interface DashboardNavItem {
  id: DashboardSection;
  label: string;
  shortLabel: string; // for mobile tab bar
  iconName: string;   // Lucide icon name
}

// ─── My Profile (synced with Learning Pathway Generator fields) ───

export interface UserProfile {
  fullName: string;
  role: string;              // "Your Role" – matches PathwayFormData.role
  function: string;          // "Your Function" – matches PathwayFormData.function
  functionOther: string;     // When "Other" is selected
  seniority: string;         // "Your Seniority"
  aiExperience: string;      // 'beginner' | 'comfortable-user' | 'builder' | 'integrator'
  ambition: string;          // 'confident-daily-use' | 'build-reusable-tools' | 'own-ai-processes' | 'build-full-apps'
  challenge: string;         // "Your Challenge"
  availability: string;      // '1-2 hours' | '3-4 hours' | '5+ hours'
  experienceDescription: string; // Optional: "Describe Your AI Experience"
  goalDescription: string;       // Optional: "What Goal Would You Like to Work Towards?"
}

// ─── My Progress ───

export type CellStatus = 'complete' | 'incomplete' | 'pending';

export interface ProgressRow {
  level: number;
  name: string;
  toolUsed: CellStatus;
  outputSaved: CellStatus;
  workshopAttended: CellStatus;
}

export interface WorkshopCodeEntry {
  level: number;
  code: string;
  validatedAt: number;
}

// ─── Application Insights ───

export interface InsightEntry {
  id: string;
  level: number;
  topic: string;
  context: string;
  outcome: string;
  rating: number; // 1-5
  aiFeedback: string;
  aiFeedbackStructured?: InsightAIFeedback;
  createdAt: number;
}

// ─── Prompt Library ───

export interface SavedPrompt {
  id: string;
  level: number;
  title: string;
  content: string;
  savedAt: number;
}

// ─── Learning Plan ───

export interface LevelBlockActivity {
  id: string;
  label: string;
  completed: boolean;
}

export interface LevelBlock {
  level: number;
  name: string;
  status: 'not-started' | 'in-progress' | 'complete';
  activities: LevelBlockActivity[];
}

// ─── AI Insight Feedback (from Gemini API) ───

export interface InsightAIFeedback {
  needsClarification?: boolean;
  clarificationMessage?: string;
  useCaseSummary: string;
  nextLevelTranslation: string;
  considerations: string[];
  nextSteps: string;
}

// ─── Level Pill Styling ───

export interface LevelPillStyle {
  bg: string;
  text: string;
}
