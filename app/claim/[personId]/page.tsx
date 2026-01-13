import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import { ClaimNFT } from '@/components/web3/ClaimNFT';
import Link from 'next/link';

interface Person {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  era: string | null;
  bio: string | null;
}

async function getPerson(personId: string): Promise<Person | null> {
  try {
    const { rows } = await sql`
      SELECT id, name, handle, role, era, bio
      FROM people
      WHERE id = ${personId}
    `;
    return rows[0] as Person || null;
  } catch (error) {
    console.error('Error fetching person:', error);
    return null;
  }
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = await getPerson(personId);

  if (!person) {
    notFound();
  }

  // Generate OG image URL for the card
  const cardImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://silicon-alley-genealogy.vercel.app'}/api/og?id=${person.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Silicon Alley
          </Link>
          <span className="text-sm text-gray-500">30th Anniversary</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Claim Your Pioneer Card
          </h1>
          <p className="text-gray-600">
            Free to mint • Gasless • Yours forever
          </p>
        </div>

        <ClaimNFT
          personId={person.id}
          personName={person.name}
          cardImageUrl={cardImageUrl}
        />

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-3">About This Card</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Pioneer:</strong> {person.name}
            </p>
            {person.role && (
              <p>
                <strong>Role:</strong> {person.role}
              </p>
            )}
            {person.era && (
              <p>
                <strong>Era:</strong> {person.era}
              </p>
            )}
            {person.bio && (
              <p className="mt-3">{person.bio}</p>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-6 bg-amber-50 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-3">How It Works</h3>
          <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
            <li>Connect your wallet using Coinbase Smart Wallet</li>
            <li>Click "Claim Your Card" - completely free</li>
            <li>View your card on OpenSea</li>
            <li>Share and collect other pioneer cards</li>
          </ol>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/person/${person.id}`}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to {person.name}'s Profile
          </Link>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = await getPerson(personId);

  if (!person) {
    return { title: 'Pioneer Not Found' };
  }

  return {
    title: `Claim ${person.name}'s Pioneer Card | Silicon Alley`,
    description: `Mint a free edition of ${person.name}'s Silicon Alley Pioneer Card`,
    openGraph: {
      images: [`/api/og?id=${person.id}`],
    },
  };
}
