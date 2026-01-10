# Claude Agent SDK Implementation - Action Plan
**Status**: Ready to implement
**Goal**: Transform V1.5 into a true agentic system

---

## 🎯 What We're Building

A **Silicon Alley Memory Keeper** agent with autonomous tool use:

### Core Capabilities:
1. **Memory Extraction** - Listens to stories, extracts structured data
2. **Timeline Generation** - Creates narrative timelines from memories
3. **Connection Mapping** - Discovers social networks automatically
4. **Oracle Mode** - Answers questions using all stories

### The Magic:
- Agent decides which tools to use autonomously
- Multi-turn conversations with memory
- Real-time learning from new stories
- Proactive suggestions ("Want to connect with...")

---

## 📦 What's Already Working (V1.5)

✅ Voice transcription (Whisper)
✅ Form submission to database
✅ Basic agent chat (stateless API calls)
✅ LinkedIn extraction
✅ Interview follow-ups

**What's Missing**: True agentic autonomy with tool use

---

## 🚀 Implementation Steps

### **Step 1: Agent Tools** (TODAY)

Create TypeScript tool definitions in `/lib/agent/tools/`:

**memory-tools.ts**:
- `extract_story_data` - Extract JSON from raw text
- `store_memory` - Save to Postgres
- `recall_memories` - Query database
- `ask_followup` - Generate intelligent questions

**timeline-tools.ts**:
- `detect_events` - Extract events with dates
- `generate_timeline` - Create chronological view
- `place_in_context` - Add cultural backdrop

**connection-tools.ts**:
- `map_connections` - Build social graph
- `find_shared_history` - Discover overlaps
- `suggest_connections` - Matchmaking

---

### **Step 2: Agent Definition** (TOMORROW)

Create `/lib/agent/silicon-alley-agent.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { memoryTools } from './tools/memory-tools';
import { timelineTools } from './tools/timeline-tools';
import { connectionTools } from './tools/connection-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function runSiliconAlleyAgent(
  messages: Array<{role: string, content: string}>,
  mode: 'memory_collector' | 'timeline_weaver' | 'connection_finder' | 'oracle'
) {
  const tools = [
    ...memoryTools,
    ...timelineTools,
    ...connectionTools
  ];

  const systemPrompt = getSystemPromptForMode(mode);

  let response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages,
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema
    }))
  });

  // Handle tool use
  while (response.stop_reason === 'tool_use') {
    const toolUse = response.content.find(c => c.type === 'tool_use');
    if (!toolUse) break;

    // Execute tool
    const tool = tools.find(t => t.name === toolUse.name);
    const result = await tool.execute(toolUse.input);

    // Continue conversation
    messages.push({
      role: 'assistant',
      content: response.content
    });
    messages.push({
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: JSON.stringify(result)
      }]
    });

    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      tools: tools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema
      }))
    });
  }

  return response;
}
```

---

### **Step 3: Agent Modes** (DAY 3)

Create mode-specific system prompts:

**Memory Collector Mode**:
```
You are conducting an oral history interview about Silicon Alley in 1995-1996.

Your tools:
- extract_story_data: Get structured data from stories
- ask_followup: Generate intelligent follow-up questions
- store_memory: Save to database

Process:
1. Extract data from initial story
2. Ask 3-5 follow-up questions to deepen it
3. Store the enriched memory

Be conversational, curious, and empathetic.
```

**Timeline Weaver Mode**:
```
You generate narrative timelines from Silicon Alley memories.

Your tools:
- recall_memories: Get relevant stories
- detect_events: Extract events with dates
- generate_timeline: Create chronological view

When someone asks about a time period, company, or event:
1. Recall all relevant memories
2. Extract specific events
3. Weave them into a multi-perspective narrative
```

**Oracle Mode**:
```
You are the Silicon Alley Memory Keeper. You've heard everyone's stories.

Your tools:
- recall_memories: Search all stories
- map_connections: Find social networks
- suggest_connections: Matchmake

Speak in first person: "I remember when..."
Make connections between stories.
Suggest interesting threads to explore.
```

---

### **Step 4: Unified Agent Endpoint** (DAY 4)

Replace current `/api/chat` with `/api/agent`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runSiliconAlleyAgent } from '@/lib/agent/silicon-alley-agent';

export async function POST(request: NextRequest) {
  const { messages, mode = 'oracle' } = await request.json();

  const response = await runSiliconAlleyAgent(messages, mode);

  return NextResponse.json({
    success: true,
    response: response.content[0].text,
    tool_uses: response.content.filter(c => c.type === 'tool_use')
  });
}
```

---

### **Step 5: Frontend Integration** (DAY 5)

Update components to use agent:

**Voice Recording Flow**:
```typescript
// After transcription
const agentResponse = await fetch('/api/agent', {
  method: 'POST',
  body: JSON.stringify({
    mode: 'memory_collector',
    messages: [{
      role: 'user',
      content: `I just recorded this story: "${transcribedText}"`
    }]
  })
});
// Agent automatically extracts data, asks follow-ups, stores memory
```

**Timeline Generation**:
```typescript
// When user clicks "Generate Timeline"
const agentResponse = await fetch('/api/agent', {
  method: 'POST',
  body: JSON.stringify({
    mode: 'timeline_weaver',
    messages: [{
      role: 'user',
      content: 'Generate a timeline for 1995'
    }]
  })
});
// Agent recalls memories, detects events, creates narrative
```

---

## 🎨 The Magical User Experience

### **Memory Recording**:
User: *clicks record, speaks for 2 minutes*

Agent: "Thanks for sharing! I noticed you mentioned that night at Pseudo. Tell me more about what that felt like..."

User: *answers*

Agent: "Interesting. Who else was there that you remember?"

User: *answers*

Agent: "Got it! I've saved your story. I noticed you and 3 other people mentioned that party. Want to see who else was there?"

---

### **Timeline Generation**:
User: "What happened in March 1995?"

Agent: *uses recall_memories tool* "Let me see..." *uses detect_events tool* "Ah yes, March 1995 was intense.

While Josh was debugging at Pseudo (servers crashed twice on launch night), Sarah was upstairs meeting Janice for the first time. That connection led to the Web Partner Studio collaboration in June.

Meanwhile, Seth was wrapping up at Agency.com, about to launch SiteSpecific in August.

Want to see the full timeline?"

---

### **Connection Discovery**:
User: "Who else worked at Razorfish?"

Agent: *uses recall_memories with company filter* "I have stories from 12 people who mentioned Razorfish!" *uses map_connections* "Here's the network graph...

Interesting: 5 of them later founded their own companies. 3 are also in this archive. Want an introduction?"

---

## 📊 Success Metrics

**Agent Autonomy**:
- Tool use per conversation: 3-5 tools
- Autonomous decisions: 90%+ correct
- Multi-turn conversations: 5-10 turns average

**User Delight**:
- "Wow" reactions: Daily
- Story richness: 3x longer than manual forms
- Connections discovered: 50+ per week

---

## 🚢 Deployment

Once agent is built:
1. Deploy to Vercel (same as current)
2. All existing API routes still work
3. New `/api/agent` endpoint for agentic mode
4. Progressive enhancement (fallback to old chat if agent fails)

---

## 🎯 TODAY'S ACTION ITEMS

1. Create tool definitions in `/lib/agent/tools/`
2. Test each tool individually
3. Build basic agent loop with tool use
4. Replace `/api/chat` with agent version
5. Test end-to-end memory collection

**Let's build the magic! ✨**

