import { sql } from '@vercel/postgres';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from './memory-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Map connections from story text
 */
export const mapConnections: Tool = {
  name: 'map_connections',
  description: 'Extract and map social connections from Silicon Alley stories. Returns graph of people and their relationships.',
  input_schema: {
    type: 'object',
    properties: {
      story_text: {
        type: 'string',
        description: 'Story text to extract connections from'
      },
      person_name: {
        type: 'string',
        description: 'The person telling the story'
      }
    },
    required: ['story_text', 'person_name']
  },
  execute: async ({ story_text, person_name }: any) => {
    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extract all connections and relationships from this story by ${person_name}:

"${story_text}"

Return ONLY valid JSON:
{
  "connections": [
    {
      "person": "Full name",
      "relationship": "colleague|mentor|co-founder|friend|client|investor",
      "company": "Company name if mentioned",
      "context": "Brief description of how they knew each other"
    }
  ]
}

Focus on specific people mentioned by name and their relationship to ${person_name}.`
      }]
    });

    const content = extraction.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { connections: [] };

    const data = JSON.parse(jsonMatch[0]);
    return {
      source_person: person_name,
      connection_count: data.connections.length,
      connections: data.connections,
      summary: `Mapped ${data.connections.length} connections for ${person_name}`
    };
  }
};

/**
 * Find shared history between people
 */
export const findSharedHistory: Tool = {
  name: 'find_shared_history',
  description: 'Find overlapping events, companies, and stories between two people in the Silicon Alley archive.',
  input_schema: {
    type: 'object',
    properties: {
      person_a: {
        type: 'string',
        description: 'First person\'s name'
      },
      person_b: {
        type: 'string',
        description: 'Second person\'s name'
      }
    },
    required: ['person_a', 'person_b']
  },
  execute: async ({ person_a, person_b }: any) => {
    // Get stories for both people
    const storiesA = await sql`
      SELECT
        s.where_were_you,
        s.what_were_you_building,
        s.who_inspired_you,
        s.favorite_memory,
        s.connections_mentioned
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE p.name ILIKE '%' || ${person_a} || '%'
      AND s.status = 'approved'
    `;

    const storiesB = await sql`
      SELECT
        s.where_were_you,
        s.what_were_you_building,
        s.who_inspired_you,
        s.favorite_memory,
        s.connections_mentioned
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE p.name ILIKE '%' || ${person_b} || '%'
      AND s.status = 'approved'
    `;

    if (storiesA.rows.length === 0 || storiesB.rows.length === 0) {
      return {
        shared_history: 'Not enough stories to find shared history.',
        person_a,
        person_b
      };
    }

    // Use Claude to find overlaps
    const prompt = `Find shared history between ${person_a} and ${person_b}:

${person_a}'s stories:
${JSON.stringify(storiesA.rows, null, 2)}

${person_b}'s stories:
${JSON.stringify(storiesB.rows, null, 2)}

Find:
- Same companies mentioned
- Same people/connections mentioned
- Same events or time periods
- Same locations

Return a brief summary of their shared history (2-3 sentences).`;

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
      person_a,
      person_b,
      shared_history: content.text.trim(),
      stories_a: storiesA.rows.length,
      stories_b: storiesB.rows.length
    };
  }
};

/**
 * Suggest connections based on shared context
 */
export const suggestConnections: Tool = {
  name: 'suggest_connections',
  description: 'Suggest people to connect with based on shared companies, events, or interests. Great for networking and introductions.',
  input_schema: {
    type: 'object',
    properties: {
      person_name: {
        type: 'string',
        description: 'Person to suggest connections for'
      },
      context: {
        type: 'string',
        description: 'Optional context like company name or event'
      }
    },
    required: ['person_name']
  },
  execute: async ({ person_name, context }: any) => {
    // Get person's story
    const personStory = await sql`
      SELECT
        s.where_were_you,
        s.what_were_you_building,
        s.connections_mentioned
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE p.name ILIKE ${'%' + person_name + '%'}
      AND s.status = 'approved'
      LIMIT 1
    `;

    if (personStory.rows.length === 0) {
      return {
        suggestions: [],
        message: `No story found for ${person_name} yet.`
      };
    }

    const story = personStory.rows[0];

    // Find others with similar context
    const similarStories = await sql`
      SELECT DISTINCT
        p.name,
        p.handle,
        s.what_were_you_building,
        s.where_were_you
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE (
        s.what_were_you_building ILIKE '%' || ${story.what_were_you_building || context || ''} || '%'
        OR s.where_were_you ILIKE '%' || ${story.where_were_you || context || ''} || '%'
      )
      AND p.name NOT ILIKE '%' || ${person_name} || '%'
      AND s.status = 'approved'
      LIMIT 10
    `;

    const suggestions = similarStories.rows.map(row => ({
      name: row.name,
      handle: row.handle,
      context: row.what_were_you_building || row.where_were_you,
      reason: `Both worked in ${context || 'Silicon Alley'}`
    }));

    return {
      person: person_name,
      suggestion_count: suggestions.length,
      suggestions,
      message: `Found ${suggestions.length} people with shared context`
    };
  }
};

export const connectionTools: Tool[] = [
  mapConnections,
  findSharedHistory,
  suggestConnections
];
