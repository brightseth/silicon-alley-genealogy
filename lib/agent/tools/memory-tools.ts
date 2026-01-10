import { sql } from '@vercel/postgres';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Tool {
  name: string;
  description: string;
  input_schema: any;
  execute: (input: any) => Promise<any>;
}

/**
 * Extract structured story data from raw text/transcription
 */
export const extractStoryData: Tool = {
  name: 'extract_story_data',
  description: 'Extract structured Silicon Alley story data from raw text or transcription. Returns JSON with person info, locations, companies, events, and connections.',
  input_schema: {
    type: 'object',
    properties: {
      raw_text: {
        type: 'string',
        description: 'The raw story text or transcription to extract data from'
      }
    },
    required: ['raw_text']
  },
  execute: async ({ raw_text }: { raw_text: string }) => {
    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Extract Silicon Alley story data from this text:

"${raw_text}"

Return ONLY valid JSON with these exact keys:
{
  "name": "person's full name",
  "email": "email if mentioned",
  "handle": "social handle if mentioned",
  "whereWereYou": "specific location in 1995",
  "whatWereYouBuilding": "company or project",
  "whoInspiredYou": "people who inspired them",
  "favoriteMemory": "specific memorable moment",
  "lessonsLearned": "insights or reflections",
  "connections": "comma-separated list of people mentioned",
  "events": [{"date": "YYYY-MM", "title": "event name", "description": "details"}],
  "companies": ["company1", "company2"],
  "locations": ["location1", "location2"]
}

If something isn't mentioned, use empty string "" or empty array [].`
      }]
    });

    const content = extraction.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not extract JSON');

    return JSON.parse(jsonMatch[0]);
  }
};

/**
 * Store a memory (story) in the database
 */
export const storeMemory: Tool = {
  name: 'store_memory',
  description: 'Store a Silicon Alley story in the database. Creates person record if needed and saves their story as approved.',
  input_schema: {
    type: 'object',
    properties: {
      story_data: {
        type: 'object',
        description: 'Structured story data with name, email, whereWereYou, whatWereYouBuilding, etc.'
      }
    },
    required: ['story_data']
  },
  execute: async ({ story_data }: { story_data: any }) => {
    if (!story_data.email) {
      throw new Error('Email required to store memory');
    }

    // Find or create person
    let personId;
    const existing = await sql`
      SELECT id FROM people WHERE email = ${story_data.email}
    `;

    if (existing.rows.length > 0) {
      personId = existing.rows[0].id;
      await sql`
        UPDATE people
        SET name = ${story_data.name}, updated_at = NOW()
        WHERE id = ${personId}
      `;
    } else {
      const newPerson = await sql`
        INSERT INTO people (name, handle, email, era)
        VALUES (${story_data.name}, ${story_data.handle || null}, ${story_data.email}, '1995-1996')
        RETURNING id
      `;
      personId = newPerson.rows[0].id;
    }

    // Store story as approved
    const story = await sql`
      INSERT INTO stories (
        person_id,
        where_were_you,
        what_were_you_building,
        who_inspired_you,
        favorite_memory,
        lessons_learned,
        connections_mentioned,
        status
      )
      VALUES (
        ${personId},
        ${story_data.whereWereYou || ''},
        ${story_data.whatWereYouBuilding || ''},
        ${story_data.whoInspiredYou || ''},
        ${story_data.favoriteMemory || ''},
        ${story_data.lessonsLearned || ''},
        ${story_data.connections || ''},
        'approved'
      )
      RETURNING id
    `;

    return {
      success: true,
      person_id: personId,
      story_id: story.rows[0].id,
      message: `Stored memory for ${story_data.name}. The archive now remembers their story.`
    };
  }
};

/**
 * Recall memories from the database
 */
