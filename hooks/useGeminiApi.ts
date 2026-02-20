import { useState, useRef, useCallback } from 'react';
import type { PromptResult, WizardAnswers } from '../types';
import { fetchWithRetry, getErrorMessage } from '../lib/fetchWithRetry';

interface ApiPayload {
  mode: 'enhance' | 'build';
  prompt?: string;
  wizardAnswers?: WizardAnswers;
}

export function useGeminiApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCallRef = useRef(0);

  const enhance = useCallback(async (payload: ApiPayload): Promise<PromptResult | null> => {
    // Rate limit: 1 request per 5 seconds
    const now = Date.now();
    if (now - lastCallRef.current < 5000) {
      setError('Please wait a few seconds before trying again.');
      return null;
    }
    lastCallRef.current = now;

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetchWithRetry('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        setError(getErrorMessage(res.status, 'prompt enhancement'));
        return null;
      }

      const data: PromptResult = await res.json();

      // Validate the response has all required fields
      const requiredKeys = ['role', 'context', 'task', 'format', 'steps', 'quality'] as const;
      const hasAllKeys = requiredKeys.every((key) => typeof data[key] === 'string' && data[key].length > 0);
      if (!hasAllKeys) {
        setError('Received an unexpected response format. Please try again.');
        return null;
      }

      return data;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('This is taking longer than expected. Please try again.');
      } else {
        setError('Unable to reach the prompt service. Please check your connection and try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { enhance, isLoading, error, clearError };
}
