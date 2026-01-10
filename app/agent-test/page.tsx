'use client';

import { useState } from 'react';

export default function AgentTestPage() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'memory_collector' | 'timeline_weaver' | 'connection_finder' | 'oracle'>('oracle');
  const [loading, setLoading] = useState(false);
  const [toolUses, setToolUses] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          mode
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: result.response
        }]);
        setToolUses(result.tool_uses || []);
      } else {
        setMessages([...newMessages, {
          role: 'assistant',
          content: `Error: ${result.error}`
        }]);
      }
    } catch (error: any) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const testStories = [
    'I was working at Razorfish in 1995, building early websites for big brands.',
    'Tell me about Pseudo in March 1995',
    'Who else worked at Razorfish?',
    'Generate a timeline for 1995'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Silicon Alley Agent Test</h1>
          <p className="text-gray-600 mb-4">Testing the autonomous agent with tool use</p>

          {/* Mode Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('oracle')}
              className={`px-4 py-2 rounded ${mode === 'oracle' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Oracle
            </button>
            <button
              onClick={() => setMode('memory_collector')}
              className={`px-4 py-2 rounded ${mode === 'memory_collector' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Memory Collector
            </button>
            <button
              onClick={() => setMode('timeline_weaver')}
              className={`px-4 py-2 rounded ${mode === 'timeline_weaver' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Timeline Weaver
            </button>
            <button
              onClick={() => setMode('connection_finder')}
              className={`px-4 py-2 rounded ${mode === 'connection_finder' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Connection Finder
            </button>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            {testStories.map((story, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(story);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Test: {story.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">No messages yet. Ask the agent something!</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-right'
                  : 'bg-gray-100 text-left'
              }`}>
                <p className="text-xs font-semibold mb-1 text-gray-600">
                  {msg.role === 'user' ? 'You' : 'Agent'}
                </p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center text-gray-500">
              <p>Agent thinking and using tools...</p>
            </div>
          )}
        </div>

        {/* Tool Uses Log */}
        {toolUses.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Tools Used ({toolUses.length}):</h3>
            {toolUses.map((use, idx) => (
              <div key={idx} className="mb-2 text-sm">
                <span className="font-mono bg-green-100 px-2 py-1 rounded">{use.tool}</span>
                <p className="text-xs text-gray-600 mt-1">
                  Input: {JSON.stringify(use.input).substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask the agent anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Mode: {mode} | Agent will autonomously use tools to answer
        </p>
      </div>
    </div>
  );
}
