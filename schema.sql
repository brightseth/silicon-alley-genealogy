-- Silicon Alley Genealogy - Vercel Postgres Schema
-- Run this in the Vercel Postgres SQL editor after creating the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- People table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  handle TEXT,
  email TEXT NOT NULL UNIQUE,
  role TEXT,
  era TEXT DEFAULT '1995-1996',
  bio TEXT,
  avatar_url TEXT,
  nft_token_id INTEGER UNIQUE,
  nft_minted BOOLEAN DEFAULT false,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  where_were_you TEXT NOT NULL,
  what_were_you_building TEXT NOT NULL,
  who_inspired_you TEXT NOT NULL,
  favorite_memory TEXT,
  lessons_learned TEXT,
  connections_mentioned TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'featured')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES people(id)
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_a_id UUID REFERENCES people(id) ON DELETE CASCADE,
  person_b_id UUID REFERENCES people(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  company TEXT,
  description TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_a_id, person_b_id, relationship_type)
);

-- Timeline events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('company', 'launch', 'funding', 'acquisition', 'moment', 'other')),
  location TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline event people junction table
CREATE TABLE IF NOT EXISTS timeline_event_people (
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, person_id)
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  founded_year INTEGER,
  outcome TEXT,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company founders junction table
CREATE TABLE IF NOT EXISTS company_founders (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  role TEXT,
  PRIMARY KEY (company_id, person_id)
);

-- NFT cards table
CREATE TABLE IF NOT EXISTS nft_cards (
  token_id SERIAL PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE UNIQUE,
  owner_address TEXT,
  metadata_uri TEXT,
  minted_at TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_people_handle ON people(handle);
CREATE INDEX IF NOT EXISTS idx_people_email ON people(email);
CREATE INDEX IF NOT EXISTS idx_stories_person ON stories(person_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_connections_person_a ON connections(person_a_id);
CREATE INDEX IF NOT EXISTS idx_connections_person_b ON connections(person_b_id);
CREATE INDEX IF NOT EXISTS idx_timeline_date ON timeline_events(date);
CREATE INDEX IF NOT EXISTS idx_nft_owner ON nft_cards(owner_address);

-- Insert seed data for initial pioneers
INSERT INTO people (name, handle, email, role, era, bio) VALUES
('John Borthwick', '@borthwick', 'john@example.com', 'Founder, Web Partner Studio & Betaworks', '1994-Present', 'Saw the browser at MIT in March 1994. Founded Web Partner Studio (Ottawa + Total New York), later Betaworks.'),
('Seth Goldstein', '@sethgoldstein', 'seth@example.com', 'Founder, SiteSpecific', '1995-Present', 'Started at Agency.com, worked for Michael Wolf, then Condé Net. Launched SiteSpecific in August 1995.'),
('Janice Fraser', '@clevergirl', 'janice@example.com', 'Co-founder, Web Partner Studio', '1994-Present', 'Brought design thinking and user experience to the early web. Co-founded Web Partner Studio with John Borthwick.')
ON CONFLICT (email) DO NOTHING;

-- Insert seed timeline events
INSERT INTO timeline_events (date, title, description, event_type, location) VALUES
('1994-03-01', 'The Browser Arrives', 'John Borthwick drives to MIT to see the Spyglass browser', 'moment', 'Cambridge, MA'),
('1994-08-01', 'Web Partner Studio Founded', 'Ottawa and Total New York merge into Web Partner Studio', 'company', 'New York, NY'),
('1995-01-01', 'The Scene Takes Shape', 'Lofts, cafes, and makeshift offices across NYC become the heart of web innovation', 'moment', 'New York, NY'),
('1995-08-01', 'SiteSpecific Launches', 'Seth Goldstein starts SiteSpecific after stints at Agency.com and Condé Net', 'company', 'New York, NY'),
('1996-01-01', 'Silicon Alley Boom', 'Money starts flowing, companies scaling, the movement gains momentum', 'moment', 'New York, NY')
ON CONFLICT DO NOTHING;

-- Create connection between John and Seth
INSERT INTO connections (person_a_id, person_b_id, relationship_type, company, year)
SELECT
  (SELECT id FROM people WHERE handle = '@borthwick'),
  (SELECT id FROM people WHERE handle = '@sethgoldstein'),
  'mentor',
  'Web Partner Studio',
  1995
ON CONFLICT DO NOTHING;
