/**
 * Shared OpenRouter API helper for all Cloud Functions.
 * Handles retry logic and JSON response parsing.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
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
          `[${label}] OpenRouter API returned ${response.status}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
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
 * Standard OpenRouter call: sends system prompt + user message, returns parsed JSON.
 */
export async function callGemini(opts: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  label: string;
  temperature?: number;
  responseMimeType?: string;
  maxTokens?: number;
}): Promise<{ ok: true; data: any } | { ok: false; status: number; message: string; retryable: boolean }> {
  const openRouterModel = opts.model.startsWith("google/") ? opts.model : `google/${opts.model}`;

  const body: Record<string, any> = {
    model: openRouterModel,
    messages: [
      { role: "system", content: opts.systemPrompt },
      { role: "user", content: opts.userMessage },
    ],
    temperature: opts.temperature ?? 0.7,
    // Generous output ceiling so long answers (build plans, workflows, agent
    // designs) are not silently truncated. Only tokens actually generated are
    // billed; this is headroom, not a target.
    max_tokens: opts.maxTokens ?? 16000,
  };

  if ((opts.responseMimeType ?? "application/json") === "application/json") {
    body.response_format = { type: "json_object" };
  }

  // OpenRouter sometimes returns HTTP 200 with an error body (e.g. an upstream
  // "504 operation was aborted" when the provider is slow) or with empty
  // content. Neither is caught by fetchWithRetry (which only sees the status
  // code), so we retry those here, alongside genuinely unparseable JSON. A few
  // cheap retries turn an intermittent provider hiccup into a successful call.
  const MAX_CONTENT_ATTEMPTS = 3;
  let lastFailure: { status: number; message: string } = {
    status: 502,
    message: "AI service error",
  };

  for (let attempt = 1; attempt <= MAX_CONTENT_ATTEMPTS; attempt++) {
    const response = await fetchWithRetry(
      OPENROUTER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${opts.apiKey}`,
        },
        body: JSON.stringify(body),
      },
      opts.label,
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenRouter API error (${opts.label}):`, response.status, errText);
      if (response.status === 429) {
        return {
          ok: false,
          status: 429,
          message: "The AI service is temporarily busy. Please wait a moment and try again.",
          retryable: true,
        };
      }
      lastFailure = { status: 502, message: "AI service error" };
      continue;
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const text = choice?.message?.content || "";
    const finishReason = choice?.finish_reason;

    // Upstream error returned inside a 200 body, or no content at all.
    if (data?.error || !text) {
      console.warn(
        `[${opts.label}] Empty/errored response body (attempt ${attempt}/${MAX_CONTENT_ATTEMPTS}): ` +
          (data?.error ? JSON.stringify(data.error) : "no content"),
      );
      lastFailure = {
        status: 502,
        message: "The AI service timed out. Please try again.",
      };
      continue;
    }

    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    try {
      return { ok: true, data: JSON.parse(cleaned) };
    } catch (parseErr) {
      const truncated = finishReason === "length";
      console.error(
        `[${opts.label}] Failed to parse model JSON (attempt ${attempt}/${MAX_CONTENT_ATTEMPTS}). ` +
          `finish_reason=${finishReason}, contentLength=${text.length}. First 500 chars: ${cleaned.slice(0, 500)}`,
      );
      lastFailure = {
        status: 502,
        message: truncated
          ? "The AI response was too long and got cut off. Please try again, or simplify your input slightly."
          : "The AI returned a response we could not read. Please try again.",
      };
      continue;
    }
  }

  return { ok: false, ...lastFailure, retryable: true };
}
