import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/timeline
 * Get all timeline events with related people
 */
export async function GET() {
  try {
    // Get all timeline events with people
    const events = await sql`
      SELECT
        e.id,
        e.date,
        e.title,
        e.description,
        e.event_type,
        e.location,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'name', p.name,
              'handle', p.handle
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) as people
      FROM timeline_events e
      LEFT JOIN timeline_event_people tep ON e.id = tep.event_id
      LEFT JOIN people p ON tep.person_id = p.id
      GROUP BY e.id, e.date, e.title, e.description, e.event_type, e.location
      ORDER BY e.date ASC
    `;

    return NextResponse.json({
      success: true,
      data: events.rows,
    });

  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch timeline',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
