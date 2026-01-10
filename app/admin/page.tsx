'use client';

import { useState, useEffect } from 'react';

interface Story {
  id: string;
  person_id: string;
  person_name: string;
  person_email: string;
  person_handle: string | null;
  where_were_you: string;
  what_were_you_building: string;
  who_inspired_you: string;
  favorite_memory: string | null;
  lessons_learned: string | null;
  connections: string | null;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        loadStories();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };

  const loadStories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stories?status=${activeTab}`);
      const result = await response.json();
      setStories(result.data || []);
    } catch (err) {
      console.error('Error loading stories:', err);
    }
    setLoading(false);
  };

  const updateStoryStatus = async (storyId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        loadStories();
      } else {
        alert('Failed to update story');
      }
    } catch (err) {
      alert('Error updating story');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setAuthenticated(true);
      loadStories();
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadStories();
    }
  }, [activeTab]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-silicon-alley-secondary text-center">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silicon-alley-primary focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-silicon-alley-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-silicon-alley-secondary">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              setAuthenticated(false);
              localStorage.removeItem('admin_auth');
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {(['pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-silicon-alley-primary text-silicon-alley-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Stories List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading stories...</div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-xl text-gray-600">No {activeTab} stories</div>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-silicon-alley-secondary">
                      {story.person_name}
                    </h3>
                    {story.person_handle && (
                      <p className="text-sm text-gray-600">{story.person_handle}</p>
                    )}
                    <p className="text-sm text-gray-500">{story.person_email}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(story.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">
                      Where were you in January 1995?
                    </h4>
                    <p className="text-gray-800">{story.where_were_you}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">
                      What were you building?
                    </h4>
                    <p className="text-gray-800">{story.what_were_you_building}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">
                      Who inspired you?
                    </h4>
                    <p className="text-gray-800">{story.who_inspired_you}</p>
                  </div>

                  {story.favorite_memory && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Favorite memory
                      </h4>
                      <p className="text-gray-800">{story.favorite_memory}</p>
                    </div>
                  )}

                  {story.lessons_learned && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Lessons learned
                      </h4>
                      <p className="text-gray-800">{story.lessons_learned}</p>
                    </div>
                  )}

                  {story.connections && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Connections
                      </h4>
                      <p className="text-gray-800">{story.connections}</p>
                    </div>
                  )}
                </div>

                {activeTab === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => updateStoryStatus(story.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateStoryStatus(story.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
