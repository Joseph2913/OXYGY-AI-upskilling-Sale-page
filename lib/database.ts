import { supabase } from './supabase';
import type { UserProfile, InsightEntry, SavedPrompt } from '../data/dashboard-types';
import type { PathwayApiResponse, LevelDepth } from '../types';

// ─── HELPER: camelCase ↔ snake_case for profiles ───

function profileToDb(profile: Partial<UserProfile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (profile.fullName !== undefined) row.full_name = profile.fullName;
  if (profile.role !== undefined) row.role = profile.role;
  if (profile.function !== undefined) row.function = profile.function;
  if (profile.functionOther !== undefined) row.function_other = profile.functionOther;
  if (profile.seniority !== undefined) row.seniority = profile.seniority;
  if (profile.aiExperience !== undefined) row.ai_experience = profile.aiExperience;
  if (profile.ambition !== undefined) row.ambition = profile.ambition;
  if (profile.challenge !== undefined) row.challenge = profile.challenge;
  if (profile.availability !== undefined) row.availability = profile.availability;
  if (profile.experienceDescription !== undefined) row.experience_description = profile.experienceDescription;
  if (profile.goalDescription !== undefined) row.goal_description = profile.goalDescription;
  return row;
}

function dbToProfile(row: Record<string, unknown>): UserProfile {
  return {
    fullName: (row.full_name as string) || '',
    role: (row.role as string) || '',
    function: (row.function as string) || '',
    functionOther: (row.function_other as string) || '',
    seniority: (row.seniority as string) || '',
    aiExperience: (row.ai_experience as string) || '',
    ambition: (row.ambition as string) || '',
    challenge: (row.challenge as string) || '',
    availability: (row.availability as string) || '',
    experienceDescription: (row.experience_description as string) || '',
    goalDescription: (row.goal_description as string) || '',
  };
}

// ─── PROFILES ───

export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) { console.error('getProfile error:', error); return null; }
    return dbToProfile(data as Record<string, unknown>);
  } catch (err) { console.error('getProfile error:', err); return null; }
}

export async function upsertProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const row = profileToDb(profile);
    row.id = userId;
    row.updated_at = new Date().toISOString();
    const { data: result, error } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();
    if (error) { console.error('upsertProfile error:', error); return null; }
    return dbToProfile(result as Record<string, unknown>);
  } catch (err) { console.error('upsertProfile error:', err); return null; }
}

// ─── LEARNING PLANS ───

export async function getLatestLearningPlan(userId: string): Promise<{
  plan: PathwayApiResponse;
  level_depths: Record<string, LevelDepth>;
} | null> {
  try {
    const { data, error } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();
    if (error) { console.error('getLatestLearningPlan error:', error); return null; }
    return {
      plan: {
        pathwaySummary: (data.pathway_summary as string) || '',
        totalEstimatedWeeks: (data.total_estimated_weeks as number) || 0,
        levels: (data.levels_data as PathwayApiResponse['levels']) || {},
      },
      level_depths: (data.level_depths as Record<string, LevelDepth>) || {},
    };
  } catch (err) { console.error('getLatestLearningPlan error:', err); return null; }
}

export async function saveLearningPlan(
  userId: string,
  data: PathwayApiResponse,
  levelDepths: Record<string, LevelDepth>,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        pathway_summary: data.pathwaySummary,
        total_estimated_weeks: data.totalEstimatedWeeks,
        levels_data: data.levels,
        level_depths: levelDepths,
        generated_at: new Date().toISOString(),
      });
    if (error) { console.error('saveLearningPlan error:', error); return false; }
    return true;
  } catch (err) { console.error('saveLearningPlan error:', err); return false; }
}

// ─── LEVEL PROGRESS ───

export interface LevelProgressRow {
  user_id: string;
  level: number;
  tool_used: boolean;
  tool_used_at: string | null;
  workshop_attended: boolean;
  workshop_attended_at: string | null;
  workshop_code_used: string | null;
}

