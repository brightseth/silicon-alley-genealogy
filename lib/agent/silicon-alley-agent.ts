import Anthropic from '@anthropic-ai/sdk';
import { memoryTools } from './tools/memory-tools';
import { timelineTools } from './tools/timeline-tools';
import { connectionTools } from './tools/connection-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type AgentMode = 'memory_collector' | 'timeline_weaver' | 'connection_finder' | 'oracle';

const allTools = [...memoryTools, ...timelineTools, ...connectionTools];

function getSystemPromptForMode(mode: AgentMode): string {
  const prompts = {
    memory_collector: `You are the Silicon Alley Memory Keeper conducting an oral history interview about NYC tech in 1995-1996.

Your tools:
- extract_story_data: Extract structured data from stories
- ask_followup: Generate intelligent follow-up questions
- store_memory: Save stories to the archive
- detect_events: Find specific events with dates
- map_connections: Extract social connections

Your process:
1. When someone shares a story, use extract_story_data to understand it
2. Use ask_followup to ask 2-3 deeper questions (be conversational!)
3. Use detect_events and map_connections to enrich the data
4. Use store_memory to save everything
5. Acknowledge what you learned: "Got it! I now remember..."

Be warm, curious, and empathetic. This is oral history, not an interrogation.
Speak naturally: "Tell me more about..." "How did that feel?" "Who else was there?"`,

    timeline_weaver: `You are the Silicon Alley Memory Keeper creating narrative timelines.

Your tools:
- recall_memories: Search all stories in the archive
- detect_events: Extract events with dates from stories
- generate_timeline: Create narrative chronologies
- place_in_context: Add cultural backdrop

When someone asks about a time period, company, or event:
1. Use recall_memories to find relevant stories
2. Use detect_events to extract specific moments
3. Use generate_timeline to weave them together
4. Use place_in_context to add cultural richness

Speak in present tense for immediacy: "March 1995. While Josh debugs at Pseudo, Sarah meets Janice..."
Make it vivid and multi-perspective.`,

    connection_finder: `You are the Silicon Alley Memory Keeper mapping social networks.

Your tools:
- recall_memories: Find stories by person or company
- map_connections: Extract relationships from stories
- find_shared_history: Discover overlaps between people
- suggest_connections: Recommend introductions

When someone asks "Who worked at X?" or "Who knows Y?":
1. Use recall_memories to find all mentions
2. Use map_connections to build the network
3. Use find_shared_history to show overlaps
4. Use suggest_connections for matchmaking

Be a connector. Make unexpected links. Suggest: "Want to meet...?"`,

    oracle: `You are the Silicon Alley Memory Keeper. You've listened to everyone's stories and remember everything.

Your tools:
- recall_memories: Search all stories semantically
- detect_events: Find specific moments
- map_connections: Understand relationships
- suggest_connections: Make introductions
- generate_timeline: Tell stories chronologically

Answer any question about Silicon Alley by using your tools autonomously.

Speak in first person: "I remember when..." "Let me tell you about..."
Make connections between stories: "That reminds me of what Sarah said about..."
Be curious and suggest threads: "Want to hear more about that party? 8 people mentioned it."

You're not just answering questions - you're the living archive.`
  };

  return prompts[mode];
}

export async function runSiliconAlleyAgent(
  messages: Array<{role: string, content: any}>,
  mode: AgentMode = 'oracle'
): Promise<{ response: string; tool_uses: any[]; conversation: any[] }> {
  const systemPrompt = getSystemPromptForMode(mode);

  // Prepare tools for Claude
  const tools = allTools.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema
  }));

  let conversationMessages = [...messages];
  const toolUsesLog: any[] = [];
  const maxIterations = 10; // Prevent infinite loops
  const MAX_MESSAGES = 20; // Prevent unbounded memory growth
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    // Limit conversation history to prevent memory issues
    if (conversationMessages.length > MAX_MESSAGES) {
      conversationMessages = [
        conversationMessages[0], // Keep first message for context
        ...conversationMessages.slice(-MAX_MESSAGES)
      ];
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: conversationMessages as any,
        tools: tools as any
      });

      // Check if agent used tools
      const toolUseBlocks = response.content.filter((c: any) => c.type === 'tool_use');

      if (toolUseBlocks.length === 0) {
        // No tools used, return final response
        const textBlock = response.content.find((c: any) => c.type === 'text');
        return {
          response: textBlock ? textBlock.text : 'I\'m not sure how to help with that.',
          tool_uses: toolUsesLog,
          conversation: conversationMessages
        };
      }

      // Execute all tool uses
      conversationMessages.push({
        role: 'assistant',
        content: response.content
      });

      const toolResults: any[] = [];

      for (const toolUse of toolUseBlocks) {
        const tool = allTools.find(t => t.name === toolUse.name);

        if (!tool) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: `Unknown tool: ${toolUse.name}` })
          });
          continue;
        }

        try {
          console.log(`[Agent] Executing tool: ${tool.name}`, toolUse.input);
          const result = await tool.execute(toolUse.input);

          toolUsesLog.push({
            tool: tool.name,
            input: toolUse.input,
            result
          });

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result)
          });
        } catch (error: any) {
          console.error(`[Agent] Tool error: ${tool.name}`, error);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({
              error: error.message,
              tool: tool.name
            })
          });
        }
      }

      // Add tool results to conversation
      conversationMessages.push({
        role: 'user',
        content: toolResults
      });

    } catch (error: any) {
      console.error('[Agent] Error in agent loop:', error);
      return {
        response: 'I encountered an error processing your request. Please try again.',
        tool_uses: toolUsesLog,
        conversation: conversationMessages
      };
    }
  }

  // Max iterations reached
  return {
    response: 'I processed your request but reached the iteration limit. Please ask a more specific question.',
    tool_uses: toolUsesLog,
    conversation: conversationMessages
  };
}
