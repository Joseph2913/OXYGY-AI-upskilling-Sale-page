import type { VercelRequest, VercelResponse } from '@vercel/node';

const HTML_FALLBACK_PROMPT = `You are an elite UI designer AND data strategist creating stunning, modern dashboard mockups. Your dashboards should look like they belong on Dribbble or Behance — minimal, airy, and visually refined.

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

const INSPIRATION_ANALYSIS_PROMPT = `You are an expert UI/UX analyst specializing in dashboard design. Analyze the provided dashboard screenshot(s) and extract the key design patterns. Focus on:

1. LAYOUT STRUCTURE: How are widgets arranged? Grid layout, column count, section grouping
2. COLOR SCHEME: Primary colors, accent colors, background tones, card styling
3. CHART TYPES: What visualization types are used (bar, line, donut, gauge, heatmap, sparkline, etc.)
4. INFORMATION DENSITY: Is it data-dense or spacious? How many KPIs/widgets are visible?
5. TYPOGRAPHY: Font style, heading sizes relative to body text, label formatting
6. CARD DESIGN: Border radius, shadows, borders, padding style
7. SPECIAL ELEMENTS: Any unique design patterns like progress bars, status indicators, alerts, tabs

Output a concise paragraph (3-5 sentences) describing these patterns as design instructions that could guide generating a similar dashboard. Be specific about colors, layout ratios, and widget types. Do NOT describe the data — only the visual design patterns.`;

const REFINEMENT_PROMPT = `You are an expert at refining image generation prompts for dashboard mockups. You will receive the original prompt that generated a dashboard image, the user's feedback about what they want changed, and optionally design patterns extracted from the user's inspiration images. Your job is to produce a NEW, complete image generation prompt that incorporates the user's feedback and the inspiration design patterns while keeping all the good parts of the original prompt. Output ONLY the refined prompt text, nothing else. Keep all formatting instructions (crisp text, 16:9 ratio, DM Sans font, etc.) from the original. If design reference patterns from inspiration images are provided, make sure they are incorporated into the new prompt.`;

