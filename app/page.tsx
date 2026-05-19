import Link from 'next/link'

const topics = [
  { title: 'Income tax threshold adjustment', area: 'Tax policy', status: 'Active', desc: 'NZ income tax thresholds have not been adjusted since 2010, creating fiscal drag as inflation erodes their real value.' },
  { title: 'Gig economy taxation', area: 'Tax policy', status: 'Active', desc: 'Platform-based work (Uber, Airbnb, TaskRabbit) creates tax compliance gaps for GST and income tax collection.' },
  { title: 'Working for Families reform', area: 'Social policy', status: 'Active', desc: 'WFF tax credits create high effective marginal tax rates at abatement thresholds, reducing work incentives.' },
  { title: 'Closely-held company rules', area: 'Tax policy', status: 'Active', desc: 'Current rules may allow tax advantages not available to other business structures.' },
  { title: 'Charities tax settings', area: 'Tax policy', status: 'Active', desc: 'Review of tax exemptions for charitable organisations and whether current settings remain fit for purpose.' },
  { title: 'Child support scheme', area: 'Social policy', status: 'Active', desc: 'The child support formula has not been comprehensively reviewed since the 1990s.' },
  { title: 'Student loan interest settings', area: 'Social policy', status: 'Active', desc: 'Interest-free student loans for NZ-based borrowers — review of settings and fiscal sustainability.' },
  { title: 'Bright-line test for property', area: 'Tax policy', status: 'Recent change', desc: 'Reduced from 10 years to 2 years in 2024 — ongoing monitoring of housing market impacts.' },
  { title: 'Interest deductibility for rental', area: 'Tax policy', status: 'Recent change', desc: 'Interest deductibility for residential rental properties reinstated in 2024 after being restricted in 2021.' },
  { title: 'Minimum wage settings', area: 'Social policy', status: 'Active', desc: 'Annual review of minimum wage and its interaction with Working for Families and the tax-transfer system.' },
  { title: 'Digital services taxation', area: 'Tax policy', status: 'Active', desc: 'OECD-led work on ensuring multinational digital companies pay tax where they earn revenue.' },
  { title: 'Land value tax feasibility', area: 'Tax policy', status: 'Under consideration', desc: 'Exploratory work on whether a land value tax could improve housing affordability and productive investment.' },
]

const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700',
  'Recent change': 'bg-amber-100 text-amber-700',
  'Under consideration': 'bg-purple-100 text-purple-700',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-900 border-b-4 border-yellow-600 px-8 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white font-bold text-xl">🌿 NZ Policy Brief Platform</h1>
          <p className="text-green-300 text-xs mt-1">Tax & social policy tools for Aotearoa</p>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-white text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-800">Sign in</Link>
          <Link href="/signup" className="text-white text-sm px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700">Sign up free</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">Built for Aotearoa New Zealand</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">Generate NZ policy briefs<br />powered by AI</h2>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">Create structured briefs in NZ Cabinet paper format. Save to your library, share via link, compare options side by side.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="bg-green-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition">Get started free →</Link>
            <Link href="/briefs" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Browse public briefs</Link>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">IRD Work Programme</h3>
          <span className="text-xs text-gray-400">Click any topic to generate a brief</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => (
            <Link
              key={topic.title}
              href={`/login?redirect=${encodeURIComponent(`/dashboard/generate?topic=${encodeURIComponent(topic.title)}`)}`}
            
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-400 hover:shadow-sm transition block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">{topic.area}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[topic.status]}`}>{topic.status}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-snug">{topic.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
              <div className="mt-3 text-xs text-green-700 font-medium">Generate brief →</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '🤖', title: 'AI-powered analysis', desc: 'Generates briefs using Treasury\'s Living Standards Framework and IRD Cabinet paper format.' },
            { icon: '☁️', title: 'Saved to the cloud', desc: 'Your briefs stored in a real database — accessible from any device, never lost.' },
            { icon: '🔗', title: 'Share with anyone', desc: 'Make any brief public and share via a link. No account needed to read.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}