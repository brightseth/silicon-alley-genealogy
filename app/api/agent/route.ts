import { NextRequest, NextResponse } from 'next/server';
import { runSiliconAlleyAgent, AgentMode } from '@/lib/agent/silicon-alley-agent';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for agent processing

export async function POST(request: NextRequest) {
  try {
    const { messages, mode = 'oracle' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({
        success: false,
        error: 'Messages array required'
      }, { status: 400 });
    }

    // Validate mode
    const validModes: AgentMode[] = ['memory_collector', 'timeline_weaver', 'connection_finder', 'oracle'];
    const agentMode = validModes.includes(mode as AgentMode) ? (mode as AgentMode) : 'oracle';

    console.log(`[API] Running Silicon Alley Agent in ${agentMode} mode`);
    console.log(`[API] Messages:`, JSON.stringify(messages, null, 2));

    // Run the agent
    const result = await runSiliconAlleyAgent(messages, agentMode);

    console.log(`[API] Agent completed. Tools used: ${result.tool_uses.length}`);

    return NextResponse.json({
      success: true,
      response: result.response,
      tool_uses: result.tool_uses,
      mode: agentMode,
      tool_count: result.tool_uses.length
    });

  } catch (error: any) {
    console.error('[API] Agent error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Agent processing failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
