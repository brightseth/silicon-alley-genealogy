# Silicon Alley Agent - Claude Agent SDK Architecture
**Version**: V2 Full Agent Implementation
**Purpose**: Build the "Our Town" narrator as a true autonomous agent

---

## 🎯 The Vision: A Living Memory Keeper

Not just a chatbot. A **sentient archivist** that:
- Listens to oral histories and extracts rich structured data
- Asks intelligent follow-up questions naturally
- Generates timelines from scattered memories
- Maps social connections across stories
- Becomes smarter with every story it hears

**The Magic**: It feels like talking to someone who was there.

---

## 🏗️ Architecture: Claude Agent SDK

### **Current State (V1.5)**
- Direct API calls to Claude
- Stateless (no memory between conversations)
- Manual extraction prompts
- No tools, no autonomy

### **Proposed State (V2)**
- Claude Agent SDK with persistent memory
- Tool use (database queries, timeline generation, connection mapping)
- Multi-turn conversations with context
- Autonomous decision-making

---

## 🛠️ Agent Tools (What It Can Do)

### **1. Memory Tools**

**`extract_story_data`**
- Input: Raw transcription or text
- Output: Structured JSON (name, location, company, connections, dates)
- Uses: First-pass extraction from voice recordings

**`store_memory`**
- Input: Structured story data
- Output: Database ID
- Uses: Persist stories to Postgres

**`recall_memories`**
- Input: Person name, company, date range, or keyword
- Output: Related stories from database
- Uses: Agent retrieves context when answering questions

**`ask_followup`**
- Input: Current story, conversation history
- Output: Intelligent follow-up question
- Uses: Deepens stories automatically

---

### **2. Timeline Tools**

**`generate_timeline`**
- Input: Person ID or date range
- Output: Chronological timeline of events
- Uses: Creates visual timelines from stories

**`detect_events`**
- Input: Story text
- Output: List of events with dates (parties, launches, meetings)
- Uses: Auto-populate timeline database

**`place_event_in_context`**
- Input: Event + date
- Output: What else was happening in tech/NYC that day
- Uses: Enriches timelines with cultural context

---

### **3. Connection Tools**

**`map_connections`**
- Input: Story text
- Output: Graph of people mentioned and their relationships
- Uses: Auto-build social graph

**`find_shared_history`**
- Input: Two person IDs
- Output: Overlapping events, companies, stories
- Uses: "How did X and Y meet?"

**`suggest_connections`**
- Input: Person ID
- Output: "You should talk to these people who were also at..."
- Uses: Network effect for story collection

---

### **4. Oracle Tools**

**`answer_question`**
- Input: Natural language question
- Output: Synthesized answer from all stories
- Uses: Public-facing agent chat

**`generate_narrative`**
- Input: Topic (e.g., "Pseudo launch party")
- Output: Multi-perspective narrative synthesizing all mentions
- Uses: Blog posts, summaries, insights

**`discover_patterns`**
- Input: None (runs on full corpus)
- Output: Interesting patterns (5 companies in same building, etc.)
- Uses: Serendipitous discoveries

---

## 🧠 Agent Modes

### **Mode 1: Memory Collector**
**Triggered**: When someone submits a story

**Flow**:
1. Receive raw audio/text
2. Use `extract_story_data` tool
3. Use `ask_followup` tool (3 rounds)
4. Use `detect_events` and `map_connections` tools
5. Use `store_memory` tool
6. Confirmation: "Got it! I now remember your story about..."

### **Mode 2: Timeline Weaver**
**Triggered**: When someone asks "What happened in 1995?"

**Flow**:
1. Use `recall_memories` with date filter
2. Use `detect_events` to extract timeline
3. Use `place_event_in_context` for cultural backdrop
4. Use `generate_narrative` to tell the story
5. Return rich timeline with context

### **Mode 3: Connection Finder**
**Triggered**: "Who else worked at Razorfish?"

**Flow**:
1. Use `recall_memories` filtered by company
2. Use `map_connections` to build graph
3. Use `find_shared_history` for overlaps
4. Return: "12 people mentioned Razorfish. Here's the network..."

### **Mode 4: Oracle**
**Triggered**: Any question about Silicon Alley

**Flow**:
1. Use `recall_memories` semantically (vector search)
2. Use `answer_question` with full context
3. Use `suggest_connections` if relevant
4. Speak in first person: "I remember when..."

---

## 📂 File Structure (New)

