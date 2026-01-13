import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// Known Silicon Alley connections - the network that built NYC tech
// Format: [person_a, person_b, relationship, year, context]
const CONNECTIONS: [string, string, string, number, string][] = [
  // SiteSpecific cluster
  ["Seth Goldstein", "Clay Shirky", "co-founder", 1995, "Clay was CTO at SiteSpecific"],
  ["Seth Goldstein", "John Borthwick", "mentor", 1995, "John mentored Seth early in Silicon Alley"],

  // Flatiron Partners cluster
  ["Fred Wilson", "Jerry Colonna", "co-founder", 1996, "Co-founded Flatiron Partners"],
  ["Fred Wilson", "Joanne Wilson", "spouse", 1987, "Married, both became prolific investors"],
  ["Fred Wilson", "Kevin Ryan", "investor", 1997, "Flatiron invested in DoubleClick"],
  ["Jerry Colonna", "Kevin Ryan", "investor", 1997, "Flatiron backed DoubleClick"],

  // DoubleClick cluster
  ["Kevin Ryan", "Kevin O'Connor", "co-founder", 1996, "Co-founded DoubleClick"],
  ["Kevin Ryan", "Chris Fralic", "colleague", 1998, "Chris worked at DoubleClick"],

  // Razorfish / Agency cluster
  ["Jeff Dachis", "Chan Suh", "colleague", 1995, "Both in digital agency world"],

  // Pseudo / Jupiter cluster
  ["Josh Harris", "Clay Shirky", "colleague", 1995, "Clay consulted for Jupiter/Pseudo"],
  ["Josh Harris", "Jason Calacanis", "covered", 1997, "Jason covered Pseudo in Silicon Alley Reporter"],

  // Media cluster
  ["Jason Calacanis", "Nick Denton", "colleague", 1999, "Both in NYC tech media"],
  ["Nick Denton", "Rufus Griscom", "colleague", 1999, "Both building online publications"],
  ["Rufus Griscom", "Genevieve Field", "co-founder", 1997, "Co-founded Nerve.com"],
  ["Steven Johnson", "Rufus Griscom", "colleague", 1996, "Both in online publishing"],

  // Meetup / Community cluster
  ["Scott Heiferman", "Dawn Barber", "co-founder", 2002, "Co-founded NY Tech Meetup"],
  ["Scott Heiferman", "Dennis Crowley", "colleague", 2004, "Both building location/community apps"],
  ["Dennis Crowley", "Andrew Rasiej", "colleague", 2005, "Both in NYC civic/social tech"],

  // VC Network
  ["Fred Wilson", "Howard Morgan", "colleague", 1999, "Both early NYC VCs"],
  ["Howard Morgan", "Chris Fralic", "colleague", 2004, "Both at First Round Capital"],
  ["Fred Wilson", "Stuart Ellman", "colleague", 1996, "Both pioneering NYC VC"],
  ["Stuart Ellman", "Kevin Ryan", "investor", 1998, "RRE invested in NYC startups"],

  // Culture / Academia cluster
  ["Clay Shirky", "Dan O'Sullivan", "colleague", 2000, "Both at NYU ITP"],
  ["Clay Shirky", "Douglas Rushkoff", "colleague", 1996, "Both writing about internet culture"],
  ["Douglas Rushkoff", "Bob Stein", "colleague", 1994, "Both in digital publishing/culture"],
  ["Esther Dyson", "Fred Wilson", "colleague", 1996, "Both early tech investors"],
  ["Esther Dyson", "Jerry Colonna", "colleague", 1997, "Both in NYC tech investing"],

  // Web 2.0 bridge
  ["Caterina Fake", "Joshua Schachter", "colleague", 2005, "Both sold to Yahoo - Flickr & del.icio.us"],
  ["Caterina Fake", "Anil Dash", "colleague", 2004, "Both in blogging/social web"],
  ["Anil Dash", "Scott Heiferman", "colleague", 2003, "Both building community platforms"],
  ["Joshua Schachter", "Steven Johnson", "colleague", 2004, "Both exploring social software"],

  // Content / Media evolution
  ["Om Malik", "Jason Calacanis", "colleague", 2004, "Both tech bloggers"],
  ["Om Malik", "Nick Denton", "colleague", 2004, "Both building blog networks"],
  ["Brian McCullough", "Jason Calacanis", "documented", 2015, "Brian documented Silicon Alley history"],
  ["Baratunde Thurston", "Anil Dash", "colleague", 2008, "Both in tech/culture commentary"],

  // Investor/Founder relationships
  ["Susan Lyne", "Kevin Ryan", "colleague", 2008, "Susan was CEO of Gilt (Kevin founded)"],
  ["Joanne Wilson", "Susan Lyne", "investor", 2014, "Both investing in female founders"],
  ["Karin Klein", "Fred Wilson", "colleague", 2010, "Both NYC tech investors"],

  // Cross-pollination
  ["Kevin Slavin", "Dennis Crowley", "colleague", 2006, "Both in games/location"],
  ["Jaime Levy", "Clay Shirky", "colleague", 1995, "Both early web pioneers"],
  ["Jaime Levy", "Josh Harris", "colleague", 1994, "Both in early digital media"],

  // Andrew Rasiej civic tech hub
  ["Andrew Rasiej", "Clay Shirky", "colleague", 2004, "Both in civic tech/activism"],
  ["Andrew Rasiej", "Scott Heiferman", "colleague", 2003, "Both building community"],

  // Di-Ann Eisnor connections
  ["Di-Ann Eisnor", "Dennis Crowley", "colleague", 2007, "Both in location tech"],
  ["Di-Ann Eisnor", "Kevin Slavin", "colleague", 2006, "Both exploring location/place"],

  // Nicholas Thompson media connections
  ["Nicholas Thompson", "Steven Johnson", "colleague", 2010, "Both tech journalists/editors"],
  ["Nicholas Thompson", "Om Malik", "colleague", 2012, "Both in tech media"],

  // Jonathan Glick / Gordon Gould
  ["Gordon Gould", "Fred Wilson", "colleague", 1997, "Both early NYC investors"],
  ["Jonathan Glick", "Nick Denton", "colleague", 2001, "Both in digital media"],

  // Cyndi Stivers media
  ["Cyndi Stivers", "Rufus Griscom", "colleague", 1998, "Both in NYC digital media"],
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'silicon-alley-2025'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // First, update Clay Shirky's bio
  await sql`
    UPDATE people
    SET role = 'CTO, SiteSpecific → NYU Professor',
        bio = 'CTO at SiteSpecific with Seth Goldstein (1995). Later became NYU professor, wrote seminal works on internet culture including "Here Comes Everybody" and "Cognitive Surplus".'
    WHERE name = 'Clay Shirky'
  `;

  const results = {
    added: [] as string[],
    skipped: [] as string[],
    errors: [] as string[]
  };

  // Get all people for ID lookup
  const { rows: people } = await sql`SELECT id, name FROM people`;
  const personMap = new Map(people.map(p => [p.name.toLowerCase(), p.id]));

  for (const [personA, personB, relationship, year, context] of CONNECTIONS) {
    try {
      const idA = personMap.get(personA.toLowerCase());
      const idB = personMap.get(personB.toLowerCase());

      if (!idA || !idB) {
        results.skipped.push(`${personA} → ${personB} (person not found)`);
        continue;
      }

      // Check if connection exists
      const existing = await sql`
        SELECT id FROM connections
        WHERE (person_a_id = ${idA} AND person_b_id = ${idB})
           OR (person_a_id = ${idB} AND person_b_id = ${idA})
      `;

      if (existing.rows.length > 0) {
        results.skipped.push(`${personA} → ${personB} (exists)`);
        continue;
      }

      await sql`
        INSERT INTO connections (id, person_a_id, person_b_id, relationship_type, year, description, created_at)
        VALUES (${uuidv4()}, ${idA}, ${idB}, ${relationship}, ${year}, ${context}, NOW())
      `;
      results.added.push(`${personA} → ${personB} (${relationship}, ${year})`);
    } catch (error) {
      results.errors.push(`${personA} → ${personB}: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  return NextResponse.json({
    success: true,
    clayShirkyUpdated: true,
    summary: {
      total: CONNECTIONS.length,
      added: results.added.length,
      skipped: results.skipped.length,
      errors: results.errors.length
    },
    results
  });
}
