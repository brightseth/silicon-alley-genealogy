'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PersonChatProps {
  person: {
    name: string;
    bio: string | null;
    role: string | null;
    era: string | null;
    connections: string[];
  };
}

export default function PersonChat({ person }: PersonChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey! I'm the Silicon Alley memory keeper. Ask me anything about ${person.name}. I know their story, their connections, and the scene they were part of.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          personContext: {
            name: person.name,
            bio: person.bio,
            role: person.role,
            era: person.era,
            connections: person.connections
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.message
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I had trouble answering that. Try asking another way?'
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oops, something went wrong. Try again?'
      }]);
    }

    setIsLoading(false);
  };

  const suggestionQuestions = [
    `What was ${person.name} working on?`,
    `Who did ${person.name} work with?`,
    `What was the Silicon Alley scene like then?`,
  ];

  return (
    <div className="bg-black text-white p-6 rounded-lg border-2 border-silicon-alley-primary shadow-2xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span>💬</span>
          <span>Ask About {person.name}</span>
          <span className="text-xs bg-silicon-alley-primary px-2 py-1 rounded">V2 PREVIEW</span>
        </h3>
        <p className="text-sm text-gray-400">
          The agent that knows Silicon Alley history
        </p>
      </div>

      {/* Messages */}
      <div className="bg-gray-900 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-silicon-alley-primary text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Buttons */}
      {messages.length === 1 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-gray-400">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestionQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-silicon-alley-primary focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-silicon-alley-primary hover:bg-opacity-90 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        💡 In V2, this agent will know all stories, connections, and can guide you through the genealogy
      </p>
    </div>
  );
}
