import { useState, useRef } from 'react';
import type { ProductArchitectureAnswers, ToolAnalysisResult } from '../types';
import { fetchWithRetry, getErrorMessage } from '../lib/fetchWithRetry';

export function useArchitectureApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCallRef = useRef(0);

  const clearError = () => setError(null);

  const analyzeArchitecture = async (
    answers: ProductArchitectureAnswers
  ): Promise<Record<string, ToolAnalysisResult> | null> => {
    // Rate limit: 1 request per 8 seconds
    const now = Date.now();
    if (now - lastCallRef.current < 8000) {
      setError('Please wait a few seconds before trying again.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    lastCallRef.current = now;

    const requiredTools = ['google-ai-studio', 'github', 'claude-code', 'supabase', 'vercel'];
    const hasAllTools = (data: Record<string, ToolAnalysisResult>) =>
      requiredTools.every((id) => data[id]?.classification && data[id]?.forYourProject);

    // The model occasionally drops a required field. Retry the whole call once
    // before surfacing an error so a single bad generation is invisible.
    const MAX_ATTEMPTS = 2;
    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120000);
        try {
          const res = await fetchWithRetry('/api/analyze-architecture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answers),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!res.ok) {
            if (attempt < MAX_ATTEMPTS) continue;
            setError(getErrorMessage(res.status, 'build plan'));
            return null;
          }

          const data = await res.json();
          if (!hasAllTools(data)) {
            if (attempt < MAX_ATTEMPTS) continue;
            setError('Received an unexpected response format. Please try again.');
            return null;
          }

          return data as Record<string, ToolAnalysisResult>;
        } catch (err: unknown) {
          clearTimeout(timeout);
          if (err instanceof Error && err.name === 'AbortError') {
            setError('This is taking longer than expected. Please try again.');
            return null;
          }
          if (attempt < MAX_ATTEMPTS) continue;
          setError('Unable to reach the build plan service. Please check your connection and try again.');
          return null;
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeArchitecture, isLoading, error, clearError };
}
