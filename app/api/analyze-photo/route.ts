import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return NextResponse.json({
        success: false,
        error: 'Missing image or mimeType'
      }, { status: 400 });
    }

    // Analyze with Claude Vision
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: image,
            },
          },
          {
            type: 'text',
            text: `You are analyzing a photo that might be from Silicon Alley - NYC's 1990s tech scene.

Analyze this image and extract:

1. **People**: How many people? Describe what they're doing (working, socializing, presenting, etc.)
2. **Location**: Is this an office? Loft? Party? Café? What clues suggest the location?
3. **Technology**: What tech is visible? (computers, monitors, phones, modems, cables, whiteboards)
4. **Cultural details**: Clothing style, decorations, general vibe
5. **Text**: Any text visible (company names, posters, whiteboards, signs)
6. **Date estimate**: Based on technology and style, estimate the era (e.g., "mid-1990s", "1995-96")

Return ONLY valid JSON:
{
  "people_count": number,
  "people_description": "description of people and what they're doing",
  "location": "type of location and any specific details",
  "technology": ["list", "of", "visible", "tech"],
  "cultural_details": "clothing, decorations, vibe",
  "text_visible": "any readable text in the image",
  "estimated_date": "estimated time period",
  "suggested_questions": ["questions to ask the uploader about this photo"]
}

Be specific about what you actually see vs. what you infer. Generate 2-3 questions that would help identify people or add context.`
          }
        ]
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse analysis');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('Photo analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to analyze photo'
    }, { status: 500 });
  }
}
