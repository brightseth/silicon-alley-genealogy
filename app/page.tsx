import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - NYC Gotham aesthetic */}
      <section className="bg-black py-20 px-4 border-b-4 border-silicon-alley-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-tight">
            Silicon Alley
          </h1>
          <p className="text-3xl md:text-4xl mb-8 font-bold text-silicon-alley-accent">
            30th Anniversary
          </p>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 leading-relaxed">
            The definitive genealogy of the pioneers who invented social media, digital advertising,
            and the modern internet in New York City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="bg-silicon-alley-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition shadow-lg border-2 border-silicon-alley-primary"
            >
              Share Your Story
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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Oral Histories</h3>
              <p className="text-gray-900 leading-relaxed">
                Capture first-hand accounts from the people who were there. Where were you?
                What were you building? Who inspired you?
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Interactive Timeline</h3>
              <p className="text-gray-900 leading-relaxed">
                Visualize the connections, companies, and moments that defined Silicon Alley.
                See how the web of innovation was woven.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-2xl font-bold mb-4 text-black">Pioneer Cards</h3>
              <p className="text-gray-900 leading-relaxed">
                Collectible NFT cards for each pioneer. Own a piece of internet history.
                Preserve the legacy on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          Help Us Preserve This History
        </h2>
        <p className="text-xl text-gray-900 mb-8 leading-relaxed">
          We have 21 days until the 30th anniversary celebration. Your story matters.
          Your connections matter. Your memories matter.
        </p>
        <Link
          href="/submit"
          className="inline-block bg-silicon-alley-primary text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-opacity-90 transition shadow-lg border-2 border-silicon-alley-primary"
        >
          Share Your Silicon Alley Story →
        </Link>
      </section>
    </div>
  );
}
