'use client';

import { useState } from 'react';

interface InterviewAgentProps {
  initialStory: string;
  onComplete: (fullStory: any) => void;
}

export default function InterviewAgent({ initialStory, onComplete }: InterviewAgentProps) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    {
      role: 'assistant',
      content: "Thanks for sharing! Let me ask a few follow-up questions to make your story even richer..."
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const askFollowUp = async (userResponse?: string) => {
    setLoading(true);

    try {
      const conversationHistory = userResponse
        ? [...messages, { role: 'user', content: userResponse }]
        : messages;

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialStory,
          conversationHistory,
          questionCount
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.done) {
          // Interview complete, extract final data
          onComplete(result.extractedData);
        } else {
          // Add follow-up question
          setMessages([
            ...conversationHistory,
            { role: 'assistant', content: result.question }
          ]);
          setQuestionCount(questionCount + 1);
        }
      }
    } catch (error) {
      console.error('Interview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = () => {
    if (!currentInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: currentInput }];
    setMessages(newMessages);
    setCurrentInput('');

    askFollowUp(currentInput);
  };

  const startVoiceResponse = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = reader.result as string;

          // Transcribe the voice response
          const transcribeResponse = await fetch('/api/transcribe-simple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio }),
          });

          const transcribeResult = await transcribeResponse.json();

          if (transcribeResult.success) {
            setCurrentInput(transcribeResult.text);
            const newMessages = [...messages, { role: 'user', content: transcribeResult.text }];
            setMessages(newMessages);
            askFollowUp(transcribeResult.text);
          }
        };

        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 30000); // 30 second max
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  // Start interview automatically
  if (messages.length === 1 && !loading && questionCount === 0) {
    askFollowUp();
  }

  return (
    <div className="bg-white border-2 border-silicon-alley-primary rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎙️</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Interview Mode</h3>
          <p className="text-sm text-gray-600">Let's make your story richer with a few questions</p>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${
            msg.role === 'assistant'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {msg.role === 'assistant' ? '🤖 Agent' : '👤 You'}
            </p>
            <p className="text-gray-900">{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Thinking...</p>
          </div>
        )}
      </div>

      {!loading && questionCount > 0 && questionCount < 3 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitResponse()}
              placeholder="Type your answer..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary"
              disabled={recording}
            />
            <button
              onClick={handleSubmitResponse}
              disabled={!currentInput.trim() || recording}
              className="px-6 py-3 bg-silicon-alley-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={startVoiceResponse}
              disabled={recording}
              className="text-sm text-silicon-alley-primary hover:underline"
            >
              {recording ? '🔴 Recording...' : '🎤 Or answer by voice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
