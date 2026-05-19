import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.4
    })
  })

  const data = await res.json()
  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

  try {
    const text = data.choices[0].message.content
      .replace(/```json|```/g, '')
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      .trim()
    const brief = JSON.parse(text)
    return NextResponse.json({ brief })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }
}