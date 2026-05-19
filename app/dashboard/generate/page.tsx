'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Generate() {
  const [user, setUser] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [brief, setBrief] = useState<any>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
    })
  }, [])

  const steps = [
    'Researching NZ policy context...',
    'Identifying stakeholder impacts...',
    'Developing policy options...',
    'Applying Treasury framework...',
    'Drafting Cabinet paper format...',
  ]

  const generate = async () => {
    if (!topic.trim()) { setError('Please enter a policy topic.'); return }
    setError('')
    setLoading(true)
    setBrief(null)
    setSaved(false)

    let si = 0
    setLoadingStep(steps[0])
    const timer = setInterval(() => {
      si = Math.min(si + 1, steps.length - 1)
      setLoadingStep(steps[si])
    }, 1200)

    const prompt = `You are a senior policy advisor at Inland Revenue Department New Zealand. Write a policy brief on the following topic in New Zealand government Cabinet paper format.

Topic: ${topic}

Return your response as a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "title": "Brief title",
  "problemDefinition": "2-3 paragraphs defining the problem in NZ context",
  "currentSettings": "2 paragraphs on current NZ policy settings and relevant legislation",
  "options": [
    { "title": "Option 1", "pros": "advantages", "cons": "risks" },
    { "title": "Option 2", "pros": "advantages", "cons": "risks" },
    { "title": "Option 3", "pros": "advantages", "cons": "risks" }
  ],
  "analysis": "2-3 paragraphs using Treasury Living Standards Framework",
  "recommendation": "Clear recommended option with rationale",
  "nextSteps": "5 numbered next steps for NZ government process"
}`

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      clearInterval(timer)
      if (data.error) { setError(data.error); setLoading(false); return }
      setBrief(data.brief)
    } catch (e: any) {
      clearInterval(timer)
      setError(e.message || 'Something went wrong.')
    }
    setLoading(false)
  }

  const saveBrief = async () => {
    if (!brief || !user) return
    const { error } = await supabase.from('briefs').insert({
      user_id: user.id,
      title: brief.title,
      topic,
      content: brief,
      is_public: false
    })
    if (error) { setError(error.message); return }
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</Link>
        <Link href="/dashboard" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">
          ← My briefs
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate policy brief</h2>
        <p className="text-gray-500 text-sm mb-8">AI-powered briefs in NZ Cabinet paper format. Saved to your account.</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Policy topic</label>
          <input value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Income tax threshold adjustment, Gig economy taxation..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 mb-4" />
          <button onClick={generate} disabled={loading}
            className="w-full bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 text-sm">
            {loading ? loadingStep : 'Generate policy brief'}
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

        {brief && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-xl font-bold text-gray-900">{brief.title}</h3>
              <div className="flex gap-2">
                <button onClick={saveBrief} disabled={saved}
                  className="px-4 py-2 rounded-lg border text-sm font-medium transition"
                  style={{ background: saved ? '#e6f5ed' : 'white', color: saved ? '#0F6E56' : '#1a4731', borderColor: saved ? '#9fcdb4' : '#1a4731' }}>
                  {saved ? 'Saved ✓' : 'Save to library'}
                </button>
                <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
                  Export PDF
                </button>
              </div>
            </div>

            {[
              { label: 'Problem definition', content: brief.problemDefinition },
              { label: 'Current policy settings', content: brief.currentSettings },
              { label: 'Analysis', content: brief.analysis },
              { label: 'Recommendation', content: brief.recommendation },
              { label: 'Next steps', content: brief.nextSteps },
            ].map(s => (
              <div key={s.label} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0">
                <div className="text-xs font-bold uppercase tracking-widest text-green-800 mb-2">{s.label}</div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.content}</p>
              </div>
            ))}

            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-green-800 mb-3">Policy options</div>
              {brief.options?.map((opt: any, i: number) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="font-semibold text-sm mb-3">Option {i+1}: {opt.title}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs font-bold text-green-800 mb-1">Advantages</div>
                      <div className="text-xs text-gray-700">{opt.pros}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs font-bold text-red-800 mb-1">Risks</div>
                      <div className="text-xs text-gray-700">{opt.cons}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}