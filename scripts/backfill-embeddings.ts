/**
 * Backfill Embeddings Script
 * Generates embeddings for all existing approved stories
 * Run once after enabling pgvector extension
 */

import { sql } from '@vercel/postgres';
import { generateEmbedding, storyToEmbeddingText, estimateEmbeddingCost } from '../lib/embeddings/generate';

async function backfillEmbeddings() {
  console.log('🚀 Starting embedding backfill...\n');

  try {
    // Fetch all approved stories without embeddings
    const result = await sql`
      SELECT
        s.id,
        s.where_were_you,
        s.what_were_you_building,
        s.who_inspired_you,
        s.favorite_memory,
        s.lessons_learned,
        s.connections_mentioned,
        p.name as person_name
      FROM stories s
      JOIN people p ON s.person_id = p.id
      WHERE s.status = 'approved'
        AND (s.embedding IS NULL OR s.id NOT IN (SELECT story_id FROM story_embeddings))
      ORDER BY s.submitted_at ASC
    `;

    const stories = result.rows;

    if (stories.length === 0) {
      console.log('✅ No stories need embedding generation. All caught up!');
      return;
    }

    console.log(`📊 Found ${stories.length} stories needing embeddings\n`);

    // Estimate total cost
    let totalTokens = 0;
    for (const story of stories) {
      const text = storyToEmbeddingText(story);
      totalTokens += Math.ceil(text.length / 4); // Rough estimate
    }
    const estimatedCost = (totalTokens / 1_000_000) * 0.02; // $0.02 per 1M tokens
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)} (${totalTokens} tokens)\n`);

    // Process each story
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const progress = `[${i + 1}/${stories.length}]`;

      try {
        // Convert story to embedding text
        const embeddingText = storyToEmbeddingText(story);

        if (!embeddingText || embeddingText.trim().length === 0) {
          console.log(`${progress} ⚠️  Skipping story ${story.id} - empty text`);
          continue;
        }

        console.log(`${progress} 🔄 Generating embedding for ${story.person_name}'s story...`);

        // Generate embedding
        const embedding = await generateEmbedding(embeddingText);

        // Store embedding in database
        await sql`
          UPDATE stories
          SET embedding = ${JSON.stringify(embedding)}::vector
          WHERE id = ${story.id}
        `;

        // Track that we've embedded this story
        await sql`
          INSERT INTO story_embeddings (story_id, model)
          VALUES (${story.id}, 'text-embedding-3-small')
          ON CONFLICT (story_id) DO UPDATE
          SET embedded_at = NOW()
        `;

        console.log(`${progress} ✅ Embedded story ${story.id} (${story.person_name})`);
        successCount++;

        // Rate limiting: wait 100ms between requests to avoid hitting OpenAI limits
        if (i < stories.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`${progress} ❌ Error embedding story ${story.id}:`, error);
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 Backfill Complete!');
    console.log(`✅ Success: ${successCount} stories`);
    console.log(`❌ Errors: ${errorCount} stories`);
    console.log(`📊 Total processed: ${successCount + errorCount}/${stories.length}`);
    console.log('='.repeat(60));

    // Verify embeddings were created
    const verifyResult = await sql`
      SELECT COUNT(*) as count
      FROM stories
      WHERE embedding IS NOT NULL
    `;

    console.log(`\n🔍 Verification: ${verifyResult.rows[0].count} stories now have embeddings`);
  } catch (error) {
    console.error('💥 Fatal error during backfill:', error);
    process.exit(1);
  }
}

// Self-executing async function
(async () => {
  await backfillEmbeddings();
  process.exit(0);
})();
