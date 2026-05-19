import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PublicBriefs() {
  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, topic, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</Link>
        <div className="flex gap-3">
          <Link href="/login" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">Sign in</Link>
          <Link href="/signup" className="text-white text-sm px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700">Sign up</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Public policy briefs</h2>
        <p className="text-gray-500 text-sm mb-8">AI-generated policy briefs shared by the community.</p>

        {!briefs || briefs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No public briefs yet</h3>
            <p className="text-gray-500 text-sm mb-6">Sign up and generate a brief to share it publicly.</p>
            <Link href="/signup" className="bg-green-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm">
              Get started →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {briefs.map(brief => (
              <div key={brief.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-300 transition">
                <div className="text-xs text-gray-400 mb-2">{new Date(brief.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{brief.title}</h3>
                <p className="text-sm text-gray-500">{brief.topic}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}