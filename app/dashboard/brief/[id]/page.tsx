import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PublicBrief({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: brief } = await supabase
    .from('briefs')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle()

  if (!brief) notFound()

  const c = brief.content

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</Link>
        <div className="flex gap-3">
          <Link href="/login" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">Sign in</Link>
          <Link href="/signup" className="text-white text-sm px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700">Sign up free</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-green-800">This policy brief was generated using AI and shared publicly.</p>
          <Link href="/signup" className="text-sm font-semibold text-green-900 hover:underline">Generate your own →</Link>
        </div>

        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">
            {new Date(brief.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{c.title}</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {[
            { label: 'Problem definition', content: c.problemDefinition },
            { label: 'Current policy settings', content: c.currentSettings },
            { label: 'Analysis', content: c.analysis },
            { label: 'Recommendation', content: c.recommendation },
            { label: 'Next steps', content: c.nextSteps },
          ].map(s => s.content && (
            <div key={s.label} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0">
              <div className="text-xs font-bold uppercase tracking-widest text-green-800 mb-2">{s.label}</div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.content}</p>
            </div>
          ))}

          {c.options && (
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