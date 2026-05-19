'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</h1>
          <p className="text-green-300 text-xs mt-1">Tax & social policy tools for Aotearoa</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-300 text-sm">{user.email}</span>
          <button onClick={signOut} className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My policy briefs</h2>
            <p className="text-gray-500 text-sm mt-1">Generate, save and manage your policy briefs</p>
          </div>
          <Link href="/dashboard/generate" className="bg-green-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm">
            + Generate new brief
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No briefs yet</h3>
          <p className="text-gray-500 text-sm mb-6">Generate your first AI-powered policy brief</p>
          <Link href="/dashboard/generate" className="bg-green-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm">
            Generate first brief →
          </Link>
        </div>
      </div>
    </div>
  )
}