import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { initialStory, conversationHistory, questionCount } = await request.json();

    // After 3 follow-ups, we're done
    if (questionCount >= 3) {
      // Extract all data from the full conversation
      const fullTranscript = conversationHistory
        .filter((m: any) => m.role === 'user')
        .map((m: any) => m.content)
        .join(' ');

      const extraction = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Extract Silicon Alley story data from this interview:

${fullTranscript}

Return as JSON with these keys: name, handle, email, whereWereYou, whatWereYouBuilding, whoInspiredYou, favoriteMemory, lessonsLearned, connections`
        }]
      });

      const content = extraction.content[0];
      if (content.type !== 'text') throw new Error('Unexpected response');

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      const extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return NextResponse.json({
        success: true,
        done: true,
        extractedData
      });
    }

    // Generate next follow-up question
    const questionPrompt = `You are interviewing someone about their Silicon Alley experience in 1995-1996.

Initial story: ${initialStory}

Conversation so far:
${conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('
')}

This is follow-up #${questionCount + 1} of 3.

Ask a specific, engaging follow-up question that will enrich their story. Focus on:
- Specific moments or memories
- Other people they worked with
- What they learned or challenges they faced
- Cultural details about Silicon Alley

Keep the question conversational and under 30 words.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: questionPrompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    return NextResponse.json({
      success: true,
      done: false,
      question: content.text.trim()
    });

  } catch (error: any) {
    console.error('Interview error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