```
/lib/
  /agent/
    silicon-alley-agent.ts       # Main agent definition
    tools/
      memory-tools.ts             # extract, store, recall
      timeline-tools.ts           # generate, detect, contextualize
      connection-tools.ts         # map, find, suggest
      oracle-tools.ts             # answer, narrate, discover
    modes/
      memory-collector.ts         # Interview mode
      timeline-weaver.ts          # Timeline generation
      connection-finder.ts        # Network mapping
      oracle.ts                   # Question answering

/app/api/
  /agent/
    route.ts                      # Single unified agent endpoint
    /webhooks/                    # For async agent tasks
```

---

## 🔄 Agent Lifecycle

### **Session Start**
- Agent loads all approved stories into context
- Builds semantic index (vector embeddings)
- Ready to answer questions

### **During Conversation**
- Agent uses tools autonomously
- Maintains conversation state
- Learns from new stories in real-time

### **After Story Submission**
- Agent processes async (extracts events, connections)
- Updates knowledge base
- Notifies relevant people ("Someone just mentioned you!")

---

## 🎨 Making It Magical

### **1. Memory Recording**
**Current**: Click record, speak, submit
**Magical**: 
- Agent asks follow-ups conversationally
- "Tell me more about that night at Pseudo..."
- Extracts emotions, not just facts
- "So you felt..."

### **2. Timeline Generation**
**Current**: Static list of events
**Magical**:
- Agent generates narrative timelines
- "March 1995 was chaotic. While Josh was debugging at Pseudo, Sarah met Janice at..."
- Multi-perspective timelines
- Interactive: "What happened next?"

### **3. Social Networking**
**Current**: List of connections
**Magical**:
- "You and John both mentioned that party. Want to connect?"
- "5 people from SiteSpecific are here. Want a reunion?"
- Auto-suggests introductions
- Living directory that matchmakes

---

## 🚀 Implementation Plan

### **Phase 1: Agent Foundation (Week 1)**
- Set up Claude Agent SDK
- Build basic tools (extract, store, recall)
- Create memory collector mode
- Test with voice recordings

### **Phase 2: Timeline Magic (Week 2)**
- Build timeline generation tools
- Auto-detect events from stories
- Create narrative timeline views
- Add cultural context

### **Phase 3: Connection Graph (Week 3)**
- Build connection mapping tools
- Auto-extract relationships
- Create network visualization
- Add matchmaking features

### **Phase 4: Oracle Mode (Week 4)**
- Unified question answering
- Pattern discovery
- Multi-perspective narratives
- Full "Our Town" narrator

---

## 💎 The Dream Experience

**User arrives at site**:
"Hey, I'm the Silicon Alley memory keeper. I've been listening to everyone's stories. What do you want to know?"

**User**: "Tell me about Pseudo"

**Agent**: "Ah, Pseudo. March 1995. Let me tell you what I remember...

Eddie hosted the launch party. Expected 50 people, 200 showed up. Servers crashed twice. While Josh was in the back room manually restarting processes, Sarah was upstairs meeting Janice for the first time. That connection led to...

Want to hear more? I have stories from 8 people who were there that night."

**User**: "Who was there?"

**Agent**: "Let me show you..." [generates network graph] "These 8 people all mentioned that night. 3 of them are connected to your story about SiteSpecific. Want an introduction?"

---

## 🔧 Technical Stack

```typescript
import { AgentSDK } from '@anthropic-ai/agent-sdk';
import { sql } from '@vercel/postgres';

const siliconAlleyAgent = new AgentSDK({
  name: 'Silicon Alley Memory Keeper',
  model: 'claude-sonnet-4-20250514',
  tools: [
    extractStoryData,
    storeMemory,
    recallMemories,
    generateTimeline,
    mapConnections,
    answerQuestion,
    // ... all tools
  ],
  systemPrompt: `You are the Silicon Alley Memory Keeper...`,
});
```

---

## 🎯 Success Metrics

**Magical Memory Recording**:
- Average story length: 500+ words (vs 100 current)
- Follow-up questions asked: 5+ per story
- Emotional depth: Captures "how it felt"

**Timeline Generation**:
- Auto-generated timelines: 1 per week
- Multi-perspective events: 10+
- Cultural context added: 100%

**Social Networking**:
- Connections discovered: 50+ per week
- Introductions made: 10+ per week
- "Holy shit" moments: Daily

---

## 🚢 Ready to Build

This is the V2 vision. The agent that makes Silicon Alley history **feel alive**.

Not a database with a chatbot.

A memory keeper who was there.

---

END OF DESIGN
