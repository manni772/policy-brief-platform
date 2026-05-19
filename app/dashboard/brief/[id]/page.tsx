'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BriefDetail({ params }: { params: { id: string } }) {
  const [brief, setBrief] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: sessionData }) => {
      if (!sessionData.session) { router.push('/login'); return }
      
      const { data: brief, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()
      
      if (error || !brief) {
        setError(`Brief not found. Error: ${error?.message || 'No data returned'}`)
        setLoading(false)
        return
      }
      setBrief(brief)
      setLoading(false)
    })
  }, [params.id])

  const togglePublic = async () => {
    const { error } = await supabase
      .from('briefs')
      .update({ is_public: !brief.is_public })
      .eq('id', brief.id)
    if (!error) setBrief({ ...brief, is_public: !brief.is_public })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading brief...</div>
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">{error}</p>
      <Link href="/dashboard" className="text-green-700 hover:underline text-sm">← Back to dashboard</Link>
    </div>
  )

  const c = brief.content

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</Link>
        <Link href="/dashboard" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">
          ← My briefs
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-2">
              {new Date(brief.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              {brief.is_public && <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium text-xs">Public</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{c?.title}</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={togglePublic} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
              {brief.is_public ? 'Make private' : 'Make public'}
            </button>
            {brief.is_public && (
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/briefs/${brief.id}`)
                alert('Share link copied!')
              }} className="text-sm px-4 py-2 rounded-lg border border-green-700 text-green-700 hover:bg-green-50 transition">
                Copy share link
              </button>
            )}
            <button onClick={() => window.print()} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {[
            { label: 'Problem definition', content: c?.problemDefinition },
            { label: 'Current policy settings', content: c?.currentSettings },
            { label: 'Analysis', content: c?.analysis },
            { label: 'Recommendation', content: c?.recommendation },
            { label: 'Next steps', content: c?.nextSteps },
          ].map(s => s.content && (
            <div key={s.label} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0">
              <div className="text-xs font-bold uppercase tracking-widest text-green-800 mb-2">{s.label}</div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.content}</p>
            </div>
          ))}

          {c?.options && (
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-green-800 mb-3">Policy options</div>
              {c.options.map((opt: any, i: number) => (
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
          )}
        </div>
      </div>
    </div>
  )
}