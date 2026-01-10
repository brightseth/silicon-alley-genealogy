import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.whereWereYou || !data.whatWereYouBuilding || !data.whoInspiredYou) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // First, check if person exists by email
    const existingPerson = await sql`
      SELECT id FROM people WHERE email = ${data.email}
    `;

    let personId;

    if (existingPerson.rows.length > 0) {
      // Person exists, update their info
      personId = existingPerson.rows[0].id;
      await sql`
        UPDATE people
        SET
          name = ${data.name},
          handle = ${data.handle || null},
          updated_at = NOW()
        WHERE id = ${personId}
      `;
    } else {
      // Create new person
      const newPerson = await sql`
        INSERT INTO people (name, handle, email, era)
        VALUES (${data.name}, ${data.handle || null}, ${data.email}, '1995-1996')
        RETURNING id
      `;
      personId = newPerson.rows[0].id;
    }

    // Create the story (pending approval)
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
      )
      VALUES (
        ${personId},
        ${data.whereWereYou},
        ${data.whatWereYouBuilding},
        ${data.whoInspiredYou},
        ${data.favoriteMemory || null},
        ${data.lessonsLearned || null},
        ${data.connections || null},
        'pending'
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      personId,
      storyId: story.rows[0].id,
      message: 'Story submitted successfully! It will be reviewed and added to the genealogy.'
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit story'
    }, { status: 500 });
  }
}
