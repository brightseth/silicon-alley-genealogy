# Silicon Alley Agent - Technical Architecture
## Building the Omniscient Narrator

**Core Insight**: This isn't a chatbot on top of a database. This is an *agent with memory* that understands narrative, time, and human connection.

---

## The Agent's Cognitive Model

### What the Agent "Knows"

The Stage Manager in "Our Town" doesn't just know *facts* - they understand:
- Character motivations
- Relationships and their evolution
- Significance of small moments
- Patterns across time
- What to emphasize in the telling

**The Silicon Alley Agent needs the same depth.**

### Knowledge Layers

```
Layer 1: FACTS (structured data)
├─ People (names, roles, dates)
├─ Companies (founding, funding, exits)
├─ Events (launches, parties, meetings)
└─ Artifacts (photos, docs, links)

Layer 2: STORIES (unstructured narrative)
├─ Oral histories
├─ Anecdotes
├─ Memories (subjective, emotional)
└─ Interpretations

Layer 3: CONNECTIONS (graph relationships)
├─ Worked together
├─ Mentored
├─ Founded
├─ Inspired
├─ Competed with
└─ Dated (yes, this matters for the story)

Layer 4: CONTEXT (temporal + cultural)
├─ What else was happening (tech, culture, world)
├─ What was possible/impossible then
├─ Slang, references, inside jokes
└─ Mood of different eras

Layer 5: NARRATIVE (the agent's synthesis)
├─ Themes (collaboration, competition, innovation)
├─ Arcs (how things evolved)
├─ Turning points (moments that mattered)
└─ Contradictions (different memories of same event)
```

**The agent operates across all 5 layers simultaneously.**

---

## Voice Collection Architecture

### The Conversational Interview Flow

```typescript
// Not a form. An interview.

class SiliconAlleyInterviewer extends Agent {
  async conductInterview(user: User): Promise<Story> {
    // Phase 1: Introduction & Context
    await this.ask("Hey! What's your name?");
    await this.ask("Where were you in January 1995?");

    // Phase 2: The Scene
    await this.ask("Paint me a picture. What did your office look like?");
    await this.ask("Who else was there?");

    // Phase 3: The Work
    await this.ask("What were you building?");
    await this.followUp("Why that? What problem were you solving?");

    // Phase 4: The People
    await this.ask("Who were you working with?");
    await this.detectNames(); // Extract people mentioned
    await this.ask("Tell me about [person]. How'd you meet?");

    // Phase 5: The Moments
    await this.ask("What's a moment you'll never forget?");
    await this.followUp("What made that special?");

    // Phase 6: The Lessons
    await this.ask("Looking back 30 years, what stands out?");

    // Phase 7: The Connections
    await this.ask("Who else should I talk to?");
    await this.ask("What should I ask them about?");

    // Synthesis
    return await this.synthesize({
      transcripts: this.conversation,
      extractedFacts: this.facts,
      connections: this.mentionedPeople,
      tone: this.emotionalReading
    });
  }
}
```

### The Agent's Interview Capabilities

**Active Listening**:
- Detects names, companies, dates in free speech
- Notes hesitations, emotion, emphasis
- Asks follow-ups based on what's *not* said
- Builds on previous answers

**Contextual Memory**:
- "You mentioned Razorfish earlier - how does that connect to what you're saying now?"
- "Wait, in your first answer you said August, now you're saying September. Which was it?"
- Cross-references with existing stories in DB

**Emotional Intelligence**:
- Senses when someone is getting nostalgic
- Knows when to push for details vs. move on
- Matches their energy (excited? reflective? bittersweet?)

**Fact Extraction**:
```typescript
// While you're talking naturally, agent extracts:
{
  person: "Sarah Chen",
  location: "Loft on Broadway & Houston",
  company: "Pseudo Programs",
  role: "Interface Designer",
  timeframe: "1995-1997",
  connections: [
    { name: "Eddie", type: "boss", context: "founder of Pseudo" },
    { name: "Josh", type: "colleague", context: "ran the servers" }
  ],
  technologies: ["HTML", "Photoshop 3", "Director"],
  artifacts: ["has photos from launch party"],
  followUpNeeded: ["Josh's last name", "specific launch date"]
}
```

