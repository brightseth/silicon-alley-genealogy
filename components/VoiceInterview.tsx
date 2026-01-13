'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTranscription?: boolean;
}

interface ExtractedData {
  name?: string;
  handle?: string;
  email?: string;
  whereWereYou?: string;
  whatWereYouBuilding?: string;
  whoInspiredYou?: string;
  favoriteMemory?: string;
  lessonsLearned?: string;
  connections?: string;
}

interface VoiceInterviewProps {
  onComplete: (data: ExtractedData) => void;
}

export default function VoiceInterview({ onComplete }: VoiceInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [showReview, setShowReview] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setInterviewStarted(true);
    // Agent opens the conversation
    const openingMessage = "Hey! I'm the Silicon Alley memory keeper. I'm collecting stories from people who were part of NYC's first tech scene. Just talk naturally - tell me your story, and I'll ask follow-up questions to get the details.\n\nLet's start simple: **What's your name, and where were you in January 1995?**";
    setMessages([{ role: 'assistant', content: openingMessage }]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        // First, transcribe
        const transcribeResponse = await fetch('/api/transcribe-simple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Data }),
        });

        const transcribeResult = await transcribeResponse.json();

        if (!transcribeResult.success) {
          alert('Transcription failed. Try again?');
          setIsProcessing(false);
          return;
        }

        const userText = transcribeResult.text;

        // Add user message
        const newMessages: Message[] = [...messages, {
          role: 'user',
          content: userText,
          isTranscription: true
        }];
        setMessages(newMessages);

        // Send to interview agent for follow-up
        const interviewResponse = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationHistory: newMessages,
            currentExtraction: extractedData
          }),
        });

        const interviewResult = await interviewResponse.json();

        if (interviewResult.success) {
          // Update extracted data
          if (interviewResult.extractedData) {
            setExtractedData(prev => ({
              ...prev,
              ...interviewResult.extractedData
            }));
          }

          // Check if interview is complete
          if (interviewResult.isComplete) {
            setShowReview(true);
          }

          // Add agent response
          setMessages([...newMessages, {
            role: 'assistant',
            content: interviewResult.response
          }]);
        } else {
          setMessages([...newMessages, {
            role: 'assistant',
            content: "I didn't quite catch that. Could you tell me more?"
          }]);
        }

        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process recording');
      setIsProcessing(false);
    }
  };

  const handleTextInput = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: newMessages,
          currentExtraction: extractedData
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.extractedData) {
          setExtractedData(prev => ({
            ...prev,
            ...result.extractedData
          }));
        }

        if (result.isComplete) {
          setShowReview(true);
        }

        setMessages([...newMessages, {
          role: 'assistant',
          content: result.response
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    onComplete(extractedData);
  };

  if (!interviewStarted) {
    return (
      <div className="bg-gradient-to-br from-purple-900 to-slate-900 p-8 rounded-xl text-white text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h3 className="text-2xl font-bold mb-4">Voice Interview (V2)</h3>
        <p className="text-purple-200 mb-6 leading-relaxed max-w-md mx-auto">
          Have a conversation with the Silicon Alley memory keeper.
          Just talk naturally - the agent will ask follow-up questions
          to capture your full story.
        </p>
        <button
          onClick={startInterview}
          className="bg-white text-purple-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-100 transition"
        >
          Start Interview
        </button>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="bg-gradient-to-br from-green-900 to-slate-900 p-8 rounded-xl text-white">
        <h3 className="text-2xl font-bold mb-4">Review Your Story</h3>
        <p className="text-green-200 mb-6">Here's what I captured from our conversation:</p>

        <div className="space-y-4 bg-white/10 p-6 rounded-lg mb-6">
          {extractedData.name && (
            <div>
              <span className="font-semibold text-green-300">Name:</span> {extractedData.name}
            </div>
          )}
          {extractedData.whereWereYou && (
            <div>
              <span className="font-semibold text-green-300">Where you were:</span> {extractedData.whereWereYou}
            </div>
          )}
          {extractedData.whatWereYouBuilding && (
            <div>
              <span className="font-semibold text-green-300">What you built:</span> {extractedData.whatWereYouBuilding}
            </div>
          )}
          {extractedData.whoInspiredYou && (
            <div>
              <span className="font-semibold text-green-300">Who inspired you:</span> {extractedData.whoInspiredYou}
            </div>
          )}
          {extractedData.favoriteMemory && (
            <div>
              <span className="font-semibold text-green-300">Favorite memory:</span> {extractedData.favoriteMemory}
            </div>
          )}
          {extractedData.connections && (
            <div>
              <span className="font-semibold text-green-300">Connections:</span> {extractedData.connections}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowReview(false)}
            className="flex-1 bg-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            Add More Details
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition"
          >
            Submit Story
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-xl overflow-hidden">
      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white border border-white/20'
            }`}>
              {msg.isTranscription && (
                <span className="text-xs text-purple-200 block mb-1">🎤 Transcribed</span>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl">
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

      {/* Recording Controls */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-lg text-white transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🎤</span>
            <span>Tap to Speak</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-lg text-white transition flex items-center justify-center gap-3 animate-pulse"
          >
            <span className="text-2xl">⏹</span>
            <span>Recording... Tap to Stop</span>
          </button>
        )}

        {/* Text fallback */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Or type your response..."
            disabled={isProcessing || isRecording}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>

        {/* Progress indicator */}
        {Object.keys(extractedData).length > 0 && (
          <div className="mt-3 text-xs text-purple-300">
            Captured: {Object.keys(extractedData).filter(k => extractedData[k as keyof ExtractedData]).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
