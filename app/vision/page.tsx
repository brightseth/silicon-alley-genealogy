export default function VisionPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-black">
            The V2 Vision
          </h1>
          <p className="text-xl text-gray-900 mb-2">
            An AI-Native Oral History Archive
          </p>
          <p className="text-sm text-silicon-alley-primary font-semibold">
            What if AGI existed in 1995?
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-black">V1: Foundation (Done ✓)</h2>
          <div className="space-y-2 text-gray-900">
            <p>✅ Database & API (stories, people, connections)</p>
            <p>✅ Dynamic timeline and people directory</p>
            <p>✅ Admin interface for story approval</p>
            <p>✅ Social sharing with OG images</p>
            <p>✅ Mobile-friendly throughout</p>
          </div>
        </div>

        {/* V2 Features */}
        <div className="bg-black text-white p-8 rounded-lg border-2 border-silicon-alley-primary mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>V2: The Agent That Remembers</span>
            <span className="text-sm bg-silicon-alley-primary px-3 py-1 rounded">PREVIEW</span>
          </h2>

          <div className="space-y-6">
            {/* Voice */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-silicon-alley-accent">
                🎤 Voice Collection
              </h3>
              <p className="text-gray-300 mb-2">
                Talk instead of type. The agent transcribes and asks follow-up questions.
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className="text-green-400">Prototype live on /submit</span>
              </p>
            </div>

            {/* Agent Chat */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-silicon-alley-accent">
                💬 Oracle Mode
              </h3>
              <p className="text-gray-300 mb-2">
                Ask the agent anything about Silicon Alley. It knows all the stories and connections.
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className="text-green-400">Prototype live on person pages</span>
              </p>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-silicon-alley-accent">
                📸 Photo & Document Ingestion
              </h3>
              <p className="text-gray-300 mb-2">
                Upload photos from 1995. Agent analyzes them, asks who's in the photo, links to people and events.
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className="text-yellow-400">Planned for March</span>
              </p>
            </div>

            {/* LinkedIn */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-silicon-alley-accent">
                💼 LinkedIn Auto-Extract
              </h3>
              <p className="text-gray-300 mb-2">
                Paste your LinkedIn. Agent extracts job history, finds overlaps with other pioneers, suggests connections.
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className="text-yellow-400">Planned for April</span>
              </p>
            </div>

            {/* Narrator */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-silicon-alley-accent">
                🎭 The Omniscient Narrator
              </h3>
              <p className="text-gray-300 mb-2">
                Like the Stage Manager in "Our Town" - an AI that knows everyone, sees all connections, can tell the story from any angle.
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className="text-yellow-400">Full launch Summer 2026</span>
              </p>
            </div>
          </div>
        </div>

        {/* The Vision Statement */}
        <div className="bg-gradient-to-br from-silicon-alley-primary to-silicon-alley-secondary p-8 rounded-lg text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">The Core Idea</h2>
          <p className="text-lg mb-4 leading-relaxed">
            <strong>V1</strong>: A website about Silicon Alley history
          </p>
          <p className="text-lg mb-4 leading-relaxed">
            <strong>V2</strong>: An AI that <em>lived through</em> Silicon Alley and remembers everything
          </p>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">
              "What if Silicon Alley had an AI in 1995 that remembered everything? That's what we're building.
              Not a database with a chatbot, but a narrator who knows the whole story and can tell it from any angle."
            </p>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-white p-8 rounded-lg border-2 border-gray-200 mb-12 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-black">Roadmap</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="font-bold text-silicon-alley-primary min-w-[100px]">Jan 2026</div>
              <div className="text-gray-900">
                <strong>V1 Launch</strong> at 30th anniversary event
                <br/>
                <span className="text-sm text-gray-600">Foundation solid, data collection begins</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="font-bold text-silicon-alley-primary min-w-[100px]">Feb 2026</div>
              <div className="text-gray-900">
                <strong>V1.5</strong> - Voice + basic agent features
                <br/>
                <span className="text-sm text-gray-600">Prove voice is better than typing</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="font-bold text-silicon-alley-primary min-w-[100px]">Mar 2026</div>
              <div className="text-gray-900">
                <strong>V1.75</strong> - Interview agent
                <br/>
                <span className="text-sm text-gray-600">Full conversational collection, photo uploads</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="font-bold text-silicon-alley-primary min-w-[100px]">Apr-Jun</div>
              <div className="text-gray-900">
                <strong>V2 Launch</strong> - Living archive complete
                <br/>
                <span className="text-sm text-gray-600">Agent is the narrator, multi-modal, exploration-first</span>
              </div>
            </div>
          </div>
        </div>

        {/* Try It Now */}
        <div className="bg-black text-white p-8 rounded-lg border-2 border-silicon-alley-primary text-center">
          <h2 className="text-2xl font-bold mb-4">Try the V2 Prototypes</h2>
          <p className="text-gray-300 mb-6">
            Two features are live now as previews of what's coming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/submit"
              className="bg-silicon-alley-primary hover:bg-opacity-90 px-8 py-4 rounded-lg font-bold transition"
            >
              🎤 Try Voice Recording
            </a>
            <a
              href="/people"
              className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition"
            >
              💬 Talk to the Agent
            </a>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Full technical specs in the repo:
          </p>
          <a
            href="https://github.com/brightseth/silicon-alley-genealogy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-silicon-alley-primary hover:underline font-semibold"
          >
            V2_VISION.md • V2_AGENT_ARCHITECTURE.md • V1_TO_V2_BRIDGE.md
          </a>
        </div>
      </div>
    </div>
  );
}
