'use client';

import { useEffect, useState } from 'react';

interface Person {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  era: string | null;
  bio: string | null;
  avatar_url: string | null;
  nft_token_id: string | null;
  nft_minted: boolean;
  connections: string[];
}

export default function People() {
  const [pioneers, setPioneers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/people')
      .then(res => res.json())
      .then(data => {
        setPioneers(data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading people:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading pioneers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-silicon-alley-secondary">
            Silicon Alley Pioneers
          </h1>
          <p className="text-xl text-gray-700">
            The people who built the social internet in New York City
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pioneers.map((person) => (
            <div key={person.id} className="player-card text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{person.name}</h3>
                  {person.handle && <p className="text-sm opacity-80">{person.handle}</p>}
                </div>
                <div className="text-4xl">🃏</div>
              </div>

              {person.era && (
                <div className="mb-4">
                  <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Era</div>
                  <div className="font-semibold">{person.era}</div>
                </div>
              )}

              {person.role && (
                <div className="mb-4">
                  <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Role</div>
                  <div className="font-semibold">{person.role}</div>
                </div>
              )}

              {person.bio && (
                <div className="mb-4">
                  <p className="text-sm opacity-90 leading-relaxed">{person.bio}</p>
                </div>
              )}

              {person.connections && person.connections.length > 0 && (
                <div>
                  <div className="text-xs opacity-70 uppercase tracking-wider mb-2">Connections</div>
                  <div className="flex flex-wrap gap-2">
                    {person.connections.map((connection, i) => (
                      <span
                        key={i}
                        className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                      >
                        {connection}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/20">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold text-sm transition">
                  {person.nft_minted ? 'View Your Card (NFT)' : 'Claim Your Card (NFT)'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-silicon-alley-secondary">
            Missing from the list?
          </h2>
          <p className="text-gray-700 mb-6">
            We're building the complete genealogy. If you were part of Silicon Alley in 1995-96,
            share your story and claim your player card.
          </p>
          <a
            href="/submit"
            className="inline-block bg-silicon-alley-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Get Your Card
          </a>
        </div>
      </div>
    </div>
  );
}
