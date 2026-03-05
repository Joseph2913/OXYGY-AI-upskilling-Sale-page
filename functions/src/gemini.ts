/**
 * Shared Gemini API helper for all Cloud Functions.
 * Handles retry logic and JSON response parsing.
 */

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1500;

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  label: string,
): Promise<Response> {
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRIES) {
        const retryAfter = response.headers.get("retry-after");
        const delayMs = retryAfter
          ? Math.min(parseInt(retryAfter, 10) * 1000, 10000)
          : BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[${label}] Gemini API returned ${response.status}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        lastResponse = response;
        continue;
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[${label}] Network error: ${lastError.message}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error("All retries exhausted");
}

/**
 * Standard Gemini call: sends system prompt + user message, returns parsed JSON.
 */
export async function callGemini(opts: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  label: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<{ ok: true; data: any } | { ok: false; status: number; message: string; retryable: boolean }> {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`;

  const geminiResponse = await fetchWithRetry(
    geminiUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: opts.systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: opts.userMessage }] }],
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
          responseMimeType: opts.responseMimeType ?? "application/json",
        },
      }),
    },
    opts.label,
  );

  if (!geminiResponse.ok) {
    const errText = await geminiResponse.text();
    console.error(`Gemini API error (${opts.label}):`, geminiResponse.status, errText);
    const status = geminiResponse.status === 429 ? 429 : 502;
    const message =
      geminiResponse.status === 429
        ? "The AI service is temporarily busy. Please wait a moment and try again."
        : "AI service error";
    return { ok: false, status, message, retryable: true };
  }

  const data = await geminiResponse.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return { ok: true, data: parsed };
}
