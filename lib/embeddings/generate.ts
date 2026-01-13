/**
 * Embedding Generation Utilities
 * For semantic/vector search of Silicon Alley stories
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model configuration
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, $0.02/1M tokens
// Alternative: 'text-embedding-3-large' (3072 dims, better quality but slower)

/**
 * Generate embedding vector for a text string
 * @param text - Text to embed
 * @returns 1536-dimensional embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text');
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.trim(),
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error}`);
  }
}

/**
 * Convert a story object to text suitable for embedding
 * Combines all story fields into a single text representation
 * @param story - Story object with various fields
 * @returns Combined text for embedding
 */
export function storyToEmbeddingText(story: {
  where_were_you?: string;
  what_were_you_building?: string;
  who_inspired_you?: string;
  favorite_memory?: string;
  lessons_learned?: string;
  connections_mentioned?: string;
}): string {
  // Combine all fields with labeled sections for better semantic understanding
  const parts = [];

  if (story.where_were_you) {
    parts.push(`Location: ${story.where_were_you}`);
  }

  if (story.what_were_you_building) {
    parts.push(`Building: ${story.what_were_you_building}`);
  }

  if (story.who_inspired_you) {
    parts.push(`Inspired by: ${story.who_inspired_you}`);
  }

  if (story.favorite_memory) {
    parts.push(`Memory: ${story.favorite_memory}`);
  }

  if (story.lessons_learned) {
    parts.push(`Lessons: ${story.lessons_learned}`);
  }

  if (story.connections_mentioned) {
    parts.push(`Connections: ${story.connections_mentioned}`);
  }

  return parts.join('\n\n');
}

/**
 * Batch generate embeddings for multiple texts
 * More efficient than calling generateEmbedding repeatedly
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  // OpenAI allows up to 2048 inputs per request
  const BATCH_SIZE = 2048;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    try {
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch.map((t) => t.trim()),
      });

      results.push(...response.data.map((d) => d.embedding));
    } catch (error) {
      console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1, where 1 means identical
 * @param a - First vector
 * @param b - Second vector
 * @returns Cosine similarity score
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return similarity;
}

/**
 * Estimate token count for a text (approximate)
 * Used to estimate embedding costs before generating
 * @param text - Text to estimate
 * @returns Approximate token count
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

/**
 * Estimate cost of generating embedding for a text
 * @param text - Text to embed
 * @returns Estimated cost in USD
 */
export function estimateEmbeddingCost(text: string): number {
  const tokens = estimateTokenCount(text);
  const COST_PER_MILLION_TOKENS = 0.02; // text-embedding-3-small pricing
  return (tokens / 1_000_000) * COST_PER_MILLION_TOKENS;
}
