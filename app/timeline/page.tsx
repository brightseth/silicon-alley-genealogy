export default function Timeline() {
  // Mock timeline data - will be replaced with real data from database
  const events = [
    {
      date: 'March 1994',
      title: 'The Browser Arrives',
      description: 'John Borthwick drives to MIT to see the Spyglass browser',
      people: ['John Borthwick'],
    },
    {
      date: 'August 1994',
      title: 'Web Partner Studio Founded',
      description: 'Ottawa + Total New York merge into Web Partner Studio',
      people: ['John Borthwick', 'Janice Fraser'],
    },
    {
      date: 'January 1995',
      title: 'The Scene Takes Shape',
      description: 'Lofts, cafes, and makeshift offices across NYC become the heart of web innovation',
      people: ['Multiple pioneers'],
    },
    {
      date: 'August 1995',
      title: 'SiteSpecific Launches',
      description: 'Seth Goldstein starts SiteSpecific after stints at Agency.com and Condé Net',
      people: ['Seth Goldstein', 'Clay Shirky'],
    },
    {
      date: '1996',
      title: 'Silicon Alley Boom',
      description: 'Money starts flowing, companies scaling, the movement gains momentum',
      people: ['The community'],
    },
  ];

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
          {events.map((event, index) => (
            <div key={index} className="timeline-node bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-semibold text-silicon-alley-accent mb-2">
                {event.date}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-silicon-alley-secondary">
                {event.title}
              </h3>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="flex flex-wrap gap-2">
                {event.people.map((person, i) => (
                  <span
                    key={i}
                    className="inline-block bg-silicon-alley-primary/10 text-silicon-alley-primary px-3 py-1 rounded-full text-sm"
                  >
                    {person}
                  </span>
                ))}
              </div>
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
