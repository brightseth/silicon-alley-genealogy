import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// Final batch to hit 100+ canonical Silicon Alley pioneers
const PIONEERS_V3 = [
  // More agency founders
  {
    name: "Bert Ellis",
    handle: "@bertellis",
    role: "Founder, iXL",
    era: "1996-2001",
    bio: "Founded iXL, one of the largest digital agencies of the boom. Atlanta-based but major NYC presence."
  },
  {
    name: "Tony Hsieh",
    handle: "@tonyhsieh",
    role: "Co-founder, LinkExchange → Zappos",
    era: "1996-2020",
    bio: "Founded LinkExchange in NYC, sold to Microsoft. Later founded Zappos. Tragic loss in 2020."
  },
  {
    name: "Marc Andreessen",
    handle: "@pmarca",
    role: "Co-founder, Netscape → a16z",
    era: "1994-Present",
    bio: "While not NYC-based, his Netscape browser enabled Silicon Alley. Met with John Borthwick at MIT in 1994."
  },

  // Key NYC tech figures
  {
    name: "David Rose",
    handle: "@davidrose",
    role: "Founder, New York Angels",
    era: "1995-Present",
    bio: "Founded New York Angels. Prolific angel investor. Author of 'Angel Investing'."
  },
  {
    name: "Charlie O'Donnell",
    handle: "@ceonyc",
    role: "VC, Brooklyn Bridge Ventures",
    era: "2004-Present",
    bio: "Early Union Square Ventures, now Brooklyn Bridge Ventures. Chronicled NYC startup scene."
  },
  {
    name: "Albert Wenger",
    handle: "@albertwenger",
    role: "Partner, Union Square Ventures",
    era: "2007-Present",
    bio: "Partner at USV with Fred Wilson. Former president of del.icio.us. Author, investor, thinker."
  },
  {
    name: "Brad Burnham",
    handle: "@bradburnham",
    role: "Co-founder, Union Square Ventures",
    era: "2003-Present",
    bio: "Co-founded USV with Fred Wilson. Previously at AT&T Ventures."
  },

  // More content/media pioneers
  {
    name: "Elizabeth Spiers",
    handle: "@espiers",
    role: "Founding Editor, Gawker",
    era: "2002-Present",
    bio: "Founding editor of Gawker. Later ran Dealbreaker, NY Observer. NYC media trailblazer."
  },
  {
    name: "Lockhart Steele",
    handle: "@lockhartsteele",
    role: "Founder, Curbed → Vox Media",
    era: "2004-Present",
    bio: "Founded Curbed, Eater, Racked. Sold to Vox Media. Defined vertical media in NYC."
  },
  {
    name: "Rachel Sklar",
    handle: "@rachelsklar",
    role: "Founder, Change the Ratio → TheList",
    era: "2005-Present",
    bio: "Founded Change the Ratio. Advocate for women in tech. Key NYC community builder."
  },
  {
    name: "Glynnis MacNicol",
    handle: "@glfrombklyn",
    role: "Co-founder, TheList",
    era: "2010-Present",
    bio: "Co-founded TheList with Rachel Sklar. Writer, community builder."
  },

  // E-commerce pioneers
  {
    name: "Julie Wainwright",
    handle: "@juliewainwright",
    role: "CEO, Pets.com → The RealReal",
    era: "1999-Present",
    bio: "Led Pets.com (infamous bust). Later founded The RealReal, proving resilience."
  },
  {
    name: "Jonathan Kaplan",
    handle: "@jonathankaplan",
    role: "Founder, Pure Digital (Flip)",
    era: "2001-2009",
    bio: "Founded Pure Digital, maker of Flip camera. Sold to Cisco. NYC product innovation."
  }
];

