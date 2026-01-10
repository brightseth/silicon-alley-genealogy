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

    // NOTE: Full Claude audio transcription coming soon
    // For V2 preview demo, we're showing the UX flow
    // In production, this will use Claude's audio transcription capability

    // For now, return demo structured data to show the concept
    const demoResponse = {
      name: "Demo User",
      handle: "@demo",
      email: "",
      whereWereYou: "I was working in a loft in Tribeca, running a small web design studio...",
      whatWereYouBuilding: "We were building early websites for arts organizations and indie magazines...",
      whoInspiredYou: "John Borthwick, the folks at Razorfish, and everyone at the early Pseudo parties...",
      favoriteMemory: "The night we launched our first big site - we stayed up until 4am debugging, then watched the sun rise over the Hudson...",
      lessonsLearned: "The technology changes, but community and creativity are what matter...",
      connections: "John Borthwick, Janice Fraser, the Razorfish crew",
      transcription: "[Voice transcription would appear here - this is a V2 preview showing the UX flow]"
    };

    return NextResponse.json({
      success: true,
      data: demoResponse
    });

    /* PRODUCTION VERSION (uncomment when Claude audio API is ready):
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'audio',  // Will be supported soon
            source: {
              type: 'base64',
              media_type: 'audio/webm',
              data: audio
            }
          },
          {
            type: 'text',
            text: `Extract structured Silicon Alley story data...`
          }
        ]
      }]
    });
    // Parse and return extracted data
    */

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to transcribe audio'
    }, { status: 500 });
  }
}