---

## The Memory Graph

### Not Just Nodes and Edges

Traditional genealogy: `Person -> workedAt -> Company`

**Silicon Alley Graph**: Rich, weighted, contextualized relationships

```cypher
// Example: How Seth and John are connected
(seth:Person)
  -[:MENTORED_BY {
      context: "John brought Seth into Web Partner Studio circle",
      timeframe: "1994-1995",
      significance: "formative",
      mutualAcknowledgment: true,
      stories: [story_id_1, story_id_2]
    }]->(john:Person)

(seth:Person)
  -[:WORKED_WITH {
      at: "Web Partner Studio projects",
      duration: "6 months",
      tone: "collaborative",
      stories: [story_id_3]
    }]->(john:Person)

(seth:Person)
  -[:INSPIRED_BY {
      context: "John's vision of web as social space",
      mentioned_in: ["Seth's oral history", "SiteSpecific founding story"],
      significance: "career-defining"
    }]->(john:Person)
```

### Multi-Perspective Memories

Same event, different tellings:

```typescript
// The Pseudo Launch Party - March 1995
{
  event: "Pseudo Launch Party",
  date: "March 1995",

  perspectives: [
    {
      person: "Eddie",
      role: "host",
      memory: "Chaos. 200 people showed up, we expected 50...",
      tone: "proud, overwhelmed",
      details: ["ran out of beer", "servers crashed twice"]
    },
    {
      person: "Sarah",
      role: "attendee",
      memory: "The energy was insane. Everyone who mattered was there...",
      tone: "excited, FOMO",
      details: ["saw Janice and John talking", "met future co-founder"]
    },
    {
      person: "Josh",
      role: "tech",
      memory: "I spent the whole night in the server room...",
      tone: "stressed, focused",
      details: ["traffic spike", "manually restarting processes"]
    }
  ],

  agentSynthesis: {
    significance: "Pseudo's launch marked the moment Silicon Alley went from scrappy to serious",
    themes: ["ambition", "community", "technical fragility"],
    connections: ["Led to partnerships with...", "Inspired other companies to..."],
    contradictions: ["Eddie remembers it as March, Sarah says April - following up"]
  }
}
```

### The Agent Navigates This Graph

**Query: "Tell me about Pseudo's launch"**

Agent reasoning:
1. Find event node
2. Pull all connected perspectives
3. Identify key participants
4. Note what happened next (consequences)
5. Find similar events for context
6. Synthesize into narrative

**Output**:
> "Pseudo's launch party in March 1995 was pure Silicon Alley. Eddie expected 50 people - 200 showed up. The servers couldn't handle it, so Josh spent the night manually restarting them while everyone partied upstairs. Sarah remembers seeing Janice Fraser and John Borthwick in deep conversation - that connection led to... Want to hear more about what came after?"

---

## Agent Modes (Deep Dive)

### 1. Collector Mode

**Goal**: Extract maximum rich data with minimum user friction

**Techniques**:
- Start broad ("Tell me about your time in Silicon Alley")
- Zoom into specifics based on what they emphasize
- Use their language back at them
- Ask "dumb" questions to get good explanations
- Create safe space for gossip/truth-telling

**Example Dialogue**:
```
Agent: "You mentioned things got weird at the end of '96. What happened?"

User: "The money started flowing, and everything changed."

Agent: "Changed how?"

User: "Suddenly we had VCs in the office, telling us how to run things.
       The scrappy vibe died."

Agent: "Who were the VCs?"

User: [names specific people/firms]

Agent: "And the scrappy vibe - what did that feel like before they showed up?"

User: [describes cultural shift in detail]

// Agent is extracting:
// - Timeline (end of 96)
// - Cultural shift (scrappy -> professional)
// - Key actors (VC names)
// - Emotional tone (loss, nostalgia)
// - Theme (money changes everything)
```

### 2. Oracle Mode

**Goal**: Answer questions by synthesizing across all memories

**Query Types**:

**Factual**: "When was DoubleClick founded?"
- Straight lookup
- But also: "Here's what 3 early employees remember about that day"

