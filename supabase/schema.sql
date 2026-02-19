-- ============================================================
-- Oxygy AI Upskilling — Supabase Schema (matches production DB)
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ORGANISATIONS
create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  tier text check (tier = any (array['foundation', 'accelerator', 'catalyst'])),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text,
  function text,
  function_other text,
  seniority text,
  ai_experience text check (ai_experience = any (array['beginner', 'comfortable-user', 'builder', 'integrator'])),
  ambition text check (ambition = any (array['confident-daily-use', 'build-reusable-tools', 'own-ai-processes', 'build-full-apps', 'lead-ai-strategy'])),
  challenge text,
  availability text check (availability = any (array['1-2 hours', '3-4 hours', '5+ hours'])),
  experience_description text,
  goal_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can upsert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 3. LEARNING PLANS
create table if not exists learning_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  pathway_summary text,
  total_estimated_weeks integer,
  levels_data jsonb not null default '{}'::jsonb,
  level_depths jsonb not null default '{}'::jsonb,
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table learning_plans enable row level security;
create policy "Users can read own plans"  on learning_plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans" on learning_plans for insert with check (auth.uid() = user_id);

-- 4. LEVEL PROGRESS
create table if not exists level_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  level int not null check (level >= 1 and level <= 5),
  tool_used boolean default false,
  tool_used_at timestamptz,
  workshop_attended boolean default false,
  workshop_attended_at timestamptz,
  workshop_code_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table level_progress enable row level security;
create policy "Users can read own progress"  on level_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress" on level_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on level_progress for update using (auth.uid() = user_id);

-- 5. WORKSHOP SESSIONS (admin-managed lookup table)
create table if not exists workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisations(id),
  level int not null check (level >= 1 and level <= 5),
  code text not null,
  session_name text,
  session_date date,
  created_by uuid references auth.users(id),
  active boolean default true,
  created_at timestamptz default now()
);

alter table workshop_sessions enable row level security;
create policy "Authenticated users can read sessions" on workshop_sessions for select using (auth.role() = 'authenticated');

-- 6. SAVED PROMPTS
create table if not exists saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  level int not null check (level >= 1 and level <= 5),
  title text not null,
  content text not null,
  source_tool text check (source_tool = any (array['prompt-playground', 'agent-builder', 'workflow-designer', 'dashboard-designer', 'product-architecture'])),
  saved_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table saved_prompts enable row level security;
create policy "Users can read own prompts"   on saved_prompts for select using (auth.uid() = user_id);
create policy "Users can insert own prompts" on saved_prompts for insert with check (auth.uid() = user_id);
create policy "Users can delete own prompts" on saved_prompts for delete using (auth.uid() = user_id);

-- 7. APPLICATION INSIGHTS
create table if not exists application_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  level int not null check (level >= 1 and level <= 5),
  topic text not null,
  context text not null,
  outcome text not null,
  rating int check (rating >= 1 and rating <= 5),
  ai_feedback text,
  ai_feedback_structured jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table application_insights enable row level security;
create policy "Users can read own insights"   on application_insights for select using (auth.uid() = user_id);
create policy "Users can insert own insights" on application_insights for insert with check (auth.uid() = user_id);
create policy "Users can update own insights" on application_insights for update using (auth.uid() = user_id);

-- 8. UI PREFERENCES
create table if not exists ui_preferences (
  user_id uuid primary key references auth.users(id),
  profile_nudge_dismissed boolean default false,
  onboarding_completed boolean default false,
  last_active_dashboard_section text default 'profile',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ui_preferences enable row level security;
create policy "Users can read own prefs"   on ui_preferences for select using (auth.uid() = user_id);
create policy "Users can upsert own prefs" on ui_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own prefs" on ui_preferences for update using (auth.uid() = user_id);

-- 9. USER ORG MEMBERSHIPS
create table if not exists user_org_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  org_id uuid not null references organisations(id),
  role text not null check (role = any (array['learner', 'facilitator', 'admin'])),
  enrolled_at timestamptz default now(),
  active boolean default true
);

alter table user_org_memberships enable row level security;
create policy "Users can read own memberships" on user_org_memberships for select using (auth.uid() = user_id);
