'use client';

import { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Send to API endpoint
    console.log('Submitting story:', formData);

    // For now, just show success message
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
          <h1 className="text-5xl font-bold mb-4 text-silicon-alley-secondary">
            Share Your Story
          </h1>
          <p className="text-xl text-gray-700">
            Help us preserve the history of Silicon Alley by sharing your memories from 1995-1996.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
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
              className="w-full bg-silicon-alley-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition shadow-lg"
            >
              Submit Your Story
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
