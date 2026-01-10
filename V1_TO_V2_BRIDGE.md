# V1 → V2 Bridge: The Path to an AI-Native Archive

**Where we are**: Static genealogy with forms, cards, and timelines
**Where we're going**: Living archive with an omniscient narrator agent
**How we get there**: Incremental features that each make V1 more alive

---

## V1.5: Quick Wins (Next 2 Weeks)

### 1. Voice Recorder on Submit Page
**Effort**: 1 day
**Impact**: Huge - proves voice is easier than typing

```typescript
// Add to submit page:
<button onClick={startRecording}>
  🎤 Tell Your Story (Voice)
</button>

// Send audio to Claude
const response = await anthropic.messages.create({
  model: "claude-sonnet-4",
  messages: [{
    role: "user",
    content: [
      {
        type: "audio",
        source: { type: "base64", data: audioData }
      },
      {
        type: "text",
        text: `
          Transcribe this Silicon Alley oral history.
          Extract:
          - Name
          - Where they were in 1995
          - What they were building
          - Who they worked with
          - Memorable moments
          - Connections to others

          Return structured JSON.
        `
      }
    ]
  }]
});

// Pre-fill form with extracted data
// User reviews and submits
```

**Why this matters**:
- Proves the voice concept
- Gets richer stories immediately
- Sets up infrastructure for full agent

### 2. "Ask About This Person" Button
**Effort**: 2 days
**Impact**: First step toward Oracle mode

On each person page, add:
```typescript
<button onClick={() => setShowChat(true)}>
  💬 Ask Me About {person.name}
</button>

// Simple Claude chat scoped to this person
const chat = await anthropic.messages.create({
  system: `You are the Silicon Alley memory keeper.
           Answer questions about ${person.name} based on
           this context: ${person.bio} ${person.stories}`,
  messages: chatHistory
});
```

**Example queries**:
- "What was John working on when he met Seth?"
- "Who else worked at Web Partner Studio?"
- "What was the culture like?"

**Why this matters**:
- First conversational interface
- Proves people want to ask questions
- Scoped domain makes it easy to build

### 3. Auto-Extract Connections from Stories
**Effort**: 1 day
**Impact**: Builds the graph automatically

When a story is submitted:
```typescript
const analysis = await claude.analyze(story.content);

// Extract mentioned people, companies, events
{
  peopleM: ["John Borthwick", "Janice Fraser"],
  companies: ["Web Partner Studio", "Razorfish"],
  technologies: ["HTML", "Photoshop"],
  events: ["Pseudo launch party"]
}

// Create pending connections in DB
// Admin can approve/reject
```

**Why this matters**:
- Graph builds itself from stories
- Connections we'd never manually catch
- Sets up infrastructure for full agent navigation

---

## V1.75: Agent Prototype (Month 2)

### 4. Basic Interview Agent
**Effort**: 1 week
**Impact**: The heart of V2

```typescript
const interviewAgent = new Agent({
  name: "Silicon Alley Interviewer",

  async conductInterview() {
    await this.ask("What's your name?");
    const name = await this.listen();

    await this.ask(`Hey ${name}! Where were you in January 1995?`);
    const location = await this.listen();

    // Agent continues based on answers
    // Asks follow-ups
    // Extracts structured data

    return structuredStory;
  }
});
```

**Why this matters**:
- Proves conversational collection works
- Gets 10x richer stories
- Can be deployed alongside form

### 5. Photo Upload + Vision Analysis
**Effort**: 3 days
**Impact**: Visual memories

```typescript
// User uploads photo
const analysis = await claude.vision(photo, `
  Analyze this photo from Silicon Alley in the 1990s.
  Describe what you see. Extract any text.
`);

// Agent asks follow-ups
"I see 4 people around a monitor. Who are they?"
"The whiteboard says 'Launch: March 15' - what was launching?"
```

**Why this matters**:
- Photos trigger memories
- Vision makes archive richer
- Sets up multimedia agent

### 6. Simple Explore Mode
**Effort**: 1 week
**Impact**: First full agent interaction

Chat interface on homepage:
```typescript
User: "Tell me about Razorfish"

Agent: [Searches memories for Razorfish mentions]
       "Razorfish was founded by Jeff and Craig in 1995.
        I have stories from 5 people who worked there.
        Want to hear from the first designer, or the tech lead?"

User: "First designer"

Agent: [Pulls Jane's story, reads it, highlights key moments]
       "Here's what Jane remembers... This reminds me of
        how John ran Web Partner Studio. Want to see the connection?"
```

**Why this matters**:
- Makes archive explorable by conversation
- Proves people prefer asking to browsing
- Shows agent's value

---

## V2: Full Agent (Months 3-6)

### The Complete System

**Voice-First Everything**:
- Submit stories by talking
- Explore by asking questions
- Agent narrates timelines
- Voice responses (text-to-speech)

**Multi-Modal**:
- Voice transcription
- Photo analysis
- Document OCR
- LinkedIn ingestion

**Full Memory Graph**:
- Vector search across all memories
- Graph traversal for connections
- Temporal queries
- Pattern detection

**Agent Modes**:
- Collector (interviews people)
- Oracle (answers questions)
- Tour Guide (curated narratives)
- Connector (finds relationships)
- Archivist (organizes, tags)

---

## Technical Migration Path

### Database Evolution