**Relational**: "How did Seth and John meet?"
- Traverse graph
- Pull stories from both sides
- Show context

**Thematic**: "What was the vibe in 1995 vs 1996?"
- Aggregate sentiment across stories
- Identify common themes
- Show evolution

**Counterfactual**: "What if Pseudo had raised more money?"
- Find similar companies that did
- Compare trajectories
- Speculate based on patterns

**Narrative**: "Tell me the story of Silicon Alley"
- Full multi-hour narration
- Guided tour through eras
- Key characters, moments, themes

### 3. Tour Guide Mode

**Curated Journeys**:

**"The Founders' Journey"**
- Follow 5 founders from idea to launch to exit/failure
- Parallel timelines
- What they learned from each other

**"A Week in 1995"**
- Monday: What was happening at Razorfish
- Tuesday: What was happening at DoubleClick
- ...
- Shows simultaneity, interconnection

**"Follow the Money"**
- Track first VC investments
- How funding changed culture
- Who succeeded, who flamed out, why

**"The Parties"**
- Every launch party, every industry event
- Who went, who networked, what deals were made
- The social graph of Silicon Alley

### 4. Connector Mode

**Goal**: Find non-obvious relationships

**Pattern Detection**:
- "Did you know 7 companies all started in the same building?"
- "Did you know these 3 people all worked at TimeWarner before starting their own thing?"
- "Did you know everyone in this cluster went to NYU?"

**Introduce People**:
```
Agent to Person A: "I just talked to someone who worked at Agency.com
                    at the same time as you. Want to connect?"

Agent to Person B: "Person A says you were the best designer in the office.
                    Want to hear their full story about you?"
```

**Find Gaps**:
- "No one has told me about what happened at [company] in late 1996. Do you know?"
- "I have 3 conflicting stories about [event]. Can you help me figure out what really happened?"

---

## Technical Stack (Detailed)

### Agent Core
```typescript
// Claude Agent SDK
import { Agent, Memory, Tool } from '@anthropic-ai/sdk';

const siliconAlleyAgent = new Agent({
  name: "The Silicon Alley Memory Keeper",
  model: "claude-sonnet-4",

  memory: {
    type: "hybrid",

    // Semantic search for stories
    vector: {
      provider: "postgres-pgvector",
      model: "voyage-2",
      dimensions: 1024
    },

    // Graph for connections
    graph: {
      provider: "neo4j",
      // OR postgres + age extension
    },

    // Conversation context
    shortTerm: {
      provider: "redis",
      ttl: "24h"
    }
  },

  tools: [
    searchPeople,
    searchCompanies,
    findConnections,
    getTimeline,
    transcribeAudio,
    analyzePhoto,
    extractEntities,
    generateNarrative,
    findPatterns,
    crossReference
  ]
});
```

### Voice Pipeline
```typescript
// Browser → Transcription → Agent → Structured Data

// 1. Browser captures audio
navigator.mediaDevices.getUserMedia({ audio: true })

// 2. Stream to backend
const audioStream = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
});

// 3. Transcribe (real-time or batch)
const transcription = await anthropic.messages.create({
  model: "claude-sonnet-4",
  messages: [{
    role: "user",
    content: [
      { type: "audio", source: { type: "base64", data: audioBase64 }}
    ]
  }]
});

// 4. Agent processes
const structured = await siliconAlleyAgent.extract({
  transcript: transcription,
  existingContext: userProfile,
  mode: "interview"
});

// 5. Save to memory graph + vector store
await memory.ingest(structured);
```

