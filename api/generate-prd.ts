import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are the Oxygy PRD Writer — an expert in creating Product Requirements Documents for AI-powered dashboard applications.

You will receive details about a dashboard (user needs, target audience, key metrics, data sources, and an image prompt describing the visual design). Generate a comprehensive PRD.

RESPONSE FORMAT (JSON only, no markdown):

{
  "prd_content": "Full PRD title",
  "sections": {
    "title_and_author": "Title, author, date, version info",
    "purpose_and_scope": "Business purpose and technical scope",
    "stakeholders": "Primary and secondary stakeholders",
    "market_assessment": "Target market and competitive context",
    "product_overview": "High-level product description",
    "functional_requirements": "Detailed functional requirements",
    "usability_requirements": "UX and accessibility requirements",
    "technical_requirements": "Tech stack, architecture, performance",
    "environmental_requirements": "Hosting, infrastructure, compliance",
    "support_requirements": "Documentation, monitoring, training",
    "interaction_requirements": "API integrations and data connections",
    "assumptions": "Key assumptions",
    "constraints": "Known constraints",
    "dependencies": "External dependencies",
    "workflow_timeline": "Development phases and milestones",
    "evaluation_metrics": "Success metrics and KPIs"
  }
}

Each section should be 3-8 sentences of professional, specific content tailored to the user's dashboard project. Reference their specific metrics, audience, and data sources throughout.`;

// ─── Retry helper for Gemini API calls ───

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1500;

async function fetchWithRetry(
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
        const retryAfter = response.headers.get('retry-after');
        const delayMs = retryAfter
          ? Math.min(parseInt(retryAfter, 10) * 1000, 10000)
          : BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[${label}] Gemini API returned ${response.status}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        lastResponse = response;
        continue;
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[${label}] Network error: ${lastError.message}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error('All retries exhausted');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured' });
  }

  try {
    const { user_needs, image_prompt, target_audience, key_metrics, data_sources } = req.body;

    const userMessage = [
      `DASHBOARD PURPOSE: ${user_needs}`,
      `DASHBOARD DESIGN: ${image_prompt}`,
      target_audience ? `TARGET AUDIENCE: ${target_audience}` : '',
      key_metrics ? `KEY METRICS: ${key_metrics}` : '',
      data_sources ? `DATA SOURCES: ${data_sources}` : '',
    ].filter(Boolean).join('\n');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const geminiResponse = await fetchWithRetry(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }, 'generate-prd-vercel');

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error (PRD):', geminiResponse.status, errText);
      const status = geminiResponse.status === 429 ? 429 : 502;
      const message = geminiResponse.status === 429
        ? 'The AI service is temporarily busy. Please wait a moment and try again.'
        : 'AI service error';
      return res.status(status).json({ error: message, retryable: true });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless function error (PRD):', err);
    return res.status(500).json({ error: 'Internal server error', retryable: true });
  }
}
