'use client';

import { useState } from 'react';

interface LinkedInExtractProps {
  onExtractComplete: (data: any) => void;
}

export default function LinkedInExtract({ onExtractComplete }: LinkedInExtractProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      setError('Please enter a valid LinkedIn URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/linkedin-extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      const result = await response.json();

      if (result.success) {
        onExtractComplete(result.data);
      } else {
        setError(result.error || 'Failed to extract LinkedIn data');
      }
    } catch (err: any) {
      console.error('LinkedIn extract error:', err);
      setError('Failed to extract LinkedIn data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💼</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            LinkedIn Auto-Fill
          </h3>
          <p className="text-sm text-gray-600">
            Paste your LinkedIn URL to auto-populate your work history
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://www.linkedin.com/in/yourname"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          onClick={handleExtract}
          disabled={loading || !linkedinUrl}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Extracting...' : 'Auto-Fill'}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        We'll extract your 1994-1996 work history to help tell your Silicon Alley story
      </p>
    </div>
  );
}
