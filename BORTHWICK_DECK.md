# Silicon Alley Genealogy - V2 Vision
## 10-Slide Deck for John Borthwick

---

## SLIDE 1: Title
**Visual**: Silicon Alley 30 logo on black background

**Title**: Silicon Alley Genealogy
**Subtitle**: What if AGI existed in 1995?
**Date**: 30th Anniversary | January 28-31, 2026
**URL**: silicon-alley-genealogy.vercel.app

**Footer**: V2 Preview Demo

---

## SLIDE 2: V1 is Done ✓
**Visual**: Screenshot of homepage (black hero, dark terminal)

**Headline**: V1: The Foundation

**Bullets**:
- ✅ Database & API (stories, people, connections)
- ✅ Dynamic timeline and people directory
- ✅ Admin interface for story approval
- ✅ Social sharing with OG images
- ✅ Mobile-friendly, NYC aesthetic
- ✅ Ready for Jan 30 launch

**Callout**: "This works. It's live. But it's just the beginning..."

---

## SLIDE 3: The V2 Vision
**Visual**: Split screen - "Our Town" playbill | Silicon Alley terminal aesthetic

**Headline**: An AI-Native Oral History Archive

**Quote**:
> "Like the Stage Manager in Thornton Wilder's 'Our Town' - an omniscient narrator who knows everyone, sees all connections, and can tell the story from any angle."

**The Difference**:
- **V1**: A website about Silicon Alley history
- **V2**: An AI that *lived through* Silicon Alley and remembers everything

---

## SLIDE 4: Voice-First Collection
**Visual**: Microphone icon | Waveform | Auto-filled form

**Headline**: 🎤 Talk Instead of Type

**The Problem**:
Forms are friction. People won't type their stories.

**The Solution**:
Speak naturally → AI transcribes → Extracts structured data → Asks follow-ups

**Demo Flow**:
1. Click "Start Recording"
2. Tell your story (naturally, conversationally)
3. AI extracts: names, places, companies, connections
4. Form auto-fills
5. Submit

**Result**: 10x richer stories, 10x easier to submit

**Status**: 🟢 Prototype live at /submit

---

## SLIDE 5: Oracle Mode
**Visual**: Chat interface with agent responses

**Headline**: 💬 Ask the Agent Anything

**Instead of browsing** → **Ask questions**:
- "What was John working on when he met Seth?"
- "Tell me about Pseudo's launch party"
- "Who else was at Razorfish in 1995?"

**The Agent**:
- Knows all stories, all connections
- Speaks in first person: "I remember when..."
- Makes unexpected connections
- Guides your exploration

**Demo**: Visit any person page → Click "Ask the Agent"

**Status**: 🟢 Prototype live on all person pages

---

## SLIDE 6: The Full V2 Roadmap
**Visual**: Timeline graphic (Feb → Summer 2026)

**February 2026**: V1.5
- ✅ Voice recording (live now!)
- ✅ Agent chat (live now!)
- Auto-extract connections from stories
- "Ask About This Person" on every page

