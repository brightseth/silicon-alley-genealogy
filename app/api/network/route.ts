import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all people
    const { rows: people } = await sql`
      SELECT id, name, handle, role, era, bio
      FROM people
      ORDER BY name
    `;

    // Get all connections
    const { rows: connections } = await sql`
      SELECT
        c.id,
        c.person_a_id as source,
        c.person_b_id as target,
        c.relationship_type,
        c.year,
        c.description,
        pa.name as source_name,
        pb.name as target_name
      FROM connections c
      JOIN people pa ON c.person_a_id = pa.id
      JOIN people pb ON c.person_b_id = pb.id
      ORDER BY c.year ASC
    `;

    // Calculate node sizes based on connection count
    const connectionCounts = new Map<string, number>();
    for (const conn of connections) {
      connectionCounts.set(conn.source, (connectionCounts.get(conn.source) || 0) + 1);
      connectionCounts.set(conn.target, (connectionCounts.get(conn.target) || 0) + 1);
    }

    // Format nodes with connection count
    const nodes = people.map(p => ({
      id: p.id,
      name: p.name,
      handle: p.handle,
      role: p.role,
      era: p.era,
      bio: p.bio,
      connections: connectionCounts.get(p.id) || 0
    }));

    // Format links
    const links = connections.map(c => ({
      id: c.id,
      source: c.source,
      target: c.target,
      type: c.relationship_type,
      year: c.year,
      description: c.description,
      sourceName: c.source_name,
      targetName: c.target_name
    }));

    // Get year range for timeline
    const years = connections.map(c => c.year).filter(Boolean);
    const minYear = Math.min(...years, 1994);
    const maxYear = Math.max(...years, 2015);

    return NextResponse.json({
      success: true,
      nodes,
      links,
      stats: {
        totalPeople: nodes.length,
        totalConnections: links.length,
        yearRange: { min: minYear, max: maxYear },
        mostConnected: [...connectionCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id, count]) => ({
            name: nodes.find(n => n.id === id)?.name,
            connections: count
          }))
      }
    });
  } catch (error) {
    console.error('Network API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch network data'
    }, { status: 500 });
  }
}
