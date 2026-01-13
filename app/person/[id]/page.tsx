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

interface RelatedPerson {
  id: string;
  name: string;
  role: string | null;
  reason: string;
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

    // Get connections with their IDs
    const connections = await sql`
      SELECT p.id, p.name
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

async function getRelatedPeople(personId: string, personName: string): Promise<RelatedPerson[]> {
  try {
    // Get people mentioned in stories about this person
    const mentionedIn = await sql`
      SELECT DISTINCT p.id, p.name, p.role,
        'mentioned in your story' as reason
      FROM people p
      JOIN stories s ON s.connections_mentioned ILIKE '%' || p.name || '%'
      WHERE s.person_id = ${personId}
      AND p.id != ${personId}
      LIMIT 3
    `;

    // Get people who mentioned this person
    const mentionedBy = await sql`
      SELECT DISTINCT p.id, p.name, p.role,
        'mentioned you in their story' as reason
      FROM people p
      JOIN stories s ON s.person_id = p.id
      WHERE s.connections_mentioned ILIKE '%' || ${personName} || '%'
      AND p.id != ${personId}
      LIMIT 3
    `;

    // Get other people in the database who aren't connected yet
    const others = await sql`
      SELECT id, name, role,
        'also a pioneer' as reason
      FROM people
      WHERE id != ${personId}
      AND id NOT IN (
        SELECT CASE WHEN person_a_id = ${personId} THEN person_b_id ELSE person_a_id END
        FROM connections
        WHERE person_a_id = ${personId} OR person_b_id = ${personId}
      )
      LIMIT 3
    `;

    const all = [...mentionedIn.rows, ...mentionedBy.rows, ...others.rows];
    // Dedupe by id
    const seen = new Set<string>();
    return all.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).slice(0, 5) as RelatedPerson[];
  } catch (error) {
    console.error('Error fetching related people:', error);
    return [];
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

  const relatedPeople = await getRelatedPeople(id, person.name);

  return <PersonCard person={person} relatedPeople={relatedPeople} />;
}