function parseInspirationImage(img: string): { inlineData: { mimeType: string; data: string } } | null {
  if (!img.startsWith('data:')) return null;
  const commaIdx = img.indexOf(',');
  if (commaIdx === -1) return null;
  const header = img.slice(5, commaIdx);
  const semiIdx = header.indexOf(';');
  if (semiIdx === -1) return null;
  const mimeType = header.slice(0, semiIdx);
  const data = img.slice(commaIdx + 1);
  if (!mimeType.startsWith('image/') || !data) return null;
  return { inlineData: { mimeType, data } };
}

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
    const {
      user_needs, target_audience, key_metrics, data_sources,
      dashboard_type, visual_style, inspiration_url,
      refinement_feedback, previous_prompt,
      inspiration_images,
    } = req.body;

    // ─── Build style description ───
    const styleDesc = visual_style === 'data-dense' ? 'data-dense with maximum information density'
      : visual_style === 'executive-polished' ? 'executive and polished with large KPI cards'
      : visual_style === 'colorful-visual' ? 'colorful and visual with bold infographic style'
      : 'clean and minimal with lots of whitespace';

    // ─── Analyze inspiration images if provided ───
    let inspirationPatterns = '';
    if (inspiration_images && Array.isArray(inspiration_images) && inspiration_images.length > 0) {
      console.log(`Analyzing ${inspiration_images.length} inspiration image(s)...`);
      try {
        const analyzeUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const imageParts = inspiration_images.map(parseInspirationImage).filter(Boolean);

        if (imageParts.length > 0) {
          const analyzeResponse = await fetch(analyzeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: INSPIRATION_ANALYSIS_PROMPT }] },
              contents: [{
                role: 'user',
                parts: [
                  { text: 'Analyze these dashboard screenshot(s) and extract the key design patterns:' },
                  ...imageParts,
                ],
              }],
              generationConfig: { temperature: 0.3 },
            }),
          });

          if (analyzeResponse.ok) {
            const analyzeData = await analyzeResponse.json();
            const patterns = analyzeData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (patterns.trim()) {
              inspirationPatterns = patterns.trim();
              console.log('Inspiration image analysis complete');
            }
          } else {
            console.log('Inspiration analysis failed, continuing without it');
          }
        }
      } catch (analyzeErr) {
        console.log('Inspiration analysis error, continuing without it:', analyzeErr);
      }
    }

    // ─── Build image generation prompt ───
    let imagePrompt: string;

    if (refinement_feedback && previous_prompt) {
      // Refine the previous prompt with user feedback
      console.log('Refining image prompt based on user feedback...');
      const refinementUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const inspirationContext = inspirationPatterns
        ? `\n\nDESIGN REFERENCE FROM INSPIRATION IMAGES (must be maintained in the refined prompt): ${inspirationPatterns}`
        : '';

      const refinementResponse = await fetch(refinementUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: REFINEMENT_PROMPT }] },
          contents: [{
            role: 'user',
            parts: [{ text: `ORIGINAL PROMPT:\n${previous_prompt}\n\nUSER FEEDBACK:\n${refinement_feedback}${inspirationContext}\n\nGenerate the refined prompt:` }],
          }],
          generationConfig: { temperature: 0.4 },
        }),
      });

      if (refinementResponse.ok) {
        const refinementData = await refinementResponse.json();
        const refinedText = refinementData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (refinedText.trim()) {
          imagePrompt = refinedText.trim();
          console.log('Prompt refined successfully');
        } else {
          imagePrompt = `${previous_prompt} IMPORTANT CHANGES REQUESTED: ${refinement_feedback}${inspirationPatterns ? ` DESIGN REFERENCE: ${inspirationPatterns}` : ''}`;
        }
      } else {
        imagePrompt = `${previous_prompt} IMPORTANT CHANGES REQUESTED: ${refinement_feedback}${inspirationPatterns ? ` DESIGN REFERENCE: ${inspirationPatterns}` : ''}`;
      }
    } else {
      imagePrompt = `Generate a high-fidelity professional dashboard UI screenshot mockup for ${target_audience || 'business users'}. The dashboard shows: ${key_metrics || 'key business metrics'}. Purpose: ${user_needs}. Style: ${styleDesc}. ${dashboard_type ? `Type: ${dashboard_type}.` : ''} The dashboard has KPI metric cards at the top showing exact numbers with percentage change indicators, followed by line charts and bar charts below with clearly labeled axes. Modern flat design, white background with subtle gray borders, teal and navy color scheme. DM Sans font. Make ALL text, numbers, labels, and axis values crisp, sharp, and perfectly readable. 16:9 aspect ratio. This should look like a real production web application screenshot.${inspirationPatterns ? `\n\nIMPORTANT DESIGN REFERENCE — The user provided inspiration images. Match these design patterns closely: ${inspirationPatterns}` : ''}`;
    }

    console.log('Generating dashboard with Gemini 2.5 Flash Image...');
    console.log('  → Prompt length:', imagePrompt.length, 'chars');

    // ─── Strategy 1: Gemini 2.5 Flash Image (native image generation) ───
    try {
      const geminiImageUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
      const geminiImageResponse = await fetch(geminiImageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
            imageConfig: { aspectRatio: '16:9' },
          },
        }),
      });

      if (geminiImageResponse.ok) {
        const geminiImageData = await geminiImageResponse.json();
        const parts = geminiImageData?.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: any) => p.inlineData);
        if (imagePart?.inlineData?.data) {
          const mimeType = imagePart.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;
          console.log('Gemini 2.5 Flash Image generation successful');
          return res.status(200).json({
            image_url: imageUrl,
            image_prompt: imagePrompt,
            generation_method: 'gemini-image',
          });
        }
      }
      const errText = await geminiImageResponse.text().catch(() => '');
      console.log('Gemini Image not available, falling back to HTML generation:', errText.slice(0, 200));
    } catch (geminiImageErr) {
      console.log('Gemini Image error, falling back to HTML generation:', geminiImageErr);
    }

    // ─── Strategy 2: Fallback to Gemini HTML generation ───
    console.log('Using Gemini HTML fallback...');
    const userMessage = [
      `DASHBOARD PURPOSE: ${user_needs}`,
      target_audience ? `TARGET AUDIENCE: ${target_audience}` : '',
      key_metrics ? `KEY METRICS: ${key_metrics}` : '',
      data_sources ? `DATA SOURCES: ${data_sources}` : '',
      dashboard_type ? `DASHBOARD TYPE: ${dashboard_type}` : '',
      visual_style ? `VISUAL STYLE: ${visual_style}` : '',
      inspiration_url ? `INSPIRATION URL: ${inspiration_url} — Use this website's layout, style, and visual approach as design inspiration for the dashboard.` : '',
    ].filter(Boolean).join('\n');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: HTML_FALLBACK_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
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
    parsed.generation_method = 'html';

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Serverless function error (dashboard):', err);
    return res.status(500).json({ error: 'Internal server error', use_fallback: true });
  }
}
