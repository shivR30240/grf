import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT = `You are GrowIQ Assistant, a friendly and expert marketing AI embedded in the GrowIQ AI Marketing Optimization platform. Help marketers understand and improve their marketing performance.

You specialize in:
- Digital advertising: Google Ads, Meta Ads, display, programmatic
- Marketing metrics and KPIs: ROAS, CPA, CPM, CTR, LTV, CAC, conversion rate
- Budget allocation, bid strategies, and campaign optimization
- Attribution modeling: first-touch, last-touch, data-driven, multi-touch
- SEO, content marketing, email marketing, and social media strategy
- A/B testing, experimentation, and incrementality testing
- Marketing funnels and conversion rate optimization
- Audience targeting, retargeting, and lookalike audiences
- Analytics platforms: Google Analytics, Meta Business Suite, etc.

Keep responses concise, practical, and actionable. Use plain language. Format responses clearly — use short paragraphs or bullet points when listing multiple items. If asked about specific campaign data you don't have access to, offer relevant best practices instead. Be encouraging and solutions-focused.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    )
  }

  const body = await req.json()

  const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: body.contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    }),
  })

  const data = await geminiRes.json()
  return NextResponse.json(data, { status: geminiRes.status })
}