**March 2026**: V1.75
- Interview agent with follow-ups
- Photo & document uploads
- Vision analysis (who's in this photo?)
- Link photos to people and events

**April 2026**: LinkedIn Integration
- Paste LinkedIn URL → Auto-extract job history
- Find overlaps with other pioneers
- Pre-fill your story based on career

**Summer 2026**: V2 Launch
- Full multi-modal agent (voice, text, vision)
- Tour guide mode (curated narratives)
- Pattern discovery
- The complete oracle

---

## SLIDE 7: The Agent's Capabilities
**Visual**: 5 concentric circles or pillars

**5 Knowledge Layers**:
1. **Facts**: People, companies, dates (structured data)
2. **Stories**: Oral histories, anecdotes (unstructured)
3. **Connections**: Who worked with whom (graph)
4. **Context**: What was happening, what was possible (temporal)
5. **Narrative**: Themes, arcs, contradictions (synthesis)

**The Agent Operates Across All Layers**:
- Not just search (finds facts)
- Not just chatbot (generates text)
- But: **Omniscient narrator** (understands the whole story)

**Agent Modes**:
- 🎤 **Collector**: Interviews people, asks follow-ups
- 🔮 **Oracle**: Answers questions, finds connections
- 🗺️ **Tour Guide**: Curated journeys through the genealogy
- 🔗 **Connector**: "Did you know these 5 people all..."
- 📚 **Archivist**: Organizes, tags, preserves

---

## SLIDE 8: Multi-Perspective Memory
**Visual**: Same event told 3 different ways (speech bubbles)

**Example**: Pseudo Launch Party, March 1995

**Eddie (host)**:
"Chaos. 200 people showed up, we expected 50. Servers crashed twice..."

**Sarah (attendee)**:
"The energy was insane. I saw Janice and John talking in the corner - that's where the connection started..."

**Josh (tech)**:
"I spent the whole night in the server room manually restarting processes while everyone partied upstairs..."

**The Agent Synthesizes**:
> "Pseudo's launch in March 1995 was pure Silicon Alley. Eddie expected 50, 200 showed up. While Josh kept the servers alive, deals were being made upstairs. That night, Janice introduced John to..."

**Why This Matters**: Same event, different lenses → Richer truth

---

## SLIDE 9: Why This Matters (Beyond Silicon Alley)
**Visual**: Blueprint/schematic aesthetic

**This is a Blueprint for AI-Native Oral History**

**Every community could have an agent like this**:
- Civil rights movement
- Early hip-hop in the Bronx
- Women in tech (1970s-present)
- LGBTQ+ history
- Climate activism
- Any movement, any era

**The Technology Finally Exists**:
- Claude for reasoning & conversation
- Vector search for semantic memory
- Graph databases for connections
- Vision for photos & documents
- Voice for natural collection

**Silicon Alley is the Prototype**

**The Bigger Vision**:
Not history in a database. History in a conversation.

---

## SLIDE 10: Try It Now
**Visual**: Split screen - Voice recorder | Agent chat

**Two Prototypes Live Today**:

**🎤 Voice Recording**
→ silicon-alley-genealogy.vercel.app/submit
Record your story, watch it auto-fill the form

**💬 Agent Chat**
→ silicon-alley-genealogy.vercel.app/people
Ask the agent about any pioneer

**Full Vision**:
→ silicon-alley-genealogy.vercel.app/vision

**GitHub**:
→ github.com/brightseth/silicon-alley-genealogy
- V2_VISION.md
- V2_AGENT_ARCHITECTURE.md
- V1_TO_V2_BRIDGE.md

**The Ask**:
1. Share your Silicon Alley story (use the voice recorder!)
2. Introduce us to other pioneers
3. Feedback on the vision
4. Help us make this real

---

## BACKUP SLIDE: Technical Stack
**Visual**: Architecture diagram (if needed)

**Foundation**:
- Next.js 16 + React 19
- Vercel Postgres (structured data)
- Vercel deployment

**V2 Architecture**:
- **Agent**: Claude Agent SDK (Sonnet 4)
- **Memory**: pgvector (semantic search) + Neo4j (graph)
- **Voice**: Browser MediaRecorder → Claude transcription
- **Vision**: Claude vision for photo analysis
- **APIs**: Anthropic SDK for all AI features

**Data Model**:
- Relational: people, stories, events
- Vector: embeddings for semantic search
- Graph: connections, relationships, influences

**All documented in the repo**

---

## BACKUP SLIDE: Success Metrics
**Visual**: Dashboard mockup

**V1 Metrics** (Quantity):
- Stories submitted
- People in database
- Connections mapped

**V2 Metrics** (Richness + Engagement):
- Average story length (voice should be 3-5x longer)
- Connections discovered per story
- Questions asked to agent
- Time exploring vs. submitting
- Agent-facilitated introductions
- "Holy shit" moments

**The North Star**:
> "How often does someone say 'Holy shit, I didn't know that' while exploring the genealogy?"

---

## DESIGN NOTES:

**Color Palette**:
- Black (#000000) - Primary background
- White (#FFFFFF) - Primary text
- Silicon Alley Primary (#FF6B35) - Orange accent
- Silicon Alley Secondary (#004E89) - Blue accent
- Silicon Alley Accent (#F7B801) - Yellow accent
- Green (#10B981) - For "live/active" indicators

**Typography**:
- Headlines: Bold, large, black or white
- Body: Clean sans-serif (Helvetica Neue / Inter)
- Code/Terminal: Monospace (SF Mono / IBM Plex Mono)

**Visual Style**:
- NYC/Gotham aesthetic (gritty, industrial)
- Dark terminals with green text (90s tech nostalgia)
- High contrast for readability
- Screenshots from actual site when possible
- Minimal decoration, maximum information

**Slide Transitions**:
- Simple fades or none
- Let the content speak

---

## PRESENTATION NOTES:

**Timing**: ~2 minutes per slide = 20 minutes total (with demo)

**Flow**:
1. Title (15 seconds) - Set the stage
2. V1 Done (1 min) - Show foundation is solid
3. V2 Vision (2 min) - Explain the concept
4. Voice (2 min) - Demo + explain why it matters
5. Oracle (2 min) - Demo + show conversational exploration
6. Roadmap (2 min) - Timeline to full vision
7. Capabilities (2 min) - Technical depth for John
8. Multi-perspective (2 min) - Show the sophistication
9. Why it matters (2 min) - Bigger than Silicon Alley
10. Try it (1 min) - Call to action

**Demo Integration**:
- After Slide 4 (Voice): Do live demo
- After Slide 5 (Oracle): Do live demo
- After Slide 10: Invite John to try it

**Questions**:
- Pause after Slide 3 (Vision) for initial reactions
- Pause after demos for feedback
- End with open discussion

---

## KEY MESSAGES TO REINFORCE:

1. **V1 is done** - This isn't vaporware, foundation is solid
2. **Voice changes everything** - 10x easier, 10x richer stories
3. **Agent is smarter than search** - Guided exploration > browsing
4. **This is bigger than Silicon Alley** - Blueprint for any community
5. **Technology exists now** - Claude + vectors + graphs = possible today

**The Emotional Arc**:
- Start: "We built this cool thing"
- Middle: "But here's the real vision" (excitement builds)
- End: "This changes how we preserve history" (profound realization)

---

## LEAVE-BEHIND:

After the meeting, send:
1. Link to this deck
2. Link to live site
3. Link to vision docs on GitHub
4. Personal invitation to record his story
5. Ask for 3 intro connections to other pioneers

**Email Template**:
```
Subject: Silicon Alley Genealogy - V2 Vision (+ Try It!)

Hey John,

Thanks for the time today! Here's everything:

Live Site: https://silicon-alley-genealogy.vercel.app

Try the V2 prototypes:
- Voice recording: /submit
- Agent chat: /people (click any person)

Full vision docs:
https://github.com/brightseth/silicon-alley-genealogy
- V2_VISION.md
- V2_AGENT_ARCHITECTURE.md

Would love to:
1. Get your Silicon Alley story (use the voice recorder!)
2. Intros to [3 specific people] for their stories
3. Any feedback on the vision

This is the future of oral history. Silicon Alley is just the beginning.

— Seth
```

---

**END OF DECK**
