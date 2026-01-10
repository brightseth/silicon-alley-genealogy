import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();

    if (!audio) {
      return NextResponse.json({
        success: false,
        error: 'No audio data provided'
      }, { status: 400 });
    }

    // Transcribe and extract structured data using Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'audio/webm',
              data: audio
            }
          },
          {
            type: 'text',
            text: `You are the Silicon Alley Memory Keeper, an AI documenting the history of NYC's tech scene in the 1990s.

Transcribe this oral history recording and extract structured information.

Extract:
1. **Name**: The person's full name
2. **Handle**: Their Twitter/social media handle (if mentioned)
3. **Email**: Their email address (if provided)
4. **Where Were You**: Where they were in January 1995 (neighborhood, office, company)
5. **What Were You Building**: What project/company/product they were working on
6. **Who Inspired You**: People who influenced them (names, companies, mentors)
7. **Favorite Memory**: A specific memorable moment or story
8. **Lessons Learned**: What they learned looking back
9. **Connections**: Names of other people they mention (colleagues, partners, competitors)

Return a JSON object with these fields. If something wasn't mentioned, use null.
Also include a "transcription" field with the full verbatim transcript.

Be warm and conversational in how you structure the data - preserve their voice.`
          }
        ]
      })
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON from Claude's response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response');
    }

    const extracted = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: {
        name: extracted.Name || extracted.name || '',
        handle: extracted.Handle || extracted.handle || '',
        email: extracted.Email || extracted.email || '',
        whereWereYou: extracted['Where Were You'] || extracted.whereWereYou || '',
        whatWereYouBuilding: extracted['What Were You Building'] || extracted.whatWereYouBuilding || '',
        whoInspiredYou: extracted['Who Inspired You'] || extracted.whoInspiredYou || '',
        favoriteMemory: extracted['Favorite Memory'] || extracted.favoriteMemory || '',
        lessonsLearned: extracted['Lessons Learned'] || extracted.lessonsLearned || '',
        connections: extracted.Connections || extracted.connections || '',
        transcription: extracted.transcription || content.text
      }
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to transcribe audio'
    }, { status: 500 });
  }
}
