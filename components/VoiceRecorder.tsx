'use client';

import { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: any) => void;
}

export default function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert to base64 and send to API
        await processAudio(audioBlob);

        // Stop all tracks
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

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Data }),
        });

        const result = await response.json();

        if (result.success) {
          onTranscriptionComplete(result.data);
        } else {
          alert('Transcription failed: ' + result.error);
        }

        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process recording');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-silicon-alley-primary to-silicon-alley-secondary p-8 rounded-lg shadow-xl border-2 border-silicon-alley-primary">
      <div className="text-center">
        <div className="text-4xl mb-4">🎤</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Voice Recording (V2 Preview!)
        </h3>
        <p className="text-white/90 mb-6 leading-relaxed">
          Just talk. Tell your Silicon Alley story naturally.
          The AI will transcribe and structure it for you.
        </p>

        {!isRecording && !isProcessing && !audioURL && (
          <button
            onClick={startRecording}
            className="bg-white text-silicon-alley-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            🎤 Start Recording
          </button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Recording...</span>
            </div>
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-lg"
            >
              ⬛ Stop Recording
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-white">
            <div className="text-xl mb-2">Processing your story...</div>
            <div className="text-sm opacity-80">
              Claude is transcribing and extracting the key details
            </div>
          </div>
        )}

        {audioURL && !isProcessing && (
          <div className="space-y-4">
            <div className="text-white text-lg">✅ Recording complete!</div>
            <audio src={audioURL} controls className="w-full" />
            <button
              onClick={() => {
                setAudioURL(null);
                chunksRef.current = [];
              }}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Record Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-white/70 text-sm text-center">
          💡 <strong>Tip:</strong> Speak naturally. Mention people, companies, places.
          The agent will ask follow-up questions in V2!
        </p>
      </div>
    </div>
  );
}
