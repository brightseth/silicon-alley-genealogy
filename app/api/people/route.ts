import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/people
 * Get all people with their stories and connections
 */
export async function GET() {
  try {
    // Get all people
    const people = await sql`
      SELECT
        id,
        name,
        handle,
        role,
        era,
        bio,
        avatar_url,
        nft_token_id,
        nft_minted
      FROM people
      ORDER BY created_at DESC
    `;

    // For each person, get their connections
    const peopleWithConnections = await Promise.all(
      people.rows.map(async (person) => {
        const connections = await sql`
          SELECT
            p.name,
            c.relationship_type,
            c.company
          FROM connections c
          JOIN people p ON (
            CASE
              WHEN c.person_a_id = ${person.id} THEN c.person_b_id = p.id
              WHEN c.person_b_id = ${person.id} THEN c.person_a_id = p.id
              ELSE false
            END
          )
          WHERE c.person_a_id = ${person.id} OR c.person_b_id = ${person.id}
          LIMIT 10
        `;

        return {
          ...person,
          connections: connections.rows.map(c => c.name),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: peopleWithConnections,
    });

  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch people',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
