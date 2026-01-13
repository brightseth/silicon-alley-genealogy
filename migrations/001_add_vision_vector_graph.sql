-- Migration: Add Vision Upload + Vector Search + Graph Database features
-- Run in Vercel Postgres SQL editor
-- Date: January 10, 2026

-- ============================================================================
-- WORK STREAM B: Vector/Semantic Search
-- ============================================================================

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to stories table (nullable for backward compatibility)
ALTER TABLE stories ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create story_embeddings tracking table
CREATE TABLE IF NOT EXISTS story_embeddings (
  story_id UUID PRIMARY KEY REFERENCES stories(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
  embedded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for fast vector similarity search
-- HNSW (Hierarchical Navigable Small World) is optimized for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_stories_embedding ON stories
USING hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- WORK STREAM A: Vision/Photo Upload
-- ============================================================================

-- Create attachments table for storing image/document uploads
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  blob_url TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  file_type TEXT, -- 'photo', 'document', 'business_card', 'flyer', 'other'
  analysis_result JSONB, -- Store Claude vision API output
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup of attachments by story
CREATE INDEX IF NOT EXISTS idx_attachments_story ON attachments(story_id);

-- ============================================================================
-- WORK STREAM C: Graph Database
-- ============================================================================

-- Create bidirectional index on connections for graph traversal
CREATE INDEX IF NOT EXISTS idx_connections_both ON connections(person_a_id, person_b_id);

-- Create materialized view for bidirectional connection graph
-- This allows us to query connections in both directions efficiently
CREATE MATERIALIZED VIEW IF NOT EXISTS connection_graph AS
SELECT
  person_a_id,
  person_b_id,
  relationship_type,
  company,
  description,
  year
FROM connections
UNION ALL
SELECT
  person_b_id AS person_a_id,
  person_a_id AS person_b_id,
  relationship_type,
  company,
  description,
  year
FROM connections;

-- Index on materialized view for fast graph traversal
CREATE INDEX IF NOT EXISTS idx_connection_graph_a ON connection_graph(person_a_id);
CREATE INDEX IF NOT EXISTS idx_connection_graph_b ON connection_graph(person_b_id);
CREATE INDEX IF NOT EXISTS idx_connection_graph_both ON connection_graph(person_a_id, person_b_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify pgvector extension is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check that embedding column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'stories' AND column_name = 'embedding';

-- Check that new tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('story_embeddings', 'attachments');

-- Check that materialized view was created
SELECT matviewname
FROM pg_matviews
WHERE matviewname = 'connection_graph';

-- Check indexes
SELECT indexname
FROM pg_indexes
WHERE tablename IN ('stories', 'attachments', 'connections', 'connection_graph')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
