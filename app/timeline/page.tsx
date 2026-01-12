'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  people: Array<{ name: string; handle: string }>;
}

// Hardcoded events for demo until DB is seeded
const DEMO_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: '1994-10-01',
    title: 'Netscape Navigator Ships',
    description: 'The browser that changed everything. Suddenly, the web has pictures, and New York developers start paying attention.',
    event_type: 'launch',
    location: 'Mountain View, CA',
    people: []
  },
  {
    id: '2',
    date: '1995-01-15',
    title: 'Silicon Alley is Born',
    description: 'The term "Silicon Alley" starts circulating among NYC tech circles. The Flatiron district becomes ground zero for a new kind of company.',
    event_type: 'moment',
    location: 'Flatiron, NYC',
    people: [{ name: 'Mark Stahlman', handle: '' }]
  },
  {
    id: '3',
    date: '1995-03-01',
    title: 'Razorfish Founded',
    description: 'Craig Kanarick and Jeff Dachis start Razorfish in a downtown loft. They\'ll grow to define digital agency culture.',
    event_type: 'company',
    location: 'SoHo, NYC',
    people: [{ name: 'Craig Kanarick', handle: '' }, { name: 'Jeff Dachis', handle: '' }]
  },
  {
    id: '4',
    date: '1995-06-01',
    title: 'DoubleClick Launches',
    description: 'Kevin O\'Connor and Dwight Merriman create the ad server that will power the commercial internet. Digital advertising is born.',
    event_type: 'company',
    location: 'Midtown, NYC',
    people: [{ name: 'Kevin O\'Connor', handle: '' }, { name: 'Dwight Merriman', handle: '' }]
  },
  {
    id: '5',
    date: '1995-09-01',
    title: 'Pseudo Programs Goes Live',
    description: 'Josh Harris\'s Pseudo.com starts broadcasting. Part TV station, part commune, part performance art. The world\'s first internet TV network.',
    event_type: 'launch',
    location: 'SoHo, NYC',
    people: [{ name: 'Josh Harris', handle: '' }]
  },
  {
    id: '6',
    date: '1995-11-01',
    title: 'Total New York Launches',
    description: 'John Borthwick and team create Total New York, the city guide that showed NYC what the web could be.',
    event_type: 'launch',
    location: 'NYC',
    people: [{ name: 'John Borthwick', handle: '' }]
  },
  {
    id: '7',
    date: '1996-01-01',
    title: '@NY Magazine Debuts',
    description: 'Jason Calacanis launches Silicon Alley Reporter (later @NY), the essential chronicle of the scene. Now there\'s a paper trail.',
    event_type: 'launch',
    location: 'NYC',
    people: [{ name: 'Jason Calacanis', handle: '' }]
  },
  {
    id: '8',
    date: '1996-03-15',
    title: 'Flatiron Partners Forms',
    description: 'Fred Wilson and Jerry Colonna start the first VC firm focused on Silicon Alley. Now there\'s serious money.',
    event_type: 'company',
    location: 'Flatiron, NYC',
    people: [{ name: 'Fred Wilson', handle: '' }, { name: 'Jerry Colonna', handle: '' }]
  },
  {
    id: '9',
    date: '1996-06-01',
    title: 'iVillage Launches',
    description: 'Nancy Evans and Candice Carpenter create iVillage, proving the web can build communities. Women lead the way.',
    event_type: 'launch',
    location: 'NYC',
    people: [{ name: 'Nancy Evans', handle: '' }, { name: 'Candice Carpenter', handle: '' }]
  },
  {
    id: '10',
    date: '1996-11-01',
    title: 'TheGlobe.com IPO',
    description: 'TheGlobe.com goes public with the largest first-day gain in Wall Street history. 606% pop. The boom is on.',
    event_type: 'funding',
    location: 'Wall Street, NYC',
    people: [{ name: 'Stephan Paternot', handle: '' }, { name: 'Todd Krizelman', handle: '' }]
  }
];

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        // Use API data if available, otherwise use demo events
        const apiEvents = data.data || [];
        setEvents(apiEvents.length > 0 ? apiEvents : DEMO_EVENTS);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading timeline:', error);
        setEvents(DEMO_EVENTS);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'company': return '🏢';
      case 'launch': return '🚀';
      case 'funding': return '💰';
      case 'acquisition': return '🤝';
      case 'moment': return '⚡';
      default: return '📌';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Header */}
      <div className="bg-black py-16 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-mono text-silicon-alley-accent mb-4 tracking-wider">
            1994 - 2001
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            The Silicon Alley Timeline
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Before social media was social media. Before the crash.
            This is how NYC built the internet.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-silicon-alley-primary via-purple-500 to-silicon-alley-primary opacity-50" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-silicon-alley-primary border-4 border-black z-10" />

                {/* Date (desktop) */}
                <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <div className="text-silicon-alley-accent font-mono text-sm">
                    {formatDate(event.date)}
                  </div>
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    {/* Date (mobile) */}
                    <div className="md:hidden text-silicon-alley-accent font-mono text-xs mb-2">
                      {formatDate(event.date)}
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getEventIcon(event.event_type)}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          {event.description}
                        </p>

                        {event.location && (
                          <div className="text-sm text-gray-500 mb-3">
                            📍 {event.location}
                          </div>
                        )}

                        {event.people && event.people.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {event.people.map((person, i) => (
                              <span
                                key={i}
                                className="inline-block bg-silicon-alley-primary/20 text-silicon-alley-accent px-3 py-1 rounded-full text-xs"
                              >
                                {person.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
            <h2 className="text-3xl font-bold mb-4 text-white">
              This timeline is incomplete
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Where were you? What parties did you attend? Who did you meet?
              Talk to our AI Oracle or submit your story directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition"
              >
                Talk to the Oracle
              </Link>
              <Link
                href="/submit"
                className="inline-block bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition border border-white/20"
              >
                Add Your Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to home */}
      <div className="text-center pb-12">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">
          ← Back to Silicon Alley Genealogy
        </Link>
      </div>
    </div>
  );
}
