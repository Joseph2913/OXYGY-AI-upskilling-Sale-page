import { useState, useRef } from 'react';
import type { PathwayFormData, PathwayApiResponse } from '../types';

export function usePathwayApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCallRef = useRef(0);

  const clearError = () => setError(null);

  const generatePathway = async (
    formData: PathwayFormData,
    levelDepths: Record<string, string>,
  ): Promise<PathwayApiResponse | null> => {
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
      const res = await fetch('/api/generate-pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, levelDepths }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 503) {
        setError('The pathway service is temporarily unavailable. Please try again later.');
        return null;
      }

      if (!res.ok) {
        setError('Something went wrong generating your pathway. Please try again.');
        return null;
      }

      const data = await res.json();

      if (!data.pathwaySummary || !data.levels) {
        setError('Received an unexpected response format. Please try again.');
        return null;
      }

      return data as PathwayApiResponse;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('This is taking longer than expected. Please try again.');
      } else {
        setError('Something went wrong generating your pathway. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePathway, isLoading, error, clearError };
}
