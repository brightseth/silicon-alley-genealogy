import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - NYC Gotham aesthetic */}
      <section className="bg-black py-20 px-4 border-b-4 border-silicon-alley-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-mono text-silicon-alley-accent mb-4 tracking-wider">
            JANUARY 1995 - 2025
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-tight">
            Silicon Alley
          </h1>
          <p className="text-3xl md:text-4xl mb-4 font-bold text-silicon-alley-accent">
            30th Anniversary
          </p>
          <p className="text-lg md:text-xl mb-8 text-gray-400">
            Jan 28-31, 2026 at Betaworks · 1,000+ RSVPs
          </p>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 leading-relaxed">
            A living archive of NYC's first tech scene. AI-powered oral histories.
            On-chain player cards. The definitive genealogy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition shadow-lg"
            >
              Talk to the AI Oracle
            </Link>
            <Link
              href="/timeline"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition"
            >
              Explore Timeline
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Where Were You in January 1995?
            </h2>
            <p className="text-lg text-gray-900 mb-4 leading-relaxed">
              Before social media was "social media." Before the dot-com boom. Before Silicon Valley
              dominated the narrative. There was Silicon Alley.
            </p>
            <p className="text-lg text-gray-900 mb-4 leading-relaxed">
              In the mid-90s, a scrappy community of dreamers, builders, and misfits gathered in
              New York City to invent the social internet. From Flatiron lofts to East Village cafes,
              they created the foundations of everything we use today.
            </p>
            <p className="text-lg text-gray-900 font-semibold">
              This is their story. This is our history.
            </p>
          </div>
          <div className="bg-black p-8 rounded-lg border-2 border-gray-800 shadow-2xl">
            <div className="font-mono text-sm">
              <p className="mb-2 text-green-400">&gt; whoami</p>
              <p className="text-green-300 mb-4">silicon_alley_pioneer</p>
              <p className="mb-2 text-green-400">&gt; pwd</p>
              <p className="text-green-300 mb-4">/home/nyc/1995</p>
              <p className="mb-2 text-green-400">&gt; ls -la companies/</p>
              <p className="text-green-500/70 leading-relaxed">
                theglobe.com<br />
                razorfish<br />
                doubleclick<br />
                agency.com<br />
                totalnews<br />
                echo<br />
                pseudo<br />
                starmedia<br />
                ...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 border-t-2 border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
            What We're Building
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-black">AI Oracle</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                An AI that remembers every story from Silicon Alley. Ask it anything about the era.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-xl font-bold mb-3 text-black">Player Cards</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Open edition NFTs on Base. Mint cards of your favorite pioneers. Free for attendees.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🪙</div>
              <h3 className="text-xl font-bold mb-3 text-black">$ALLEY Token</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Community token. Earn by minting cards and submitting stories. Use to unlock features.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-3 text-black">Living Timeline</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Interactive chronology weaving stories together. See how the scene evolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pioneers Section */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            The Pioneers
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            The Silicon Alley 100 - the founders, builders, and visionaries who created NYC's tech scene
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'John Borthwick', 'Fred Wilson', 'Kevin Ryan', 'Jason Calacanis',
              'Craig Kanarick', 'Jeff Dachis', 'Josh Harris', 'Kevin O\'Connor',
              'Dwight Merriman', 'Esther Dyson', 'Jerry Colonna', 'Clay Shirky',
              'Rufus Griscom', 'Stacy Horn', 'Mark Stahlman', 'Alice O\'Rourke'
            ].map((name) => (
              <span key={name} className="px-4 py-2 bg-white/10 rounded-full text-white border border-white/20">
                {name}
              </span>
            ))}
            <span className="px-4 py-2 bg-silicon-alley-primary/20 rounded-full text-silicon-alley-accent border border-silicon-alley-primary/40">
              + 84 more pioneers
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          Help Us Preserve This History
        </h2>
        <p className="text-xl text-gray-900 mb-8 leading-relaxed">
          16 days until the 30th anniversary celebration. Your story matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demo"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition shadow-lg"
          >
            Try the AI Oracle
          </Link>
          <Link
            href="/submit"
            className="inline-block bg-silicon-alley-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition shadow-lg"
          >
            Share Your Story
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4 border-t-2 border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            A collaboration between{' '}
            <span className="font-semibold">John Borthwick</span> and{' '}
            <span className="font-semibold">Seth Goldstein</span>
          </p>
          <p className="text-gray-500 text-sm">
            Built with AI. Preserved on Base. Celebrating NYC tech pioneers since 1995.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <Link href="/demo" className="text-silicon-alley-primary hover:underline">
              AI Oracle
            </Link>
            <Link href="/timeline" className="text-silicon-alley-primary hover:underline">
              Timeline
            </Link>
            <Link href="/submit" className="text-silicon-alley-primary hover:underline">
              Submit Story
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
