import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-silicon-alley-primary via-silicon-alley-secondary to-silicon-alley-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Silicon Alley
          </h1>
          <p className="text-3xl md:text-4xl mb-8 font-light">
            30th Anniversary
          </p>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            The definitive genealogy of the pioneers who invented social media, digital advertising,
            and the modern internet in New York City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="bg-white text-silicon-alley-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Share Your Story
            </Link>
            <Link
              href="/timeline"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
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
            <h2 className="text-4xl font-bold mb-6 text-silicon-alley-secondary">
              Where Were You in January 1995?
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Before social media was "social media." Before the dot-com boom. Before Silicon Valley
              dominated the narrative. There was Silicon Alley.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              In the mid-90s, a scrappy community of dreamers, builders, and misfits gathered in
              New York City to invent the social internet. From Flatiron lofts to East Village cafes,
              they created the foundations of everything we use today.
            </p>
            <p className="text-lg text-gray-700">
              This is their story. This is our history.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="terminal p-6 rounded">
              <p className="mb-2">&gt; whoami</p>
              <p className="text-silicon-alley-accent mb-4">silicon_alley_pioneer</p>
              <p className="mb-2">&gt; pwd</p>
              <p className="text-silicon-alley-accent mb-4">/home/nyc/1995</p>
              <p className="mb-2">&gt; ls -la companies/</p>
              <p className="text-gray-400">
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
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-silicon-alley-secondary">
            What We're Building
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-2xl font-bold mb-4">Oral Histories</h3>
              <p className="text-gray-700">
                Capture first-hand accounts from the people who were there. Where were you?
                What were you building? Who inspired you?
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-4">Interactive Timeline</h3>
              <p className="text-gray-700">
                Visualize the connections, companies, and moments that defined Silicon Alley.
                See how the web of innovation was woven.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-2xl font-bold mb-4">Pioneer Cards</h3>
              <p className="text-gray-700">
                Collectible NFT cards for each pioneer. Own a piece of internet history.
                Preserve the legacy on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 text-silicon-alley-secondary">
          Help Us Preserve This History
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          We have 21 days until the 30th anniversary celebration. Your story matters.
          Your connections matter. Your memories matter.
        </p>
        <Link
          href="/submit"
          className="inline-block bg-silicon-alley-primary text-white px-12 py-5 rounded-lg font-semibold text-xl hover:bg-opacity-90 transition shadow-lg"
        >
          Share Your Silicon Alley Story →
        </Link>
      </section>
    </div>
  );
}