// More connections to flesh out the network
const CONNECTIONS_V3: [string, string, string, number, string][] = [
  // Fred Wilson's extended network
  ["Fred Wilson", "David Rose", "colleague", 1998, "Both in NYC angel/VC scene"],
  ["Fred Wilson", "Brad Burnham", "co-founder", 2003, "Co-founded Union Square Ventures"],
  ["Fred Wilson", "Albert Wenger", "colleague", 2007, "Partners at USV"],
  ["Fred Wilson", "Charlie O'Donnell", "colleague", 2004, "Charlie worked at USV"],

  // Nick Denton media empire
  ["Nick Denton", "Elizabeth Spiers", "hired", 2002, "Nick hired Elizabeth as Gawker's founding editor"],
  ["Elizabeth Spiers", "Lockhart Steele", "colleague", 2003, "Both in NYC blog media"],
  ["Lockhart Steele", "Nick Denton", "colleague", 2004, "NYC blog scene"],

  // USV portfolio connections
  ["Albert Wenger", "Joshua Schachter", "investor", 2005, "USV and del.icio.us"],
  ["Fred Wilson", "Dennis Crowley", "investor", 2009, "USV backed Foursquare"],
  ["Brad Burnham", "Scott Heiferman", "investor", 2008, "USV backed Meetup"],

  // Agency rivalries
  ["Craig Kanarick", "Bert Ellis", "competitor", 1997, "Razorfish vs iXL"],
  ["Jeff Dachis", "Bert Ellis", "competitor", 1997, "Agency wars"],

  // Women in tech network
  ["Rachel Sklar", "Joanne Wilson", "colleague", 2010, "Both championing women founders"],
  ["Rachel Sklar", "Glynnis MacNicol", "co-founder", 2010, "Co-founded TheList"],
  ["Susan Lyne", "Rachel Sklar", "colleague", 2012, "Both in women in tech movement"],

  // Investment chains
  ["Alan Patricof", "Fred Wilson", "colleague", 1996, "NYC VC community"],
  ["David Rose", "Howard Morgan", "colleague", 2000, "Both in NYC angel investing"],
  ["Josh Kopelman", "Howard Morgan", "colleague", 2004, "Both at First Round"],

  // More cross-pollination
  ["Henry Blodget", "Elizabeth Spiers", "colleague", 2010, "NYC digital media"],
  ["Tony Hsieh", "Seth Godin", "colleague", 1997, "Both in NYC web scene before moves"],

  // Later era links
  ["David Karp", "Albert Wenger", "investor", 2007, "USV backed Tumblr"],
  ["Alexis Ohanian", "Fred Wilson", "colleague", 2010, "Both in NYC tech community"],
  ["Gary Vaynerchuk", "Dennis Crowley", "colleague", 2010, "NYC startup scene"],

  // Bob Lessin connections
  ["Bob Lessin", "Jerry Colonna", "colleague", 1997, "Both in NYC finance/tech"],
  ["Bob Lessin", "Kevin Ryan", "colleague", 1998, "Both in digital finance"],
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'silicon-alley-2025'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    pioneersAdded: [] as string[],
    pioneersSkipped: [] as string[],
    connectionsAdded: [] as string[],
    connectionsSkipped: [] as string[],
    errors: [] as string[]
  };

  // Add pioneers
  for (const pioneer of PIONEERS_V3) {
    try {
      const existing = await sql`SELECT id FROM people WHERE name = ${pioneer.name}`;
      if (existing.rows.length > 0) {
        results.pioneersSkipped.push(pioneer.name);
        continue;
      }

      await sql`
        INSERT INTO people (id, name, handle, role, era, bio, created_at)
        VALUES (${uuidv4()}, ${pioneer.name}, ${pioneer.handle || null}, ${pioneer.role}, ${pioneer.era}, ${pioneer.bio}, NOW())
      `;
      results.pioneersAdded.push(pioneer.name);
    } catch (error) {
      results.errors.push(`Pioneer ${pioneer.name}: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  // Get people for connections
  const { rows: people } = await sql`SELECT id, name FROM people`;
  const personMap = new Map(people.map(p => [p.name.toLowerCase(), p.id]));

  // Add connections
  for (const [personA, personB, relationship, year, context] of CONNECTIONS_V3) {
    try {
      const idA = personMap.get(personA.toLowerCase());
      const idB = personMap.get(personB.toLowerCase());

      if (!idA || !idB) {
        results.connectionsSkipped.push(`${personA} → ${personB} (not found)`);
        continue;
      }

      const existing = await sql`
        SELECT id FROM connections
        WHERE (person_a_id = ${idA} AND person_b_id = ${idB})
           OR (person_a_id = ${idB} AND person_b_id = ${idA})
      `;

      if (existing.rows.length > 0) {
        results.connectionsSkipped.push(`${personA} → ${personB} (exists)`);
        continue;
      }

      await sql`
        INSERT INTO connections (id, person_a_id, person_b_id, relationship_type, year, description, created_at)
        VALUES (${uuidv4()}, ${idA}, ${idB}, ${relationship}, ${year}, ${context}, NOW())
      `;
      results.connectionsAdded.push(`${personA} → ${personB} (${relationship}, ${year})`);
    } catch (error) {
      results.errors.push(`Connection ${personA}→${personB}: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  return NextResponse.json({
    success: true,
    summary: {
      pioneersAdded: results.pioneersAdded.length,
      pioneersSkipped: results.pioneersSkipped.length,
      connectionsAdded: results.connectionsAdded.length,
      connectionsSkipped: results.connectionsSkipped.length,
      errors: results.errors.length
    },
    results
  });
}
