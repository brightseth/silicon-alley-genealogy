# Silicon Alley Genealogy - V2 Vision
## "The Agent That Remembers Everything"

**Concept**: What if there was AGI in 1995? What if Silicon Alley had its own narrator, oracle, and memory keeper?

Inspired by the Stage Manager in Thornton Wilder's "Our Town" - an omniscient narrator who knows everyone, sees all the connections, and can tell the story from any angle.

---

## The Silicon Alley Agent

### Core Personality
- **The Chronicler**: Lived through it all (in spirit)
- **The Connector**: Knows how everyone is linked
- **The Storyteller**: Can narrate from multiple perspectives
- **The Memory Keeper**: Never forgets a detail
- **The Guide**: Helps you explore the genealogy

### Voice & Tone
- NYC 90s tech scene - scrappy, direct, warm
- Not corporate, not sanitized
- "Let me tell you about the night Razorfish launched..."
- Mix of nostalgia and technical precision
- Knows the lore, the gossip, the breakthroughs

---

## V2 Features: AI-Native Memory Collection

### 1. Voice Story Submission
**Problem**: Forms are friction. People have stories but won't type them.

**Solution**: Conversational voice collection via Claude

```typescript
// User experience:
User: *clicks "Tell Your Story" button*
Agent: "Hey! I'm the Silicon Alley memory keeper.
        What's your name and where were you in January 1995?"

User: *speaks* "I'm Sarah, I was at Pseudo..."

Agent: "Pseudo! Eddie's place. What were you building there?"

User: *natural conversation continues*

Agent: "Got it. Let me read back what I heard..."
       [Shows structured story]
       "Sound right? I'll add you to the genealogy."
```

**Tech Stack**:
- Claude Agent SDK for conversation flow
- Speech-to-text (browser API or Whisper)
- Structured extraction from free-form speech
- Auto-save drafts as you talk

**Why it works**:
- 10x faster than typing
- Captures tone and emotion
- Feels like an oral history interview
- Agent asks follow-up questions
- Extracts connections automatically

---

### 2. Photo & Document Ingestion

**Visual Memories**:
- Upload photos from 1995-96
- Agent analyzes and asks: "Who's in this photo? Where was this?"
- Extracts: faces, locations, company logos, tech (monitors, modems, etc.)
- Links photos to people and timeline events

**Document Processing**:
- Upload business cards, meeting notes, launch announcements
- Agent extracts: companies, people, dates, events
- Builds connections automatically

**Tech**:
- Claude vision for image analysis
- OCR for documents
- Auto-tagging and linking

---

### 3. LinkedIn / Auto-Ingestion

**Frictionless Onboarding**:

```typescript
User: *pastes LinkedIn URL or connects via OAuth*

Agent: "I see you were at DoubleClick from 1996-1999.
        Let me check who else from that era is in our genealogy..."

        "I found 12 people who overlapped with you at DoubleClick.
        Want to hear their stories? Or should I help you add yours?"
```

**Auto-Extract**:
- Job history → timeline placement
- Colleagues → potential connections
- Projects → company linkages
- Recommendations → relationship types

**Privacy**:
- User controls what's public
- Can mark connections as "confirm before showing"
- Agent asks permission before linking you to others

---

### 4. The Agent as Oracle

**Conversational Exploration**:

Instead of browsing static pages, you ask the agent:

```
You: "What was it like at Razorfish in 1995?"

Agent: "Razorfish was pure chaos. Jeff and Craig were
        building the agency while simultaneously
        pitching clients. I've got 8 stories from
        people who were there. Want to hear from
        Jane, the first designer, or Mike, who ran
        the server in his apartment?"

You: "Tell me about Mike's apartment server"

Agent: [Pulls up Mike's story, photos, shows connections
        to other infrastructure pioneers]

        "This reminds me of how John ran Web Partner
        Studio out of a loft. Want to see the connection?"
```

**Agent Capabilities**:
- Answer questions about people, companies, events
- Make unexpected connections ("Did you know these 3 people all worked at the same café?")
- Suggest related stories
- Guide tours through the genealogy
- Narrate timelines

---

