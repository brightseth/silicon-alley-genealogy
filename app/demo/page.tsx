'use client';

import { useState, useRef, useEffect } from 'react';

export default function DemoPage() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setShowWelcome(false);
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          mode: 'oracle'
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: result.response
        }]);
      } else {
        setMessages([...newMessages, {
          role: 'assistant',
          content: 'Sorry, something went wrong. Try again?'
        }]);
      }
    } catch (error) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Connection error. Try again?'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Microphone access required');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setLoading(true);
    setShowWelcome(false);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        });

        const result = await response.json();

        if (result.success && result.data.transcription) {
          await sendMessage(result.data.transcription);
        } else {
          setLoading(false);
          alert('Transcription failed. Try typing instead?');
        }
      } catch (error) {
        setLoading(false);
        alert('Error processing audio');
      }
    };
  };

  const quickPrompts = [
    "Tell me about Silicon Alley",
    "Who worked at Razorfish?",
    "What happened in 1995?",
    "Tell me about Pseudo"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-lg mx-auto h-screen flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-white/10 backdrop-blur-sm bg-black/20">
          <h1 className="text-2xl font-bold tracking-tight">Silicon Alley</h1>
          <p className="text-sm text-purple-300 mt-1">Memory Keeper · 1995-1996</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {showWelcome && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl mb-4">🗽</div>
              <h2 className="text-2xl font-bold mb-2">Silicon Alley Archive</h2>
              <p className="text-purple-300 mb-8 px-6">
                I remember everyone's stories from NYC tech in the '90s. Ask me anything, or share your own.
              </p>

              {/* Quick Prompts */}
              <div className="space-y-2 px-4">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-sm transition-all active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm bg-black/20">

          {/* Voice Button */}
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={loading}
              className="w-full mb-3 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-semibold text-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🎤</span>
              <span>Tap to Share Your Story</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-full mb-3 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-semibold text-lg active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse"
            >
              <span className="text-2xl">⏹</span>
              <span>Recording... Tap to Stop</span>
            </button>
          )}

          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Or type your question..."
              disabled={loading || isRecording}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim() || isRecording}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold active:scale-95 transition-all disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