export async function getLevelProgress(userId: string): Promise<LevelProgressRow[]> {
  try {
    const { data, error } = await supabase
      .from('level_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) { console.error('getLevelProgress error:', error); return []; }
    return (data || []) as LevelProgressRow[];
  } catch (err) { console.error('getLevelProgress error:', err); return []; }
}

export async function upsertToolUsed(userId: string, level: number): Promise<boolean> {
  try {
    // Check if a row already exists for this (user_id, level)
    const { data: existing } = await supabase
      .from('level_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('level', level)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('level_progress')
        .update({ tool_used: true, tool_used_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) { console.error('upsertToolUsed update error:', error); return false; }
    } else {
      const { error } = await supabase
        .from('level_progress')
        .insert({
          user_id: userId,
          level,
          tool_used: true,
          tool_used_at: new Date().toISOString(),
        });
      if (error) { console.error('upsertToolUsed insert error:', error); return false; }
    }
    return true;
  } catch (err) { console.error('upsertToolUsed error:', err); return false; }
}

export async function upsertWorkshopAttended(
  userId: string,
  level: number,
  code: string,
): Promise<boolean> {
  try {
    // Check if a row already exists for this (user_id, level)
    const { data: existing } = await supabase
      .from('level_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('level', level)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('level_progress')
        .update({
          workshop_attended: true,
          workshop_attended_at: new Date().toISOString(),
          workshop_code_used: code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (error) { console.error('upsertWorkshopAttended update error:', error); return false; }
    } else {
      const { error } = await supabase
        .from('level_progress')
        .insert({
          user_id: userId,
          level,
          workshop_attended: true,
          workshop_attended_at: new Date().toISOString(),
          workshop_code_used: code,
        });
      if (error) { console.error('upsertWorkshopAttended insert error:', error); return false; }
    }
    return true;
  } catch (err) { console.error('upsertWorkshopAttended error:', err); return false; }
}

// ─── WORKSHOP CODE VALIDATION ───

export async function validateWorkshopCode(
  orgId: string | null,
  level: number,
  code: string,
): Promise<boolean> {
  try {
    let query = supabase
      .from('workshop_sessions')
      .select('id')
      .eq('level', level)
      .eq('code', code)
      .eq('active', true);
    if (orgId) query = query.eq('org_id', orgId);
    const { data, error } = await query;
    if (error) { console.error('validateWorkshopCode error:', error); return false; }
    return (data?.length ?? 0) > 0;
  } catch (err) { console.error('validateWorkshopCode error:', err); return false; }
}

// ─── SAVED PROMPTS ───

export async function getSavedPrompts(userId: string): Promise<SavedPrompt[]> {
  try {
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    if (error) { console.error('getSavedPrompts error:', error); return []; }
    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      level: row.level as number,
      title: row.title as string,
      content: row.content as string,
      savedAt: new Date(row.saved_at as string).getTime(),
      sourceTool: row.source_tool as string | undefined,
    })) as SavedPrompt[];
  } catch (err) { console.error('getSavedPrompts error:', err); return []; }
}

export async function savePrompt(
  userId: string,
  prompt: { level: number; title: string; content: string; source_tool: string },
): Promise<SavedPrompt | null> {
  try {
    const { data, error } = await supabase
      .from('saved_prompts')
      .insert({
        user_id: userId,
        level: prompt.level,
        title: prompt.title,
        content: prompt.content,
        source_tool: prompt.source_tool,
        saved_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) { console.error('savePrompt error:', error); return null; }
    return {
      id: data.id,
      level: data.level,
      title: data.title,
      content: data.content,
      savedAt: new Date(data.saved_at).getTime(),
    };
  } catch (err) { console.error('savePrompt error:', err); return null; }
}

export async function deletePrompt(promptId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', promptId)
      .eq('user_id', userId);
    if (error) { console.error('deletePrompt error:', error); return false; }
    return true;
  } catch (err) { console.error('deletePrompt error:', err); return false; }
}

// ─── APPLICATION INSIGHTS ───

export async function getInsights(userId: string): Promise<InsightEntry[]> {
  try {
    const { data, error } = await supabase
      .from('application_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) { console.error('getInsights error:', error); return []; }
    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      level: row.level as number,
      topic: row.topic as string,
      context: row.context as string,
      outcome: row.outcome as string,
      rating: row.rating as number,
      aiFeedback: row.ai_feedback as string,
      aiFeedbackStructured: row.ai_feedback_structured as InsightEntry['aiFeedbackStructured'],
      createdAt: new Date(row.created_at as string).getTime(),
    })) as InsightEntry[];
  } catch (err) { console.error('getInsights error:', err); return []; }
}

export async function saveInsight(userId: string, entry: InsightEntry): Promise<boolean> {
  try {
    // Let the DB auto-generate the UUID id
    const { error } = await supabase
      .from('application_insights')
      .insert({
        user_id: userId,
        level: entry.level,
        topic: entry.topic,
        context: entry.context,
        outcome: entry.outcome,
        rating: entry.rating,
        ai_feedback: entry.aiFeedback,
        ai_feedback_structured: entry.aiFeedbackStructured || null,
      });
    if (error) { console.error('saveInsight error:', error); return false; }
    return true;
  } catch (err) { console.error('saveInsight error:', err); return false; }
}

export async function updateInsight(
  insightId: string,
  userId: string,
  data: Partial<InsightEntry>,
): Promise<boolean> {
  try {
    const updates: Record<string, unknown> = {};
    if (data.level !== undefined) updates.level = data.level;
    if (data.topic !== undefined) updates.topic = data.topic;
    if (data.context !== undefined) updates.context = data.context;
    if (data.outcome !== undefined) updates.outcome = data.outcome;
    if (data.rating !== undefined) updates.rating = data.rating;
    if (data.aiFeedback !== undefined) updates.ai_feedback = data.aiFeedback;
    if (data.aiFeedbackStructured !== undefined) updates.ai_feedback_structured = data.aiFeedbackStructured;
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('application_insights')
      .update(updates)
      .eq('id', insightId)
      .eq('user_id', userId);
    if (error) { console.error('updateInsight error:', error); return false; }
    return true;
  } catch (err) { console.error('updateInsight error:', err); return false; }
}

// ─── UI PREFERENCES ───

export interface UiPreferences {
  profile_nudge_dismissed: boolean;
  onboarding_completed?: boolean;
  last_active_dashboard_section?: string;
}

export async function getUiPreferences(userId: string): Promise<UiPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('ui_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) { console.error('getUiPreferences error:', error); return null; }
    return data as UiPreferences;
  } catch (err) { console.error('getUiPreferences error:', err); return null; }
}

export async function upsertUiPreferences(
  userId: string,
  data: Partial<UiPreferences>,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ui_preferences')
      .upsert({ user_id: userId, ...data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) { console.error('upsertUiPreferences error:', error); return false; }
    return true;
  } catch (err) { console.error('upsertUiPreferences error:', err); return false; }
}
