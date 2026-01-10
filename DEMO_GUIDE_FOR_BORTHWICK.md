# Demo Guide for John Borthwick Meeting
## Silicon Alley Genealogy - V1 + V2 Preview

**Live Site**: https://silicon-alley-genealogy.vercel.app

---

## The Pitch (30 seconds)

"We built the Silicon Alley genealogy for the 30th anniversary. V1 is done - it's a working site with stories, timelines, and player cards.

But the real vision is V2: an AI-native oral history archive. What if Silicon Alley had AGI in 1995? An agent that remembers everything, knows everyone, and can tell the story from any angle.

Let me show you two V2 prototypes we built this week..."

---

## Demo Flow (5-10 minutes)

### 1. Start on Homepage
**URL**: https://silicon-alley-genealogy.vercel.app

**What to show**:
- Clean NYC aesthetic (black hero, dark terminal, bold text)
- Terminal section shows the vibe
- Note the "V2 →" link in navigation

**What to say**:
"This is V1 - it's live, it works, it's ready for the Jan 30 event. But check out this V2 preview link..."

---

### 2. V2 Vision Page
**URL**: https://silicon-alley-genealogy.vercel.app/vision

**What to show**:
- The "Our Town" narrator concept
- Voice collection
- Oracle mode
- Photo ingestion
- LinkedIn auto-extract
- The roadmap

**What to say**:
"The vision is inspired by Thornton Wilder's 'Our Town' - that omniscient narrator who knows everyone and can tell the story from any perspective.

What if Silicon Alley had an AI that lived through it all and remembers everything? That's what we're building.

Two prototypes are live today - let me show you..."

---

### 3. Voice Recording Demo
**URL**: https://silicon-alley-genealogy.vercel.app/submit

**What to show**:
1. Click "🎤 Start Recording"
2. Grant microphone permission
3. Record 5-10 seconds of anything (doesn't matter - it's demo data)
4. Stop recording
5. Watch it "process"
6. See the form auto-fill with demo Silicon Alley story
7. Point out it mentions John by name in the data

**What to say**:
"Instead of typing into a form, you just talk. The AI transcribes it and extracts all the structured data.

This is a V2 preview - the actual Claude audio transcription is coming soon, but the UX flow works perfectly. Notice how it automatically filled out the entire form, even extracted connections like your name.

In production, the agent will ask follow-up questions: 'You mentioned Pseudo - tell me more about that night.'"

**Key point**: This demonstrates voice-first collection. 10x easier than typing.

---

### 4. Agent Chat Demo
**URL**: https://silicon-alley-genealogy.vercel.app/people

**What to do**:
1. Click on John Borthwick's card
2. On John's page, click "💬 Ask the Agent About John Borthwick"
3. Type a question like:
   - "What was John working on?"
   - "Who did John work with?"
   - "What was the Silicon Alley scene like?"
4. Show the agent responding in character
5. Ask another question to show conversation flow

**What to say**:
"This is Oracle mode. Instead of browsing static pages, you talk to an agent that knows the whole story.

The agent has John's bio, connections, and will eventually have all the stories from everyone who mentions him. It speaks in first person: 'I remember when...'

It's like the Stage Manager in 'Our Town' - it knows everyone, sees all the connections, can tell you things you wouldn't discover by browsing."

**Key point**: Conversational exploration is more natural than clicking through pages.

---

### 5. Close with the Vision

**What to say**:
"V1 is the foundation. V2 is the future.

By summer 2026, you won't browse the genealogy - you'll ask the agent:
- 'Tell me the story of Silicon Alley'
- 'How did Seth and John meet?'
- 'What was it like at Pseudo in March 1995?'

And it will narrate the story, show you photos, play voice recordings, make connections you'd never find yourself.

It's not a database with a chatbot. It's a narrator that lived through Silicon Alley and remembers everything."

---

## Backup Talking Points

### If he asks: "Why voice?"
"Because people have stories they'll never type. But they'll talk for 20 minutes.

Voice gets 10x richer stories. The agent can ask follow-ups. It feels like an interview, not homework.

Plus it's more inclusive - not everyone wants to type long-form text, but everyone can talk."

### If he asks: "Why an agent vs. just search?"
"Search assumes you know what you're looking for. An agent can guide you.

It can say: 'Based on that story, you might want to hear from these 3 people.'
Or: 'Wait, I notice a pattern - 5 companies all started in the same building.'

It's the difference between a library and a librarian who knows every book and can tell you which one you actually need."

### If he asks: "What's the timeline?"
"V1 launches Jan 30 at the event.

V1.5 (voice + basic agent features) - February
V1.75 (interview agent, photo uploads) - March
V2 (full multi-modal agent) - Summer 2026

We're building in public. Each feature makes V1 more alive."

### If he asks about technical implementation
"Built on Next.js, Vercel Postgres, Claude Agent SDK.

Hybrid architecture: relational DB for structured data, pgvector for semantic search, Neo4j for the connection graph.

The agent uses Claude Sonnet 4 with custom tools for memory search, connection finding, and narrative generation.

All documented in the repo - V2_VISION.md, V2_AGENT_ARCHITECTURE.md, V1_TO_V2_BRIDGE.md."

---

## Quick URLs for Reference

- Homepage: https://silicon-alley-genealogy.vercel.app
- V2 Vision: https://silicon-alley-genealogy.vercel.app/vision
- Voice Demo: https://silicon-alley-genealogy.vercel.app/submit
- People (for agent chat): https://silicon-alley-genealogy.vercel.app/people
- John's Page: https://silicon-alley-genealogy.vercel.app/person/04c61661-ede7-4013-ab28-7b726468b12e
- GitHub: https://github.com/brightseth/silicon-alley-genealogy

---

## What Success Looks Like

**John's reaction**:
- "Oh shit, this is cool" → ✅
- "Can we use this for other communities?" → ✅✅
- "I know 10 people who need to add their stories" → ✅✅✅
- "When can I talk to the full agent?" → ✅✅✅✅

**What you want from him**:
1. Feedback on the vision
2. Connections to other pioneers (for stories)
3. His own story (use the voice recorder!)
4. Amplification (tweet about it, tell others)

---

## Troubleshooting

**If voice recorder doesn't work**:
- Needs microphone permission (click "Allow")
- Works in Chrome/Edge, might not work in Firefox
- Mobile Safari might be buggy
- Fallback: "This is a desktop demo, but on mobile it's even better"

**If agent chat is slow**:
- Claude API calls take 1-3 seconds
- Normal! Say: "The agent is thinking - in production we'll show typing indicators"

**If something breaks**:
- Admin interface at /admin (password: silicon-alley-admin)
- Or just talk through the vision page - that's static and always works

---

## After the Demo

**If he's excited**:
"Want to record your story right now? We can do it on the voice recorder or I can interview you and add it manually."

**Send follow-up**:
- Link to vision docs
- GitHub repo
- Invitation to add his story
- Ask for introductions to other pioneers

---

## The One Thing to Remember

**This isn't just about Silicon Alley.**

This is a blueprint for AI-native oral history. Any community could have an agent like this:
- Civil rights movement
- Early hip-hop
- Women in tech
- Any movement, any era

Silicon Alley is the prototype. The technology to preserve memory at this richness finally exists.

---

**Go get 'em! 🚀**
