import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</h1>
          <p className="text-green-300 text-xs mt-1">Tax & social policy tools for Aotearoa</p>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">
            Sign in
          </Link>
          <Link href="/signup" className="text-white text-sm px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700">
            Sign up
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
          Built for Aotearoa New Zealand
        </div>
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Generate NZ policy briefs<br />powered by AI
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create structured policy briefs in NZ Cabinet paper format. Save them to your library, share via link, and compare options side by side.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup" className="bg-green-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
            Get started free →
          </Link>
          <Link href="/briefs" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Browse public briefs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🤖', title: 'AI-powered analysis', desc: 'Generates briefs using Treasury\'s Living Standards Framework and IRD Cabinet paper format.' },
          { icon: '☁️', title: 'Saved to the cloud', desc: 'Your briefs are stored in a real database — accessible from any device, never lost.' },
          { icon: '🔗', title: 'Share with anyone', desc: 'Make any brief public and share it via a link. No account needed to read.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}