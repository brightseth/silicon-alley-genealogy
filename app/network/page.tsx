import NetworkGraph from '@/components/NetworkGraph';

export const metadata = {
  title: 'Network | Silicon Alley Genealogy',
  description: 'Explore the connections that built Silicon Alley - the network of founders, investors, and builders who created NYC tech.'
};

export default function NetworkPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          The Silicon Alley Network
        </h1>
        <p className="text-xl text-gray-600">
          Explore the connections that built NYC&apos;s first tech scene.
          Drag the timeline to see how the network grew from 1994 to today.
        </p>
      </div>

      <NetworkGraph />

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Click</strong> a node to see their connections highlighted</li>
            <li>• <strong>Hover</strong> to see names of less-connected people</li>
            <li>• <strong>Slide</strong> the timeline to see network growth over time</li>
            <li>• Larger nodes = more connections in the network</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Network Effect</h2>
          <p className="text-gray-700 mb-3">
            Silicon Alley wasn&apos;t just companies - it was relationships.
            Mentorships, co-founders, investors, and colleagues who built
            on each other&apos;s ideas.
          </p>
          <p className="text-gray-700">
            This visualization shows how one connection leads to another,
            and how the NYC tech ecosystem grew through personal networks.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-slate-100 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Add Your Connections</h2>
        <p className="text-gray-700 mb-4">
          Were you part of the Silicon Alley scene? Help us map the network
          by sharing your story and mentioning who you worked with.
        </p>
        <a
          href="/submit"
          className="inline-block bg-silicon-alley-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-silicon-alley-secondary transition"
        >
          Share Your Story →
        </a>
      </div>
    </div>
  );
}
