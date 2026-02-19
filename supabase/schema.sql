-- ============================================================
-- Oxygy AI Upskilling — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text,
  department text,
  org text,
  experience text,
  goals text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can upsert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. LEARNING PLANS
create table if not exists learning_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_data jsonb not null,
  level_depths jsonb,
  generated_at timestamptz default now()
);

alter table learning_plans enable row level security;
create policy "Users can read own plans"  on learning_plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans" on learning_plans for insert with check (auth.uid() = user_id);

-- 3. LEVEL PROGRESS
create table if not exists level_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  level int not null check (level between 1 and 5),
  tool_used boolean default false,
  tool_used_at timestamptz,
  workshop_attended boolean default false,
  workshop_attended_at timestamptz,
  workshop_code_used text,
  primary key (user_id, level)
);

alter table level_progress enable row level security;
create policy "Users can read own progress"  on level_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress" on level_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on level_progress for update using (auth.uid() = user_id);

-- 4. WORKSHOP SESSIONS (admin-managed lookup table)
create table if not exists workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id text,
  level int not null check (level between 1 and 5),
  code text not null,
  active boolean default true,
  created_at timestamptz default now()
);

alter table workshop_sessions enable row level security;
-- Anyone authenticated can validate a code
create policy "Authenticated users can read sessions" on workshop_sessions for select using (auth.role() = 'authenticated');

-- 5. SAVED PROMPTS
create table if not exists saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level int not null,
  title text not null,
  content text not null,
  source_tool text,
  saved_at timestamptz default now()
);

alter table saved_prompts enable row level security;
create policy "Users can read own prompts"   on saved_prompts for select using (auth.uid() = user_id);
create policy "Users can insert own prompts" on saved_prompts for insert with check (auth.uid() = user_id);
create policy "Users can delete own prompts" on saved_prompts for delete using (auth.uid() = user_id);

-- 6. APPLICATION INSIGHTS
create table if not exists application_insights (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  level int,
  topic text,
  context text,
  outcome text,
  rating int,
  ai_feedback text,
  ai_feedback_structured jsonb,
  created_at timestamptz default now()
);

alter table application_insights enable row level security;
create policy "Users can read own insights"   on application_insights for select using (auth.uid() = user_id);
create policy "Users can insert own insights" on application_insights for insert with check (auth.uid() = user_id);
create policy "Users can update own insights" on application_insights for update using (auth.uid() = user_id);

-- 7. UI PREFERENCES
create table if not exists ui_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_nudge_dismissed boolean default false,
  data jsonb default '{}'::jsonb
);

alter table ui_preferences enable row level security;
create policy "Users can read own prefs"   on ui_preferences for select using (auth.uid() = user_id);
create policy "Users can upsert own prefs" on ui_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own prefs" on ui_preferences for update using (auth.uid() = user_id);
