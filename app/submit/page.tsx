'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import LinkedInExtract from '@/components/LinkedInExtract';

export default function SubmitStory() {
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    whereWereYou: '',
    whatWereYouBuilding: '',
    whoInspiredYou: '',
    favoriteMemory: '',
    lessonsLearned: '',
    connections: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(true);

  const handleVoiceTranscription = (data: any) => {
    // Auto-fill form with transcribed data
    setFormData({
      name: data.name || '',
      handle: data.handle || '',
      email: data.email || '',
      whereWereYou: data.whereWereYou || '',
      whatWereYouBuilding: data.whatWereYouBuilding || '',
      whoInspiredYou: data.whoInspiredYou || '',
      favoriteMemory: data.favoriteMemory || '',
      lessonsLearned: data.lessonsLearned || '',
      connections: data.connections || '',
    });

    // Scroll to form
    setShowVoice(false);
    setTimeout(() => {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }, 100);
  };

  const handleLinkedInExtract = (data: any) => {
    // Build story suggestions from LinkedIn jobs
    let whereWereYou = '';
    let whatWereYouBuilding = '';

    if (data.jobs && data.jobs.length > 0) {
      const jobs = data.jobs.filter((j: any) =>
        j.startDate && (j.startDate.includes('1994') || j.startDate.includes('1995') || j.startDate.includes('1996'))
      );

      if (jobs.length > 0) {
        whereWereYou = jobs.map((j: any) => `${j.company} (${j.location || 'NYC'})`).join(', ');
        whatWereYouBuilding = jobs.map((j: any) => `${j.role} at ${j.company}`).join('; ');
      }
    }

    setFormData({
      ...formData,
      name: data.name || formData.name,
      whereWereYou: whereWereYou || formData.whereWereYou,
      whatWereYouBuilding: whatWereYouBuilding || formData.whatWereYouBuilding,
    });

    setShowVoice(false);
    setTimeout(() => {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            handle: '',
            email: '',
            whereWereYou: '',
            whatWereYouBuilding: '',
            whoInspiredYou: '',
            favoriteMemory: '',
            lessonsLearned: '',
            connections: '',
          });
        }, 3000);
      } else {
        setLoading(false);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Submission error:', error);
      alert('Failed to submit story. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold mb-4 text-silicon-alley-primary">
            Thank You!
          </h1>
          <p className="text-xl text-gray-700">
            Your story has been submitted and will be added to the Silicon Alley genealogy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-black">
            Share Your Story
          </h1>
          <p className="text-xl text-gray-900 mb-2">
            Help us preserve the history of Silicon Alley by sharing your memories from 1995-1996.
          </p>
          <p className="text-sm text-silicon-alley-primary font-semibold">
            ⚡ NEW: Try voice recording (V2 preview)
          </p>
        </div>

        {/* Voice Recorder - V2 Preview */}
        {showVoice && (
          <div className="mb-8">
            <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
          </div>
        )}

        {/* LinkedIn Auto-Extract - V2 Preview */}
        {showVoice && (
          <div className="mb-12">
            <LinkedInExtract onExtractComplete={handleLinkedInExtract} />
          </div>
        )}

        {/* Divider */}
        <div className="text-center my-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-600">
                {showVoice ? 'Or use the traditional form below' : 'Review and edit your story'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-silicon-alley-secondary border-b pb-2">
              About You
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="e.g., Seth Goldstein"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Handle/Username (Twitter, GitHub, or preferred handle)
              </label>
              <input
                type="text"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="e.g., @sethgoldstein"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to send you your player card NFT
              </p>
            </div>
          </div>

          {/* Story Questions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-silicon-alley-secondary border-b pb-2">
              Your Silicon Alley Story
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Where were you in January 1995? *
              </label>
              <p className="text-sm text-gray-600 mb-2">
                What neighborhood? What office? What café? Paint us a picture.
              </p>
              <textarea
                name="whereWereYou"
                required
                value={formData.whereWereYou}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="I was working out of a loft on Broadway and Houston..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2. What were you building? *
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Company, project, website, dream? What consumed your days?
              </p>
              <textarea
                name="whatWereYouBuilding"
                required
                value={formData.whatWereYouBuilding}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="I started SiteSpecific in August 1995..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                3. Who inspired you? *
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Name the people, companies, or moments that shaped your journey.
              </p>
              <textarea
                name="whoInspiredYou"
                required
                value={formData.whoInspiredYou}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="John Borthwick at Web Partner Studio, Janice..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                4. What's your favorite memory?
              </label>
              <p className="text-sm text-gray-600 mb-2">
                A moment, a party, a launch, a failure, a breakthrough?
              </p>
              <textarea
                name="favoriteMemory"
                value={formData.favoriteMemory}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="The night we launched..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                5. What did you learn?
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Looking back 30 years, what lessons stand out?
              </p>
              <textarea
                name="lessonsLearned"
                value={formData.lessonsLearned}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="Community matters more than technology..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                6. Who should we talk to?
              </label>
              <p className="text-sm text-gray-600 mb-2">
                List names of other Silicon Alley pioneers (helps us build the genealogy)
              </p>
              <textarea
                name="connections"
                value={formData.connections}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="Fred Wilson, Janice Fraser, Jason Calacanis..."
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-silicon-alley-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Your Story'}
            </button>
            <p className="text-sm text-gray-500 text-center mt-4">
              By submitting, you agree to have your story included in the Silicon Alley genealogy
              and displayed at the 30th anniversary celebration.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
