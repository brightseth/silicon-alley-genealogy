import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const stories = await sql`
      SELECT
        s.id,
        s.person_id,
        p.name as person_name,
        p.email as person_email,
        p.handle as person_handle,
        s.where_were_you,
        s.what_were_you_building,
        s.who_inspired_you,
        s.favorite_memory,
        s.lessons_learned,
        s.connections,
        s.status,
        s.created_at
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE s.status = ${status}
      ORDER BY s.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: stories.rows
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stories'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { story_id, status } = await request.json();

    if (!story_id || !status) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status'
      }, { status: 400 });
    }

    const result = await sql`
      UPDATE stories
      SET status = ${status}
      WHERE id = ${story_id}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Story not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Story ${status}`
    });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update story'
    }, { status: 500 });
  }
}