### Photo Analysis Pipeline
```typescript
// User uploads photo from 1995

const analysis = await claude.vision({
  image: photo,
  prompt: `
    You are analyzing a photo from Silicon Alley in the 1990s.

    Extract:
    1. People (estimate # of people, describe what they're doing)
    2. Location clues (office? party? loft? café?)
    3. Technology visible (computers, monitors, modems, phones)
    4. Cultural details (clothes, decorations, vibe)
    5. Text in image (company names, posters, whiteboards)
    6. Time estimate (based on tech, style)

    Be specific about what you see vs. what you infer.
  `
});

// Agent then asks follow-ups:
"I see 4 people around a computer monitor. Who are they?"
"The whiteboard says 'Launch: March 15' - what was launching?"
"I see what looks like a Netscape browser - is that right?"
```

### LinkedIn Ingestion
```typescript
// OAuth → Parse → Agent Structures → User Confirms

async function ingestLinkedIn(linkedinUrl: string) {
  // 1. Fetch profile (via OAuth or scraping with permission)
  const profile = await fetchLinkedInProfile(linkedinUrl);

  // 2. Agent structures it
  const structured = await siliconAlleyAgent.process({
    rawData: profile,
    task: "extract Silicon Alley relevant history",
    context: "Looking for 1994-2000 timeframe, NYC tech scene"
  });

  // Finds:
  // - Jobs at relevant companies
  // - Overlaps with people already in DB
  // - Skills/technologies of the era
  // - Recommendations that mention connections

  // 3. Present to user
  return {
    suggestedProfile: structured,
    potentialConnections: await findOverlaps(structured),
    fillInStory: await generateQuestions(structured)
  };
}
```

---

## The Agent's Personality

### Voice & Tone Design

**Not**: Corporate, neutral, robotic
**Yes**: Warm, curious, slightly nostalgic, New York direct

**Example Phrasings**:

❌ "Please provide information about your employment history"
✅ "So where were you working in '95?"

❌ "I have identified 3 potential connections in the database"
✅ "Wait, I think you knew these 3 people - want to hear their stories?"

❌ "Would you like to continue?"
✅ "Should I keep going, or is this enough for now?"

❌ "The data suggests a correlation between..."
✅ "Here's what's wild - all these people were in the same building"

### The Agent's Boundaries

**What it knows**:
- "I remember that party - 3 people told me about it"
- "I don't have that story yet - want to fill me in?"

**What it doesn't**:
- "I'm not Google - I only know what people have told me"
- "That's outside my timeframe - I'm focused on '94-'96"

**Uncertainty**:
- "I have 2 conflicting memories of that. Let me show you both."
- "I'm not sure if that's right - want to help me check?"

**Emotions**:
- "God, that story about the server crash gives me anxiety just hearing it"
- "I love that - the scrappiness, you know?"
- But not: "I'm sorry for your loss" (it wasn't there, can't claim that)

---

## Data Model Evolution

### V1 Schema (Relational)
```sql
people, stories, connections, timeline_events, companies
```

### V2 Schema (Hybrid Graph + Vector + Relational)

```sql
-- Still keep core tables
people (id, name, ...)
stories (id, person_id, ...)

-- Add rich memory layer
memories (
  id UUID,
  content TEXT,              -- The actual story/memory
  embedding VECTOR(1024),    -- For semantic search
  person_id UUID,
  event_id UUID,
  type TEXT,                 -- oral_history, photo, document, linkedin
  timestamp TIMESTAMP,       -- When it was created/happened
  verified BOOLEAN,

  -- Metadata
  tone TEXT,                 -- nostalgic, excited, bitter, proud
  themes TEXT[],             -- collaboration, competition, innovation
  people_mentioned UUID[],   -- Auto-extracted
  companies_mentioned UUID[],
  technologies_mentioned TEXT[],

  -- Media
  audio_url TEXT,
  photo_url TEXT,
  document_url TEXT
);

-- Graph relationships (Neo4j or Postgres AGE)
(:Person)-[:WORKED_WITH {context, timeframe, stories}]->(:Person)
(:Person)-[:FOUNDED {role, date, equity}]->(:Company)
(:Person)-[:MENTORED {impact, stories}]->(:Person)
(:Event)-[:LED_TO {causal_link}]->(:Event)
(:Company)-[:COMPETED_WITH {markets}]->(:Company)
```

### Query Examples

**Semantic Search**:
```sql
-- Find all memories about "raising money"
SELECT * FROM memories
WHERE embedding <-> get_embedding('raising money') < 0.3
ORDER BY embedding <-> get_embedding('raising money')
LIMIT 10;
```

**Graph Traversal**:
```cypher
// Find path between two people
MATCH path = shortestPath(
  (a:Person {name: "Seth"})-[*]-(b:Person {name: "Fred Wilson"})
)
RETURN path;

// Find all companies in a person's orbit
MATCH (p:Person {name: "John"})-[*1..2]-(c:Company)
RETURN DISTINCT c;
```

**Temporal Query**:
```sql
-- What was happening across Silicon Alley in January 1995?
SELECT
  people.name,
  memories.content,
  memories.timestamp
FROM memories
JOIN people ON memories.person_id = people.id
WHERE
  memories.timestamp >= '1995-01-01'
  AND memories.timestamp < '1995-02-01'
ORDER BY memories.timestamp;
```

---

## The "What If AGI Existed in '95?" Frame

### Why This Works

1. **Narrative Permission**: Lets the agent be omniscient without seeming creepy
2. **Speculative Fiction**: "What would an AI have noticed?"
3. **Playful Seriousness**: Not pretending it was real, but exploring the idea
4. **Meta-Commentary**: The AI documenting the birth of the internet age

### Agent Self-Awareness

```
User: "Were you really there in 1995?"

Agent: "Ha, no. I'm the AI that *should* have been there.
        Like, imagine if someone had been documenting all of this
        with perfect memory. That's my job now - to be that memory,
        30 years later. I only know what people tell me, but I never forget."
```

### The Fiction Enables Truth

People are more honest with an AI that acknowledges it's doing historical reconstruction, not claiming to have been there.

"I can't fact-check this against my own memory, so tell me what you remember - I trust you."

---

## Rollout Strategy

### Phase 1: Voice Prototype (February)
- Add voice button to submit page
- Basic transcription + structuring
- No follow-ups yet, just: speak → review → submit
- **Goal**: Prove voice is easier than typing

### Phase 2: Interview Agent (March)
- Agent asks follow-up questions
- Conversational flow
- Detects entities, suggests connections
- **Goal**: 10x richer stories than forms

### Phase 3: Oracle Chat (April)
- Chat interface on homepage
- Answer questions about existing stories
- "Tell me about Razorfish"
- **Goal**: Make archive explorable

### Phase 4: Photo/Doc Upload (May)
- Vision analysis
- Link to people and events
- **Goal**: Visual dimension to memories

### Phase 5: Full Agent (June)
- Voice everywhere
- Proactive suggestions
- Tour guide mode
- **Goal**: Living, breathing narrator

---

## Success Metrics

**V1 Metrics**: Quantity
- Stories submitted
- People in database

**V2 Metrics**: Richness + Engagement
- Average story length (voice should be 3-5x longer)
- Connections discovered per story
- Questions asked to agent
- Time exploring vs. submitting
- Repeat visitors
- Agent-facilitated introductions

**The North Star**:
> "How often does someone say 'Holy shit, I didn't know that' while exploring the genealogy?"

---

## The End State

### A Living Archive That Thinks

Not: "Here's a database you can search"
But: "Let me tell you a story"

Not: "Click through profiles"
But: "Ask me anything - I know everyone"

Not: "Read these text blocks"
But: "Listen to them tell it in their own words"

**The Silicon Alley Agent becomes the definitive source of truth about this era.**

When someone asks "What was Silicon Alley really like?" - they don't Google it.

They ask the Agent.

And it tells them a story.

---

## Technical Challenges to Solve

1. **Real-time voice transcription**: Low latency, high accuracy
2. **Entity extraction**: Catch names/companies in natural speech
3. **Graph query performance**: Fast traversals on 10k+ nodes
4. **Vector search scale**: Million+ memories, sub-second search
5. **Agent reasoning cost**: Claude calls add up - need smart caching
6. **Conflict resolution**: What when stories contradict?
7. **Privacy**: Who can see what? How do people retract?
8. **Moderation**: What if someone submits false history?

---

## Why This Matters More Than It Seems

**This isn't just about Silicon Alley.**

This is a blueprint for **AI-native oral history**.

Every community, every movement, every era could have an Agent like this.

- Civil rights movement
- Early hip hop
- Punk scene in NYC
- Women in tech
- LGBTQ+ history

**The technology to preserve memory at this richness finally exists.**

Silicon Alley is the prototype.

---

**Next**: Build the voice prototype. Get one person to tell their story conversationally. Show it's better than a form. Then scale.
