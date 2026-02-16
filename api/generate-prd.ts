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
    const geminiResponse = await fetch(geminiUrl, {
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
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error (PRD):', errText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless function error (PRD):', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
