import { useState, useRef } from 'react';
import type { WorkflowDesignPayload, WorkflowGenerateResult, WorkflowFeedbackResult } from '../types';
import { fetchWithRetry, getErrorMessage } from '../lib/fetchWithRetry';

export function useWorkflowDesignApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCallRef = useRef(0);

  const clearError = () => setError(null);

  const designWorkflow = async (
    payload: WorkflowDesignPayload,
  ): Promise<WorkflowGenerateResult | WorkflowFeedbackResult | null> => {
    // Rate limit: 1 request per 8 seconds
    const now = Date.now();
    if (now - lastCallRef.current < 8000) {
      setError('Please wait a few seconds before trying again.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    lastCallRef.current = now;

    const hasValidShape = (data: WorkflowGenerateResult & WorkflowFeedbackResult) =>
      payload.mode === 'auto_generate'
        ? !!data.workflow_name && Array.isArray(data.nodes)
        : Array.isArray(data.suggested_workflow) && !!data.changes;

    // The model occasionally returns an incomplete payload. Retry the whole
    // call once before surfacing an error so a single bad generation is invisible.
    const MAX_ATTEMPTS = 2;
    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120000);
        try {
          const res = await fetchWithRetry('/api/design-workflow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!res.ok) {
            if (attempt < MAX_ATTEMPTS) continue;
            setError(getErrorMessage(res.status, 'workflow design'));
            return null;
          }

          const data = await res.json();
          if (!hasValidShape(data)) {
            if (attempt < MAX_ATTEMPTS) continue;
            setError('Received an unexpected response format. Please try again.');
            return null;
          }

          return payload.mode === 'auto_generate'
            ? (data as WorkflowGenerateResult)
            : (data as WorkflowFeedbackResult);
        } catch (err: unknown) {
          clearTimeout(timeout);
          if (err instanceof Error && err.name === 'AbortError') {
            setError('This is taking longer than expected. Please try again.');
            return null;
          }
          if (attempt < MAX_ATTEMPTS) continue;
          setError('Unable to reach the workflow design service. Please check your connection and try again.');
          return null;
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { designWorkflow, isLoading, error, clearError };
}
