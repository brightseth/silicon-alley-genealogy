'use client';

import { useState, useRef } from 'react';

interface PhotoAnalysis {
  people_count: number;
  people_description: string;
  location: string;
  technology: string[];
  cultural_details: string;
  text_visible: string;
  estimated_date: string;
  suggested_questions: string[];
}

interface PhotoUploadProps {
  onAnalysisComplete: (analysis: PhotoAnalysis, imageUrl: string) => void;
}

export default function PhotoUpload({ onAnalysisComplete }: PhotoUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze the photo
    await analyzePhoto(file);
  };

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = (reader.result as string).split(',')[1];

        const response = await fetch('/api/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            mimeType: file.type
          }),
        });

        const result = await response.json();

        if (result.success) {
          setAnalysis(result.analysis);
          onAnalysisComplete(result.analysis, reader.result as string);
        } else {
          alert('Failed to analyze photo: ' + result.error);
        }

        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Error analyzing photo:', error);
      alert('Failed to analyze photo');
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: { files: dataTransfer.files } } as any);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-900 to-slate-900 p-8 rounded-xl text-white">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📸</div>
        <h3 className="text-2xl font-bold mb-2">Photo Analysis (V2)</h3>
        <p className="text-amber-200 text-sm">
          Upload a photo from Silicon Alley days. The AI will analyze it and ask about who's in it.
        </p>
      </div>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-amber-400/50 rounded-xl p-8 text-center hover:border-amber-400 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-amber-200 mb-2">Drop a photo here or click to upload</p>
          <p className="text-xs text-amber-300/70">JPG, PNG, GIF up to 10MB</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Uploaded photo"
              className="w-full max-h-64 object-contain bg-black/20"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-2">🔍</div>
                  <p className="text-amber-200">Analyzing photo...</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && !isAnalyzing && (
            <div className="bg-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-amber-300">What I see:</h4>

              <div className="space-y-2 text-sm">
                {analysis.people_description && (
                  <p><span className="text-amber-400">People:</span> {analysis.people_description}</p>
                )}
                {analysis.location && (
                  <p><span className="text-amber-400">Location:</span> {analysis.location}</p>
                )}
                {analysis.technology && analysis.technology.length > 0 && (
                  <p><span className="text-amber-400">Tech:</span> {analysis.technology.join(', ')}</p>
                )}
                {analysis.cultural_details && (
                  <p><span className="text-amber-400">Vibe:</span> {analysis.cultural_details}</p>
                )}
                {analysis.estimated_date && (
                  <p><span className="text-amber-400">Era:</span> {analysis.estimated_date}</p>
                )}
              </div>

              {analysis.suggested_questions && analysis.suggested_questions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-amber-300 text-sm mb-2">Questions for you:</p>
                  <ul className="space-y-1 text-sm text-amber-100">
                    {analysis.suggested_questions.map((q, idx) => (
                      <li key={idx}>• {q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Upload another */}
          <button
            onClick={() => {
              setPreview(null);
              setAnalysis(null);
            }}
            className="text-sm text-amber-300 hover:text-amber-200 underline"
          >
            Upload a different photo
          </button>
        </div>
      )}
    </div>
  );
}