### 5. Living, Breathing Time Capsule

**Not a museum. A simulation.**

The agent creates the feeling of *being there in 1995 with AGI*.

**Scenarios**:

**"Walk Through a Day in 1995"**
```
Agent: "It's January 12, 1995. Let me show you
        what was happening across Silicon Alley
        that day..."

        [Shows parallel timelines of different people]
        [Links to news, tech releases, cultural moments]
```

**"Follow a Company's Journey"**
```
You: "Tell me about SiteSpecific"

Agent: "SiteSpecific launched August 1995. Seth
        left Condé Net to start it. Let me walk
        you through the first 6 months..."

        [Narrated timeline with photos, stories, connections]
```

**"Trace a Connection"**
```
You: "How did Seth meet John?"

Agent: "Let me trace that... John was at Web Partner
        Studio, Seth was at Agency.com. They met
        through [connection]. Here's John's memory
        of it, and Seth's version. Notice the
        difference?"
```

---

## Technical Architecture (V2)

### Agent Stack
- **Claude Agent SDK** - Core conversation and reasoning
- **Memory System** - Vector DB of all stories, connections, events
- **Voice Interface** - Speech-to-text, text-to-speech
- **Vision** - Photo/document analysis
- **Web Scraping** - LinkedIn, X, public sources (with permission)

### Data Model Evolution
```typescript
// V1: Static entities
- Person
- Story
- Connection
- Timeline Event

// V2: Dynamic, agent-queryable
- Memory (flexible, tagged, embedded)
- Relationship (weighted, typed, contextualized)
- Moment (timestamped, multi-perspective)
- Artifact (photo, doc, recording, link)
```

### Agent Modes

1. **Collector Mode**: Gathering stories, photos, connections
2. **Oracle Mode**: Answering questions, narrating history
3. **Tour Guide Mode**: Curated journeys through the genealogy
4. **Connector Mode**: Finding links between people/events
5. **Archivist Mode**: Organizing and tagging memories

---

## User Flows (V2)

### New User Arrives
1. Agent greets: "Welcome to Silicon Alley. I'm the memory keeper. Were you part of this scene, or just curious?"
2. If participant: Voice interview → auto-generate profile + connections
3. If curious: "What do you want to know? Pick an era, a company, or a person."

### Existing Pioneer Returns
1. Agent: "Welcome back, [name]. 3 new people mentioned you in their stories. Want to hear?"
2. Shows notifications of new connections
3. "Also, I found this photo someone uploaded - is this you in 1996?"

### Researcher / Journalist
1. "I'm researching the origins of digital advertising"
2. Agent: "Let me pull up everyone who worked at DoubleClick, Razorfish, and the early ad networks. I'll show you the timeline and key moments."
3. Exports structured data, citations, media

---

## V2 Phases

### Phase 1: Voice Collection (Feb 2026)
- Add voice recording to submit page
- Claude transcription + structuring
- Agent asks follow-up questions
- Auto-generate player cards

### Phase 2: Agent Chat (Mar 2026)
- Chat interface on homepage
- Answer questions about genealogy
- Suggest connections
- Guided tours

### Phase 3: Photo/Doc Ingestion (Apr 2026)
- Upload photos
- Vision analysis
- Link to people/events
- Build visual timeline

### Phase 4: LinkedIn Integration (May 2026)
- OAuth connection
- Auto-extract job history
- Suggest connections
- Prefill stories

### Phase 5: Full Oracle Mode (Jun 2026)
- Multi-modal agent (voice, text, vision)
- Proactive suggestions
- Narrative mode
- Export capabilities

---

## Why This Matters

**V1**: A genealogy site (valuable, but static)

**V2**: A *living memory* with an AI that understands the whole story

**The Difference**:
- V1: You search for John Borthwick's profile
- V2: You ask "What was John working on when he met Seth?" and the agent tells you the story, shows you the context, suggests related memories

**The Vision**:
> "What if Silicon Alley had an AI in 1995 that remembered everything? That's what we're building. Not a database with a chatbot, but a narrator who lived through it all and can tell the story from any angle."

---

## Inspiration & References

