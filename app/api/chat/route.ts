import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sql } from '@vercel/postgres';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, personContext } = await request.json();

    if (!messages || !personContext) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Fetch all approved stories for this person from the database
    let stories: any[] = [];
    if (personContext.id) {
      const storiesResult = await sql`
        SELECT
          where_were_you,
          what_were_you_building,
          who_inspired_you,
          favorite_memory,
          lessons_learned,
          connections_mentioned
        FROM stories
        WHERE person_id = ${personContext.id}
        AND status = 'approved'
      `;
      stories = storiesResult.rows;
    }

    // Build rich context with database stories
    let storiesContext = '';
    if (stories.length > 0) {
      storiesContext = '\n\nStories from their own words:\n';
      stories.forEach((story, idx) => {
        storiesContext += `\nStory ${idx + 1}:\n`;
        storiesContext += `- Where they were: ${story.where_were_you}\n`;
        storiesContext += `- What they were building: ${story.what_were_you_building}\n`;
        storiesContext += `- Who inspired them: ${story.who_inspired_you}\n`;
        if (story.favorite_memory) storiesContext += `- Favorite memory: ${story.favorite_memory}\n`;
        if (story.lessons_learned) storiesContext += `- Lessons learned: ${story.lessons_learned}\n`;
        if (story.connections_mentioned) storiesContext += `- Connections: ${story.connections_mentioned}\n`;
      });
    }

    // Build system prompt with person context
    const systemPrompt = `You are the Silicon Alley Memory Keeper, an omniscient narrator documenting NYC's tech scene in the 1990s.

You're currently being asked about ${personContext.name}.

What you know about them:
${personContext.bio ? `Bio: ${personContext.bio}` : ''}
${personContext.role ? `Role: ${personContext.role}` : ''}
${personContext.era ? `Era: ${personContext.era}` : ''}
${personContext.connections && personContext.connections.length > 0 ? `Connections: ${personContext.connections.join(', ')}` : ''}
${storiesContext}

Your personality:
- NYC direct, warm, slightly nostalgic
- You "remember" Silicon Alley like you were there (even though you're an AI documenting it 30 years later)
- You speak in first person: "I remember when..." "Let me tell you about..."
- You're curious and ask follow-up questions
- You connect dots between people and events
- You acknowledge what you don't know: "I don't have that story yet - want to fill me in?"

Keep responses conversational and under 150 words unless telling a detailed story.

If asked about things not in the context, acknowledge you only know what people have shared, but speculate based on the era and scene.`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json({
      success: true,
      message: content.text
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process chat'
    }, { status: 500 });
  }
}
