import { NextRequest, NextResponse } from 'next/server';
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

    // TODO: Initialize Supabase client
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );

    // TODO: Check if person already exists
    // let person = await supabase
    //   .from('people')
    //   .select('*')
    //   .eq('email', body.email)
    //   .single();

    // For now, simulate success with console log
    console.log('Story submission received:', {
      name: body.name,
      email: body.email,
      handle: body.handle,
    });

    // TODO: Create or update person record
    // if (!person.data) {
    //   const { data: newPerson, error: personError } = await supabase
    //     .from('people')
    //     .insert({
    //       name: body.name,
    //       email: body.email,
    //       handle: body.handle,
    //     })
    //     .select()
    //     .single();
    //
    //   if (personError) throw personError;
    //   person.data = newPerson;
    // }

    // TODO: Create story record
    // const { data: story, error: storyError } = await supabase
    //   .from('stories')
    //   .insert({
    //     person_id: person.data.id,
    //     where_were_you: body.whereWereYou,
    //     what_were_you_building: body.whatWereYouBuilding,
    //     who_inspired_you: body.whoInspiredYou,
    //     favorite_memory: body.favoriteMemory,
    //     lessons_learned: body.lessonsLearned,
    //     status: 'pending',
    //   })
    //   .select()
    //   .single();
    //
    // if (storyError) throw storyError;

    // TODO: Parse connections from body.connections
    // if (body.connections) {
    //   const connectionNames = body.connections
    //     .split(',')
    //     .map(name => name.trim())
    //     .filter(name => name.length > 0);
    //
    //   // Store these for admin to review and create proper connections
    // }

    // TODO: Send confirmation email

    // TODO: Notify admin of new submission

    return NextResponse.json({
      success: true,
      message: 'Story submitted successfully! We\'ll review it and add you to the genealogy.',
      data: {
        // story_id: story.id,
        // person_id: person.data.id,
      },
    });

  } catch (error) {
    console.error('Error submitting story:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit story. Please try again.',
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