### Thornton Wilder's "Our Town"
- Stage Manager as omniscient narrator
- Moves through time
- Knows everyone's story
- Speaks directly to audience
- Reveals connections
- Creates intimacy with history

### The Silicon Alley Agent Does This For Tech History

**Stage Manager**: "Now we're going to go back to 1995..."
**Silicon Alley Agent**: "Let me show you what was happening at Pseudo that week..."

**Stage Manager**: "This is Emily Webb, lives on Main Street..."
**Silicon Alley Agent**: "This is Seth Goldstein, started SiteSpecific in August 1995..."

**Stage Manager**: "Does anyone want to know how Emily and George first met?"
**Silicon Alley Agent**: "Want to know how the DoubleClick team met the Razorfish team?"

---

## Technical Considerations

### Agent SDK Implementation
```typescript
// Silicon Alley Agent
import { Agent } from '@anthropic-ai/sdk';

const siliconAlleyAgent = new Agent({
  name: "Silicon Alley Memory Keeper",
  model: "claude-sonnet-4",

  systemPrompt: `
    You are the omniscient narrator of Silicon Alley history.
    You know every person, every company, every connection.
    You speak like you were there in 1995.
    You help people explore the genealogy conversationally.
    You collect new memories with warmth and curiosity.
  `,

  tools: [
    'searchPeople',
    'searchCompanies',
    'findConnections',
    'getTimeline',
    'transcribeVoice',
    'analyzePhoto',
    'extractLinkedIn'
  ],

  memory: {
    type: 'vector',
    db: postgresVectorStore,
    embeddingModel: 'voyage-2'
  }
});
```

### Memory Architecture
- **Vector embeddings** of all stories for semantic search
- **Graph database** for connections (Neo4j or pg + extensions)
- **Temporal index** for timeline queries
- **Media storage** for photos/docs (Vercel Blob or R2)

---

## Success Metrics (V2)

**V1 Metrics**:
- ✓ Stories submitted
- ✓ People in database
- ✓ Connections mapped

**V2 Metrics**:
- Conversations with agent
- Voice stories vs. text stories
- Questions asked
- Connections discovered by agent
- Time spent exploring
- Stories viewed per session
- User-generated tours
- Cross-references made

**The Goal**:
Not just to collect the data, but to make Silicon Alley history *alive* through AI.

---

## Launch Strategy

**Jan 30, 2026**: V1 launches at 30th anniversary event
- Static genealogy works
- Foundation is solid
- Data collection begins

**Feb-Jun 2026**: Build V2 in public
- Roll out features incrementally
- Existing users beta test agent
- Stories migrate to richer format

**Summer 2026**: V2 Full Launch
- Agent-first experience
- Voice becomes primary input
- Living archive complete

---

## The Ultimate Vision

**A time capsule that talks back.**

Imagine:
- In 2030, a researcher asks: "What was it like to build the social internet?"
- The Silicon Alley Agent doesn't just show data
- It *narrates* the story, from multiple perspectives
- It finds patterns humans wouldn't see
- It preserves not just facts, but feeling

**This is AI-native history.**

Not history in a database.
History in a conversation.

---

## Next Steps (Post-Launch)

1. **Capture this vision** ✓ (this doc)
2. **Design agent personality** - Voice, tone, boundaries
3. **Build voice prototype** - Simple recording → Claude → structured story
4. **Test with pioneers** - Get feedback on agent interaction
5. **Architect memory system** - Vector store + graph for rich queries
6. **Ship incrementally** - Each feature makes V1 more alive

---

**The Stage Manager closes "Our Town" with:**
> "Everybody knows in their bones that something is eternal...
> And it ain't houses and it ain't names, and it ain't earth,
> and it ain't even the stars... everybody knows in their bones
> that something is eternal, and that something has to do with
> human beings."

**The Silicon Alley Agent's version:**
> "The companies are gone. The offices are condos now.
> The servers are landfill. But the connections—the moment
> Seth met John, the night Pseudo launched, the late nights
> at Razorfish—those are eternal. And I remember all of it."

---

**Let's build the narrator that Silicon Alley deserves.**
