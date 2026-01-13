-- Migration: 002_web3_fields.sql
-- Description: Add web3-related fields for NFTs and token rewards

-- Add confidence score and auto-approval to stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT false;

-- Add IPFS and blockchain fields to nft_cards
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS ipfs_metadata_hash TEXT;
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS ipfs_image_hash TEXT;
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS transaction_hash TEXT;
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS claim_token TEXT;
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP;
ALTER TABLE nft_cards ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create token rewards table
CREATE TABLE IF NOT EXISTS token_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  wallet_address TEXT,
  amount BIGINT NOT NULL,
  reason TEXT CHECK (reason IN ('submission', 'referral', 'mint', 'airdrop')),
  claimed BOOLEAN DEFAULT false,
  transaction_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_token_rewards_person ON token_rewards(person_id);
CREATE INDEX IF NOT EXISTS idx_token_rewards_wallet ON token_rewards(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nft_cards_claim_token ON nft_cards(claim_token);

-- Add email to people table if not exists
ALTER TABLE people ADD COLUMN IF NOT EXISTS email TEXT;