**V1**: Postgres with simple tables
```sql
people, stories, connections, timeline_events
```

**V1.5**: Add vector search
```sql
ALTER TABLE stories ADD COLUMN embedding vector(1024);
CREATE INDEX ON stories USING ivfflat (embedding);

-- When story is submitted:
UPDATE stories
SET embedding = get_embedding(content)
WHERE id = new_story_id;
```

**V1.75**: Add graph relationships
```sql
-- Install pg_graph or use separate Neo4j
CREATE TABLE relationships (
  person_a_id UUID,
  person_b_id UUID,
  type TEXT,
  context JSONB,
  weight FLOAT
);
```

**V2**: Full hybrid
- Postgres for structured data
- pgvector for semantic search
- Neo4j (or pg_graph) for relationships
- Redis for conversation state

### Code Architecture

**V1**: Next.js with API routes
```
app/
  page.tsx
  people/page.tsx
  api/
    submit/route.ts
```

**V1.5**: Add agent utilities
```
lib/
  agent/
    transcribe.ts
    extract.ts
    embed.ts
```

**V1.75**: Agent infrastructure
```
lib/
  agent/
    interviewer.ts
    oracle.ts
    memory.ts
```

**V2**: Full Agent SDK
```
agents/
  interviewer/
    agent.ts
    tools/
      transcribe.ts
      extract.ts
      search.ts
  oracle/
    agent.ts
    tools/
      query.ts
      narrate.ts
```

---

## What to Build First (Priority Order)

### Week 1: Voice Recorder
- Proves concept
- Low effort, high impact
- Immediately useful

### Week 2: Auto-Extract Connections
- Builds graph automatically
- Makes stories richer
- Sets up for agent

### Week 3: Ask About Person
- First conversational interface
- Scoped domain (easy to build)
- Proves people want it

### Week 4: Photo Upload
- Visual dimension
- Triggers more memories
- Sets up multi-modal agent

### Month 2: Interview Agent
- The game-changer
- Conversational collection
- 10x richer stories

### Month 3+: Full Oracle
- Explore by conversation
- Guided tours
- Pattern discovery

---

## Decision Points

### Agent SDK vs. Custom
**Use Agent SDK if**:
- Want full reasoning/planning
- Need complex multi-turn conversations
- Building for scale

**Build custom if**:
- Simple structured extraction
- Just transcription + Claude call
- Prototyping fast

**Recommendation**: Start custom (V1.5), migrate to SDK (V2)

### Hosting Voice
**Options**:
- Client-side recording → send to backend
- Stream to WebSocket → real-time transcription
- Save to Vercel Blob → batch process

**Recommendation**: Start with client recording + batch (simpler), move to streaming later

### Vector DB
**Options**:
- pgvector (same DB, simpler)
- Pinecone (managed, scales)
- Weaviate (open source, self-host)

**Recommendation**: pgvector for V1.5 (already have Postgres), consider Pinecone if we scale past 100k memories

---

## The Roadmap

```
Jan 2026:  V1 launches at event ✓
           Foundation solid
           Data collection begins

Feb 2026:  V1.5 - Voice + basic agent features
           Prove voice is better
           Auto-extract connections
           Simple chat

Mar 2026:  V1.75 - Interview agent
           Full conversational collection
           Photo uploads

Apr 2026:  Early V2 - Oracle mode
           Explore by conversation
           Guided tours

May 2026:  V2 Beta - Multi-modal agent
           Voice everywhere
           LinkedIn ingestion
           Pattern discovery

Jun 2026:  V2 Launch
           Living archive complete
           Agent is the narrator

---

## How to Know It's Working

### V1 Metrics (Current)
- ✓ Stories submitted
- ✓ People in database
- ✓ Connections mapped

### V1.5 Metrics (Voice + Auto-Extract)
- % of stories submitted via voice vs. text
- Average story length (voice should be 3x longer)
- Auto-extracted connections per story
- Connection approval rate

### V1.75 Metrics (Interview Agent)
- Stories submitted via agent vs. form
- Average interview length
- User satisfaction with agent
- Richness score (entities extracted, themes identified)

### V2 Metrics (Full Agent)
- Questions asked to agent
- Exploration depth (pages visited per session)
- Agent-facilitated connections
- Time spent exploring vs. submitting
- "Holy shit" moments (discoveries users report)

**The North Star**:
> "People prefer talking to the agent over filling out forms"

When that's true, we've succeeded.

---

## Quick Start: Build V1.5 This Weekend

**Saturday Morning**: Add voice button to submit page
```bash
npm install @anthropic-ai/sdk
```

**Saturday Afternoon**: Wire up Claude transcription
```typescript
// See V2_AGENT_ARCHITECTURE.md for code
```

**Sunday Morning**: Test with 3 people
- Record story
- Show transcription
- Pre-fill form
- Submit

**Sunday Afternoon**: Deploy
```bash
git commit -m "Add voice recording to submit page"
vercel --prod
```

**Sunday Evening**: Blog post
"We added voice to our oral history site. 3x longer stories. Here's how."

**Monday**: V1.5 is live.

---

## The Ultimate Goal

**V1**: A website about Silicon Alley
**V2**: An AI that *remembers* Silicon Alley

The difference:
- V1: You read about John Borthwick
- V2: You ask "What was John working on when he met Seth?" and the agent tells you the story

**That's the future we're building.**

Let's start with voice this weekend.