export const recallMemories: Tool = {
  name: 'recall_memories',
  description: 'Search and retrieve Silicon Alley stories from the database. Can filter by person name, company, keyword, or get all stories. Returns array of stories with person details.',
  input_schema: {
    type: 'object',
    properties: {
      person_name: {
        type: 'string',
        description: 'Filter by person name (optional)'
      },
      company: {
        type: 'string',
        description: 'Filter by company name mentioned in stories (optional)'
      },
      keyword: {
        type: 'string',
        description: 'Search keyword in any story field (optional)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of stories to return (default 10)'
      }
    }
  },
  execute: async ({ person_name, company, keyword, limit = 10 }: any) => {
    let result;

    if (person_name) {
      result = await sql`
        SELECT
          p.name,
          p.handle,
          p.role,
          p.bio,
          s.where_were_you,
          s.what_were_you_building,
          s.who_inspired_you,
          s.favorite_memory,
          s.lessons_learned,
          s.connections_mentioned,
          s.submitted_at
        FROM stories s
        JOIN people p ON s.person_id = p.id
        WHERE p.name ILIKE ${'%' + person_name + '%'}
        AND s.status = 'approved'
        ORDER BY s.submitted_at DESC
        LIMIT ${limit}
      `;
    } else if (company) {
      result = await sql`
        SELECT
          p.name,
          p.handle,
          s.where_were_you,
          s.what_were_you_building,
          s.who_inspired_you,
          s.favorite_memory,
          s.lessons_learned,
          s.connections_mentioned,
          s.submitted_at
        FROM stories s
        JOIN people p ON s.person_id = p.id
        WHERE (
          s.what_were_you_building ILIKE ${'%' + company + '%'}
          OR s.where_were_you ILIKE ${'%' + company + '%'}
          OR s.connections_mentioned ILIKE ${'%' + company + '%'}
        )
        AND s.status = 'approved'
        ORDER BY s.submitted_at DESC
        LIMIT ${limit}
      `;
    } else if (keyword) {
      result = await sql`
        SELECT
          p.name,
          p.handle,
          s.where_were_you,
          s.what_were_you_building,
          s.who_inspired_you,
          s.favorite_memory,
          s.lessons_learned,
          s.connections_mentioned,
          s.submitted_at
        FROM stories s
        JOIN people p ON s.person_id = p.id
        WHERE (
          s.where_were_you ILIKE ${'%' + keyword + '%'}
          OR s.what_were_you_building ILIKE ${'%' + keyword + '%'}
          OR s.who_inspired_you ILIKE ${'%' + keyword + '%'}
          OR s.favorite_memory ILIKE ${'%' + keyword + '%'}
          OR s.lessons_learned ILIKE ${'%' + keyword + '%'}
        )
        AND s.status = 'approved'
        ORDER BY s.submitted_at DESC
        LIMIT ${limit}
      `;
    } else {
      // Return all stories
      result = await sql`
        SELECT
          p.name,
          p.handle,
          s.where_were_you,
          s.what_were_you_building,
          s.who_inspired_you,
          s.favorite_memory,
          s.lessons_learned,
          s.connections_mentioned,
          s.submitted_at
        FROM stories s
        JOIN people p ON s.person_id = p.id
        WHERE s.status = 'approved'
        ORDER BY s.submitted_at DESC
        LIMIT ${limit}
      `;
    }

    return {
      count: result.rows.length,
      stories: result.rows,
      summary: `Found ${result.rows.length} ${result.rows.length === 1 ? 'story' : 'stories'} in the archive.`
    };
  }
};

/**
 * Ask intelligent follow-up question based on current story
 */
export const askFollowup: Tool = {
  name: 'ask_followup',
  description: 'Generate an intelligent follow-up question to deepen a Silicon Alley story. Ask about specific moments, emotions, connections, or cultural details.',
  input_schema: {
    type: 'object',
    properties: {
      current_story: {
        type: 'string',
        description: 'The story told so far'
      },
      conversation_history: {
        type: 'array',
        description: 'Previous questions and answers',
        items: {
          type: 'object'
        }
      },
      question_number: {
        type: 'number',
        description: 'Which follow-up question this is (1-5)'
      }
    },
    required: ['current_story', 'question_number']
  },
  execute: async ({ current_story, conversation_history = [], question_number }: any) => {
    const historyText = conversation_history.length > 0
      ? `\nPrevious conversation:\n${conversation_history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `You are interviewing someone about Silicon Alley in 1995-1996.

Current story: "${current_story}"
${historyText}

This is follow-up question #${question_number} of 5.

Ask a specific, engaging question that will:
- Uncover more specific details
- Explore emotions and feelings ("How did that make you feel?")
- Discover connections to other people
- Reveal moments that shaped them

Keep it conversational and under 30 words. Be curious and empathetic.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    return {
      question: content.text.trim(),
      question_number
    };
  }
};

export const memoryTools: Tool[] = [
  extractStoryData,
  storeMemory,
  recallMemories,
  askFollowup
];
