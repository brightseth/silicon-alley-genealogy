'use client';

import { useState } from 'react';
import PersonChat from '@/components/PersonChat';

interface Person {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  era: string | null;
  bio: string | null;
  avatar_url: string | null;
  nft_minted: boolean;
  connections: string[];
}

export default function PersonCard({ person }: { person: Person }) {
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterText = `Check out ${person.name}'s Silicon Alley pioneer card! Part of the NYC tech scene that built the social internet. #SiliconAlley30`;

  const handleShare = async (platform: 'twitter' | 'copy') => {
    if (platform === 'twitter') {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank');
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ogImageUrl = `/api/og?${new URLSearchParams({
    name: person.name,
    handle: person.handle || '',
    role: person.role || '',
    era: person.era || '',
    bio: person.bio || '',
  })}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Player Card */}
        <div className="player-card text-white mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{person.name}</h1>
              {person.handle && <p className="text-lg opacity-80">{person.handle}</p>}
            </div>
            <div className="text-6xl">🃏</div>
          </div>

          {person.era && (
            <div className="mb-6">
              <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Era</div>
              <div className="text-2xl font-semibold">{person.era}</div>
            </div>
          )}

          {person.role && (
            <div className="mb-6">
              <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Role</div>
              <div className="text-xl font-semibold">{person.role}</div>
            </div>
          )}

          {person.bio && (
            <div className="mb-6">
              <p className="text-base opacity-90 leading-relaxed">{person.bio}</p>
            </div>
          )}

          {person.connections && person.connections.length > 0 && (
            <div className="mb-6">
              <div className="text-xs opacity-70 uppercase tracking-wider mb-2">Connections</div>
              <div className="flex flex-wrap gap-2">
                {person.connections.map((connection, i) => (
                  <span
                    key={i}
                    className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                  >
                    {connection}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/20">
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg font-semibold transition">
              {person.nft_minted ? 'View Your Card (NFT)' : 'Claim Your Card (NFT)'}
            </button>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-black">Share This Card</h2>
          <p className="text-gray-700 mb-6">
            Help preserve Silicon Alley history by sharing {person.name}'s pioneer card
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <span>Share on X/Twitter</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex-1 bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              {copied ? '✓ Link Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Preview Image */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={ogImageUrl}
              alt={`${person.name} player card`}
              className="w-full"
            />
          </div>
        </div>

        {/* Agent Chat - V2 Preview */}
        <div className="mt-8">
          {!showChat ? (
            <button
              onClick={() => setShowChat(true)}
              className="w-full bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Ask the Agent About {person.name}</span>
              <span className="text-xs bg-silicon-alley-primary px-2 py-1 rounded">V2</span>
            </button>
          ) : (
            <PersonChat person={{
              name: person.name,
              bio: person.bio,
              role: person.role,
              era: person.era,
              connections: person.connections
            }} />
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/people"
            className="text-silicon-alley-primary hover:underline font-semibold"
          >
            ← Back to All Pioneers
          </a>
        </div>
      </div>
    </div>
  );
}
