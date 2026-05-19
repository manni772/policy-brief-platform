'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [briefs, setBriefs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: briefs } = await supabase
        .from('briefs')
        .select('id, title, topic, created_at, is_public')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setBriefs(briefs || [])
      setLoading(false)
    })
  }, [])

  const deleteBrief = async (id: string) => {
    await supabase.from('briefs').delete().eq('id', id)
    setBriefs(prev => prev.filter(b => b.id !== id))
  }

  const togglePublic = async (id: string, isPublic: boolean) => {
    await supabase.from('briefs').update({ is_public: !isPublic }).eq('id', id)
    setBriefs(prev => prev.map(b => b.id === id ? { ...b, is_public: !isPublic } : b))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</h1>
          <p className="text-green-300 text-xs mt-1">Tax & social policy tools for Aotearoa</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-300 text-sm">{user?.email}</span>
          <button onClick={signOut} className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My policy briefs</h2>
            <p className="text-gray-500 text-sm mt-1">{briefs.length} brief{briefs.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Link href="/dashboard/generate" className="bg-green-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm">
            + Generate new brief
          </Link>
        </div>

        {briefs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No briefs yet</h3>
            <p className="text-gray-500 text-sm mb-6">Generate your first AI-powered policy brief</p>
            <Link href="/dashboard/generate" className="bg-green-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm">
              Generate first brief →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {briefs.map(brief => (
              <div key={brief.id} className="bg-white rounded-xl border border-gray-200 p-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{new Date(brief.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {brief.is_public && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Public</span>}
                  </div>
                  <Link href={`/dashboard/brief/${brief.id}`} className="font-semibold text-gray-900 hover:text-green-800 hover:underline block mb-1">
                    {brief.title}
                  </Link>
                  <p className="text-sm text-gray-500">{brief.topic}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublic(brief.id, brief.is_public)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                    {brief.is_public ? 'Make private' : 'Make public'}
                  </button>
                  <button onClick={() => deleteBrief(brief.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}