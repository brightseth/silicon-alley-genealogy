import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Step 1: Convert base64 audio to Buffer
    const audioBuffer = Buffer.from(audio.replace(/^data:audio\/\w+;base64,/, ''), 'base64');

    // Step 2: Create a File object for Whisper
    const audioFile = new File([audioBuffer], 'recording.webm', { type: 'audio/webm' });

    // Step 3: Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    const transcribedText = transcription.text;

    // Step 4: Extract structured data with Claude
    const extractionPrompt = `You are extracting Silicon Alley story data from an oral history recording.

The speaker just told their story. Here's the transcription:

"${transcribedText}"

Extract the following structured data:
- Name (if mentioned)
- Handle/social media (if mentioned)
- Email (if mentioned)
- Where were you in January 1995? (location, office, neighborhood)
- What were you building? (company, project, website)
- Who inspired you? (people, companies, moments)
- Favorite memory (specific story or moment)
- Lessons learned (reflections, insights)
- Connections (names of other people mentioned)

Return as JSON with these exact keys:
{
  "name": "...",
  "handle": "...",
  "email": "...",
  "whereWereYou": "...",
  "whatWereYouBuilding": "...",
  "whoInspiredYou": "...",
  "favoriteMemory": "...",
  "lessonsLearned": "...",
  "connections": "...",
  "transcription": "${transcribedText}"
}

If any field isn't mentioned in the recording, use empty string "".
If connections are mentioned, list them as comma-separated names.`;

    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: extractionPrompt
      }]
    });

    const content = extraction.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response');
    }

    const extractedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: {
        ...extractedData,
        transcription: transcribedText
      }
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to transcribe audio',
      details: error.toString()
    }, { status: 500 });
  }
}
