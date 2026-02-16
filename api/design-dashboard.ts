import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are an elite UI designer AND data strategist creating stunning, modern dashboard mockups. Your dashboards should look like they belong on Dribbble or Behance — minimal, airy, and visually refined.

You will receive a description of dashboard needs, target audience, key metrics, data sources, and optionally an inspiration URL. Generate a complete HTML dashboard.

METRIC REQUIREMENTS (CRITICAL):
- You MUST include EVERY metric the user listed in KEY METRICS. Each one must appear as either a KPI card or a chart — never omit any.
- Beyond the user's listed metrics, INFER 3-5 additional relevant metrics based on the dashboard purpose, target audience, and data sources. For example:
  - If the user asks for a "sales dashboard" with "Revenue, Deals" → also add: Conversion Rate, Average Deal Size, Sales Pipeline Value, Win Rate, Monthly Growth Trend
  - If the user asks for "marketing analytics" with "Website Traffic" → also add: Bounce Rate, Session Duration, Top Channels, Lead Generation, Cost per Acquisition
  - If the user asks for "HR dashboard" with "Headcount" → also add: Attrition Rate, Time to Hire, Employee Satisfaction, Department Distribution, Open Positions
- Use realistic sample data with plausible values. Include % change indicators (up/down arrows with green/red badges) on KPI cards.
- Show a mix of visualization types: KPI cards for headline numbers, an area/line chart for trends over time, a bar chart or donut chart for breakdowns by category.

DESIGN AESTHETIC (MANDATORY):
- MINIMAL and AIRY — think Notion analytics, Linear insights, or Vercel dashboard. NO sidebars, NO navigation menus, NO buttons. This is a data visualization mockup, not a full app.
- Font: 'DM Sans', sans-serif loaded via Google Fonts link in HTML — NEVER use Inter, Roboto, or Arial
- Background: #F8FAFC (soft off-white), NOT pure white
- Cards: white (#FFFFFF) with border-radius: 16px, border: 1px solid #E2E8F0, subtle shadow: 0 1px 3px rgba(0,0,0,0.04)
- Color palette:
  - Primary: #38B2AC (teal) for charts, highlights
  - Secondary: #5B6DC2 (lavender-indigo) for secondary charts
  - Accent: #D47B5A (warm peach) for alerts, important callouts
  - Gold: #C4A934 for tertiary data
  - Text: #1A202C (headings), #4A5568 (body), #94A3B8 (muted)
  - Borders: #E2E8F0
- Layout: Single-column or grid layout with NO sidebar. Start with a simple header (dashboard title + subtitle/date range), then a row of compact KPI cards, then charts below. Lots of whitespace. Think content-first, not chrome-heavy.
- KPI Cards: Compact — metric label (11px, uppercase, muted), large bold value (28-36px), small colored badge with % change. Keep cards slim, not tall.
- Charts: Use inline SVG for smooth, elegant visualizations — area charts with gradient fills, clean bar charts, or donut charts. Keep them lightweight with thin grid lines, subtle axis labels, and smooth curves. NO heavy borders or 3D effects. IMPORTANT: All SVG charts must use viewBox (e.g. viewBox="0 0 400 200") and NOT use fixed width/height attributes — they should scale naturally with their container without stretching. Keep chart aspect ratios reasonable (roughly 2:1 width to height).
- Typography hierarchy: Title (22-28px bold), values (28-36px bold), labels (11px semibold uppercase tracking-wide), body (13-14px regular)
- Spacing: Moderate padding (20-24px in cards), consistent gaps (16-20px grid gaps). Avoid oversized paddings that make cards feel bloated.
- DO NOT include: sidebars, navigation menus, hamburger menus, buttons, links, footers, or any interactive chrome. This is a clean data dashboard mockup — content only.

If an INSPIRATION URL is provided, try to match the overall layout style, color mood, and component arrangement of that site while still using the color palette above.

RESPONSE FORMAT (JSON only, no markdown):

{
  "image_url": "",
  "image_prompt": "A description of the dashboard that was generated",
  "html_content": "<!DOCTYPE html><html>...</html>"
}

The html_content MUST be a complete, self-contained HTML document with a <link> to Google Fonts for DM Sans, all styles in a <style> tag, and semantic HTML. CRITICAL SIZING RULES:
- The dashboard will be displayed inside an iframe that is approximately 1100px wide and 700px tall.
- ALL content MUST fit within this size WITHOUT scrolling.
- Add "html, body { margin: 0; padding: 24px; overflow: hidden; height: 100%; box-sizing: border-box; }" to the CSS.
- Do NOT use fixed pixel widths on containers — use percentages or max-width instead so content adapts.
- SVG charts should NOT have fixed width/height — use width: 100% and a viewBox so they scale proportionally without stretching.
- Keep the layout compact: max 4-5 KPI cards in a row, max 2 charts side by side. Do not overfill the page.
The dashboard should feel lightweight and breathable — something a designer would showcase as a clean data visualization.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured', use_fallback: true });
  }

  try {
    const { user_needs, target_audience, key_metrics, data_sources, dashboard_title, dashboard_subtitle, inspiration_url } = req.body;

    const userMessage = [
      `DASHBOARD PURPOSE: ${user_needs}`,
      target_audience ? `TARGET AUDIENCE: ${target_audience}` : '',
      key_metrics ? `KEY METRICS: ${key_metrics}` : '',
      data_sources ? `DATA SOURCES: ${data_sources}` : '',
      dashboard_title ? `DASHBOARD TITLE: ${dashboard_title}` : '',
      dashboard_subtitle ? `DASHBOARD SUBTITLE: ${dashboard_subtitle}` : '',
      inspiration_url ? `INSPIRATION URL: ${inspiration_url} — Use this website's layout, style, and visual approach as design inspiration for the dashboard.` : '',
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
      console.error('Gemini API error (dashboard):', errText);
      return res.status(502).json({ error: 'AI service error', use_fallback: true });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless function error (dashboard):', err);
    return res.status(500).json({ error: 'Internal server error', use_fallback: true });
  }
}
