# Silicon Alley Genealogy - Database Schema

## Overview
This document defines the database schema for the Silicon Alley 30th Anniversary Genealogy project.

## Tables

### people
Stores information about Silicon Alley pioneers.

```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT, -- Twitter/GitHub handle
  email TEXT NOT NULL UNIQUE,
  role TEXT, -- e.g., "Founder of SiteSpecific"
  era TEXT DEFAULT '1995-1996',
  bio TEXT,
  avatar_url TEXT,
  nft_token_id INTEGER UNIQUE,
  nft_minted BOOLEAN DEFAULT false,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_people_handle ON people(handle);
CREATE INDEX idx_people_email ON people(email);
CREATE INDEX idx_people_nft_token ON people(nft_token_id);
```

### stories
Stores oral history submissions from pioneers.

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  where_were_you TEXT NOT NULL,
  what_were_you_building TEXT NOT NULL,
  who_inspired_you TEXT NOT NULL,
  favorite_memory TEXT,
  lessons_learned TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'featured')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES people(id)
);

CREATE INDEX idx_stories_person ON stories(person_id);
CREATE INDEX idx_stories_status ON stories(status);
```

### connections
Represents relationships between people.

```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_a_id UUID REFERENCES people(id) ON DELETE CASCADE,
  person_b_id UUID REFERENCES people(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- e.g., "co-founder", "mentor", "colleague"
  company TEXT,
  description TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_a_id, person_b_id, relationship_type)
);

CREATE INDEX idx_connections_person_a ON connections(person_a_id);
CREATE INDEX idx_connections_person_b ON connections(person_b_id);
```

### timeline_events
Key moments in Silicon Alley history.

```sql
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('company', 'launch', 'funding', 'acquisition', 'moment', 'other')),
  location TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_date ON timeline_events(date);
CREATE INDEX idx_timeline_type ON timeline_events(event_type);
```

### timeline_event_people
Many-to-many relationship between events and people.

```sql
CREATE TABLE timeline_event_people (
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, person_id)
);
```

### companies
Companies founded during Silicon Alley era.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  founded_year INTEGER,
  outcome TEXT, -- e.g., "Acquired by AOL", "IPO"
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON companies(name);
```

### company_founders
Many-to-many relationship between companies and founders.

```sql
CREATE TABLE company_founders (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  role TEXT, -- e.g., "Co-Founder", "CEO"
  PRIMARY KEY (company_id, person_id)
);
```

### nft_cards
Tracks NFT minting status for player cards.

```sql
CREATE TABLE nft_cards (
  token_id SERIAL PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE UNIQUE,
  owner_address TEXT,
  metadata_uri TEXT,
  minted_at TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT false
);

CREATE INDEX idx_nft_owner ON nft_cards(owner_address);
```

## Row Level Security (RLS) Policies

### Public read access for approved content
```sql
-- People are publicly readable
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "People are viewable by everyone"
  ON people FOR SELECT
  USING (true);

-- Only approved stories are publicly readable
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved stories are viewable by everyone"
  ON stories FOR SELECT
  USING (status IN ('approved', 'featured'));

-- Connections are publicly readable
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Connections are viewable by everyone"
  ON connections FOR SELECT
  USING (true);

-- Timeline events are publicly readable
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Timeline events are viewable by everyone"
  ON timeline_events FOR SELECT
  USING (true);

-- Companies are publicly readable
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);
```

## Sample Data

### Seed the database with initial pioneers
```sql
-- John Borthwick
INSERT INTO people (name, handle, email, role, era, bio) VALUES
('John Borthwick', '@borthwick', 'john@betaworks.com', 'Founder, Web Partner Studio & Betaworks', '1994-Present', 'Saw the browser at MIT in March 1994 and founded Web Partner Studio, later Betaworks.');

-- Seth Goldstein
INSERT INTO people (name, handle, email, role, era, bio) VALUES
('Seth Goldstein', '@sethgoldstein', 'seth@example.com', 'Founder, SiteSpecific', '1995-Present', 'Started SiteSpecific in August 1995 after stints at Agency.com and Condé Net.');

-- Add sample connection
INSERT INTO connections (person_a_id, person_b_id, relationship_type, company, year) VALUES
((SELECT id FROM people WHERE handle = '@borthwick'),
 (SELECT id FROM people WHERE handle = '@sethgoldstein'),
 'mentor',
 'Web Partner Studio',
 1995);
```

## API Endpoints

### Public Endpoints
- `GET /api/people` - List all people
- `GET /api/people/[id]` - Get person details
- `GET /api/stories` - List approved stories
- `GET /api/timeline` - Get timeline events
- `POST /api/submit` - Submit a new story

### Admin Endpoints (authenticated)
- `POST /api/admin/approve-story` - Approve a pending story
- `POST /api/admin/create-connection` - Create a connection
- `POST /api/admin/mint-nft` - Mint an NFT card

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BASE_RPC_URL=
NFT_CONTRACT_ADDRESS=
PRIVATE_KEY= (for NFT minting)
```
