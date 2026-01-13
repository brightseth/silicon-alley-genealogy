import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ExtractedData {
  name?: string;
  handle?: string;
  email?: string;
  whereWereYou?: string;
  whatWereYouBuilding?: string;
  whoInspiredYou?: string;
  favoriteMemory?: string;
  lessonsLearned?: string;
  connections?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory, currentExtraction } = await request.json();

    // Build the full transcript
    const fullTranscript = conversationHistory
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content)
      .join('\n\n');

    // First, extract any new data from the conversation
    const extractionPrompt = `You are extracting Silicon Alley story data from an interview conversation.

Interview transcript (user responses only):
"${fullTranscript}"

Current extracted data:
${JSON.stringify(currentExtraction || {}, null, 2)}

Extract any NEW information not already captured. Return ONLY valid JSON with these keys (use null for fields not mentioned):
{
  "name": "full name if mentioned",
  "handle": "social handle if mentioned",
  "email": "email if mentioned",
  "whereWereYou": "location/office/neighborhood in 1995",
  "whatWereYouBuilding": "company/project/work",
  "whoInspiredYou": "people/companies/influences",
  "favoriteMemory": "specific memorable moment",
  "lessonsLearned": "insights/reflections",
  "connections": "names of other people mentioned"
}

Only include fields that have NEW info from the latest responses.`;

    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: extractionPrompt
      }]
    });

    let extractedData: ExtractedData = {};
    const extractContent = extraction.content[0];
    if (extractContent.type === 'text') {
      const jsonMatch = extractContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Only keep non-null values
        Object.keys(parsed).forEach(key => {
          if (parsed[key] && parsed[key] !== 'null') {
            extractedData[key as keyof ExtractedData] = parsed[key];
          }
        });
      }
    }

    // Merge with current extraction
    const mergedData = { ...currentExtraction, ...extractedData };

    // Count how many core fields we have
    const coreFields = ['whereWereYou', 'whatWereYouBuilding', 'whoInspiredYou'];
    const filledCoreFields = coreFields.filter(f => mergedData[f as keyof ExtractedData]);
    const userMessageCount = conversationHistory.filter((m: any) => m.role === 'user').length;

    // Decide if we should complete or ask follow-up
    const isComplete = filledCoreFields.length >= 3 || userMessageCount >= 5;

    if (isComplete) {
      // Generate a closing summary
      const closingPrompt = `You are the Silicon Alley memory keeper. The interview is complete.

Here's what you captured:
${JSON.stringify(mergedData, null, 2)}

Write a warm, brief closing (2-3 sentences) thanking them and summarizing what you learned. Mention you'll add them to the archive.`;

      const closing = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: closingPrompt
        }]
      });

      const closeContent = closing.content[0];
      const closingText = closeContent.type === 'text' ? closeContent.text : "Thanks for sharing your story!";

      return NextResponse.json({
        success: true,
        isComplete: true,
        response: closingText,
        extractedData: mergedData
      });
    }

    // Generate a conversational follow-up question
    const followUpPrompt = `You are the Silicon Alley memory keeper, conducting a warm conversational interview about NYC's 1990s tech scene.

Conversation so far:
${conversationHistory.map((m: any) => `${m.role === 'user' ? 'Pioneer' : 'You'}: ${m.content}`).join('\n\n')}

Data captured so far:
${JSON.stringify(mergedData, null, 2)}

What to ask about next (in priority order):
${!mergedData.whereWereYou ? '- Where they were in 1995 (office, neighborhood, vibe)' : ''}
${!mergedData.whatWereYouBuilding ? '- What they were building (company, project, mission)' : ''}
${!mergedData.whoInspiredYou ? '- Who inspired them (people, companies, mentors)' : ''}
${!mergedData.favoriteMemory ? '- A specific memorable moment' : ''}
${!mergedData.connections ? '- Other people they worked with' : ''}

Write your next question or response. Be conversational, curious, and warm. Reference what they just told you. Keep it natural - like a conversation at a reunion, not a formal interview. One question or comment at a time, under 40 words.`;

    const followUp = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: followUpPrompt
      }]
    });

    const followContent = followUp.content[0];
    const followUpText = followContent.type === 'text' ? followContent.text.trim() : "Tell me more about that time.";

    return NextResponse.json({
      success: true,
      isComplete: false,
      response: followUpText,
      extractedData: mergedData
    });

  } catch (error: any) {
    console.error('Interview error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
