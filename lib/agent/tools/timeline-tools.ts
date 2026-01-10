import { sql } from '@vercel/postgres';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from './memory-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Detect events with dates from story text
 */
export const detectEvents: Tool = {
  name: 'detect_events',
  description: 'Extract specific events with dates from Silicon Alley stories. Returns array of events with dates, titles, and descriptions.',
  input_schema: {
    type: 'object',
    properties: {
      story_text: {
        type: 'string',
        description: 'Story text to extract events from'
      }
    },
    required: ['story_text']
  },
  execute: async ({ story_text }: { story_text: string }) => {
    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extract all specific events with dates from this Silicon Alley story:

"${story_text}"

Return ONLY valid JSON array:
[
  {
    "date": "YYYY-MM-DD or YYYY-MM",
    "title": "Event name (e.g., 'Pseudo Launch Party')",
    "description": "What happened",
    "location": "NYC location if mentioned",
    "people": ["person1", "person2"]
  }
]

Focus on:
- Company launches
- Parties or gatherings
- Meetings or connections made
- Specific moments with dates

If no specific dates, use "1995" or "1996". Return [] if no events.`
      }]
    });

    const content = extraction.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { events: [] };

    const events = JSON.parse(jsonMatch[0]);
    return {
      count: events.length,
      events,
      summary: `Detected ${events.length} ${events.length === 1 ? 'event' : 'events'} with dates.`
    };
  }
};

/**
 * Generate narrative timeline from events
 */
export const generateTimeline: Tool = {
  name: 'generate_timeline',
  description: 'Create a narrative timeline from Silicon Alley events. Weaves multiple perspectives into a chronological story.',
  input_schema: {
    type: 'object',
    properties: {
      events: {
        type: 'array',
        description: 'Array of events to weave into timeline',
        items: {
          type: 'object'
        }
      },
      date_range: {
        type: 'string',
        description: 'Optional date range like "1995" or "March 1995"'
      }
    },
    required: ['events']
  },
  execute: async ({ events, date_range }: any) => {
    if (events.length === 0) {
      return {
        timeline: 'No events found for this time period.',
        event_count: 0
      };
    }

    // Sort events chronologically
    const sorted = events.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const prompt = `Create a narrative timeline from these Silicon Alley events:

${JSON.stringify(sorted, null, 2)}

${date_range ? `Focus on: ${date_range}` : ''}

Write a compelling narrative that:
- Tells the story chronologically
- Shows what was happening simultaneously
- Weaves multiple perspectives together
- Captures the energy of the moment
- Mentions specific people and places

Keep it vivid and specific. Use present tense for immediacy.

Format as markdown with dates as headers.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    return {
      timeline: content.text,
      event_count: events.length,
      date_range: date_range || 'all'
    };
  }
};

/**
 * Place event in cultural/historical context
 */
export const placeInContext: Tool = {
  name: 'place_in_context',
  description: 'Add cultural and historical context to a Silicon Alley event. What else was happening in tech, NYC, and the world?',
  input_schema: {
    type: 'object',
    properties: {
      event: {
        type: 'object',
        description: 'Event to contextualize with date and description'
      }
    },
    required: ['event']
  },
  execute: async ({ event }: { event: any }) => {
    const prompt = `Provide cultural context for this Silicon Alley event:

Date: ${event.date}
Event: ${event.title}
Description: ${event.description}

What else was happening around this time:
- In NYC tech scene?
- In the wider internet/web?
- In popular culture?
- In the world?

Keep it brief (3-4 sentences) and relevant to Silicon Alley.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    return {
      event: event,
      context: content.text.trim(),
      summary: `Added cultural context for ${event.title}`
    };
  }
};

export const timelineTools: Tool[] = [
  detectEvents,
  generateTimeline,
  placeInContext
];
