import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { StorySubmission } from '@/app/types';

/**
 * POST /api/submit
 * Submit a new Silicon Alley story
 */
export async function POST(request: NextRequest) {
  try {
    const body: StorySubmission = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.whereWereYou || !body.whatWereYouBuilding || !body.whoInspiredYou) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if person already exists
    const existingPerson = await sql`
      SELECT id, name, email FROM people WHERE email = ${body.email}
    `;

    let personId: string;

    if (existingPerson.rows.length > 0) {
      // Person exists, use their ID
      personId = existingPerson.rows[0].id;
    } else {
      // Create new person
      const newPerson = await sql`
        INSERT INTO people (name, email, handle)
        VALUES (${body.name}, ${body.email}, ${body.handle || null})
        RETURNING id
      `;
      personId = newPerson.rows[0].id;
    }

    // Create story record
    const story = await sql`
      INSERT INTO stories (
        person_id,
        where_were_you,
        what_were_you_building,
        who_inspired_you,
        favorite_memory,
        lessons_learned,
        connections_mentioned,
        status
      ) VALUES (
        ${personId},
        ${body.whereWereYou},
        ${body.whatWereYouBuilding},
        ${body.whoInspiredYou},
        ${body.favoriteMemory || null},
        ${body.lessonsLearned || null},
        ${body.connections || null},
        'pending'
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Story submitted successfully! We\'ll review it and add you to the genealogy.',
      data: {
        story_id: story.rows[0].id,
        person_id: personId,
      },
    });

  } catch (error) {
    console.error('Error submitting story:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit story. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/submit
 * Not allowed - use POST to submit stories
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit stories.' },
    { status: 405 }
  );
}
