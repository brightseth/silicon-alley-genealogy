'use client';

import { useEffect, useState } from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  people: Array<{ name: string; handle: string }>;
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        setEvents(data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading timeline:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-silicon-alley-secondary">
            Silicon Alley Timeline
          </h1>
          <p className="text-xl text-gray-700">
            The genealogy of how it all began (1994-1996)
          </p>
        </div>

        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="timeline-node bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-semibold text-silicon-alley-accent mb-2">
                {formatDate(event.date)}
                {event.location && (
                  <span className="ml-3 text-gray-500 font-normal">📍 {event.location}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-silicon-alley-secondary">
                {event.title}
              </h3>
              <p className="text-gray-700 mb-4">{event.description}</p>
              {event.people && event.people.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.people.map((person, i) => (
                    <span
                      key={i}
                      className="inline-block bg-silicon-alley-primary/10 text-silicon-alley-primary px-3 py-1 rounded-full text-sm"
                    >
                      {person.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-silicon-alley-secondary">
            This timeline is incomplete
          </h2>
          <p className="text-gray-700 mb-6">
            Help us fill in the gaps. What's missing? Who should be here? What events shaped your journey?
          </p>
          <a
            href="/submit"
            className="inline-block bg-silicon-alley-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Add Your Story
          </a>
        </div>
      </div>
    </div>
  );
}
