/**
 * Client-side fetch wrapper with automatic retry for transient failures.
 * Retries on 429, 500, 502, 503, 504 status codes and network errors.
 */

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const CLIENT_MAX_RETRIES = 1;
const CLIENT_RETRY_DELAY_MS = 2000;

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
): Promise<Response> {
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= CLIENT_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < CLIENT_MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, CLIENT_RETRY_DELAY_MS));
        lastResponse = response;
        continue;
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry AbortErrors (timeouts) — the server may still be processing
      if (lastError.name === 'AbortError') throw lastError;

      if (attempt < CLIENT_MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, CLIENT_RETRY_DELAY_MS));
        continue;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error('All retries exhausted');
}

export function getErrorMessage(status: number, serviceName: string): string {
  switch (status) {
    case 429:
      return `The AI service is temporarily busy due to high demand. Please wait a moment and try again.`;
    case 503:
      return `The ${serviceName} service is temporarily unavailable. This usually resolves within a few minutes — please try again shortly.`;
    case 502:
    case 504:
      return `The AI service experienced a temporary issue. Please try again.`;
    default:
      return `Something went wrong with the ${serviceName} service. Please try again.`;
  }
}
