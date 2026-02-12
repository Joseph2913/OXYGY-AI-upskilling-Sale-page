import { useState, useRef } from 'react';
import type { ProductArchitectureAnswers, ToolAnalysisResult } from '../types';

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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/analyze-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 503) {
        setError('The build plan service is temporarily unavailable. Please try again later.');
        return null;
      }

      if (!res.ok) {
        setError('Something went wrong generating your build plan. Please try again.');
        return null;
      }

      const data = await res.json();

      // Validate response: must have all 5 tools
      const requiredTools = ['google-ai-studio', 'github', 'claude-code', 'supabase', 'vercel'];
      for (const toolId of requiredTools) {
        if (!data[toolId] || !data[toolId].classification || !data[toolId].forYourProject) {
          setError('Received an unexpected response format. Please try again.');
          return null;
        }
      }

      return data as Record<string, ToolAnalysisResult>;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('This is taking longer than expected. Please try again.');
      } else {
        setError('Something went wrong generating your build plan. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeArchitecture, isLoading, error, clearError };
}
