import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import PersonCard from './PersonCard';

interface Props {
  params: Promise<{ id: string }>;
}

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

async function getPerson(id: string): Promise<Person | null> {
  try {
    const result = await sql`
      SELECT id, name, handle, role, era, bio, avatar_url, nft_minted
      FROM people
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    // Get connections
    const connections = await sql`
      SELECT p.name
      FROM connections c
      JOIN people p ON (
        CASE
          WHEN c.person_a_id = ${id} THEN c.person_b_id = p.id
          WHEN c.person_b_id = ${id} THEN c.person_a_id = p.id
        END
      )
      WHERE c.person_a_id = ${id} OR c.person_b_id = ${id}
    `;

    return {
      ...result.rows[0],
      connections: connections.rows.map(c => c.name as string),
    } as Person;
  } catch (error) {
    console.error('Error fetching person:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) {
    return {
      title: 'Person Not Found',
    };
  }

  const ogImageUrl = `/api/og?${new URLSearchParams({
    name: person.name,
    handle: person.handle || '',
    role: person.role || '',
    era: person.era || '',
    bio: person.bio || '',
  })}`;

  return {
    title: `${person.name} - Silicon Alley Pioneer`,
    description: person.bio || `${person.name} - ${person.role}`,
    openGraph: {
      title: `${person.name} - Silicon Alley 30`,
      description: person.bio || `${person.name} - ${person.role}`,
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${person.name} - Silicon Alley 30`,
      description: person.bio || `${person.name} - ${person.role}`,
      images: [ogImageUrl],
    },
  };
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) {
    notFound();
  }

  return <PersonCard person={person} />;
}
