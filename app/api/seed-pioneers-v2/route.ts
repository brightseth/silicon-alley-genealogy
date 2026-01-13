import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// Silicon Alley Pioneers V2 - The authentic 1995-1996 scene
// Adding 50+ more canonical figures to reach 100
const PIONEERS_V2 = [
  // === THE AGENCY TITANS ===
  {
    name: "Craig Kanarick",
    handle: "@craigkanarick",
    role: "Co-founder, Razorfish",
    era: "1995-2000",
    bio: "Co-founded Razorfish with Jeff Dachis in their East Village apartment. Built it into one of the largest digital agencies. Famous for 'everything that can be digital, will be.'"
  },
  {
    name: "Kyle Shannon",
    handle: "@kyleshannon",
    role: "Co-founder, Agency.com",
    era: "1995-2000",
    bio: "Co-founded Agency.com with Chan Suh. Major player in the digital agency boom, went public in 1999."
  },
  {
    name: "Jonathan Nelson",
    handle: "@jonnelson",
    role: "Founder, Organic",
    era: "1993-Present",
    bio: "Founded Organic in San Francisco but had major NYC presence. One of the first digital agencies."
  },

  // === THE PUBLISHERS ===
  {
    name: "Jason Chervokas",
    handle: "@jchervokas",
    role: "Co-founder, @NY",
    era: "1995-2000",
    bio: "Co-founded @NY with Tom Watson - the essential Silicon Alley newsletter before Silicon Alley Reporter."
  },
  {
    name: "Tom Watson",
    handle: "@tomwatson",
    role: "Co-founder, @NY",
    era: "1995-Present",
    bio: "Co-founded @NY newsletter. Later became prominent political blogger and nonprofit consultant."
  },
  {
    name: "Stefanie Syman",
    handle: "@stefaniesyman",
    role: "Co-founder, Feed Magazine",
    era: "1995-2001",
    bio: "Co-founded Feed Magazine with Steven Johnson. Pioneering online publication for ideas and culture."
  },
  {
    name: "Marisa Bowe",
    handle: "@marisabowe",
    role: "Editor, Word.com",
    era: "1995-2000",
    bio: "Editor of Word.com, one of the most influential early web publications. Pioneer of web writing."
  },
  {
    name: "Joey Anuff",
    handle: "@joeyanuff",
    role: "Co-founder, Suck.com",
    era: "1995-2001",
    bio: "Co-founded Suck.com with Carl Steadman - the original snarky web publication."
  },
  {
    name: "Carl Steadman",
    handle: "@carlsteadman",
    role: "Co-founder, Suck.com",
    era: "1995-2001",
    bio: "Co-founded Suck.com. Later created Plastic.com. Pioneer of web commentary."
  },

  // === THE ENTREPRENEURS ===
  {
    name: "Bob Lessin",
    handle: "@boblessin",
    role: "Founder, Wit Capital",
    era: "1995-2000",
    bio: "Founded Wit Capital, pioneering online investment banking. Father of Sam Lessin. Key Silicon Alley financier."
  },
  {
    name: "Candice Carpenter",
    handle: "@candicecarpenter",
    role: "Co-founder & CEO, iVillage",
    era: "1995-2000",
    bio: "Co-founded iVillage with Nancy Evans. Built the leading women's online network. IPO'd in 1999."
  },
  {
    name: "Nancy Evans",
    handle: "@nancyevans",
    role: "Co-founder, iVillage",
    era: "1995-2000",
    bio: "Co-founded iVillage with Candice Carpenter. Previously president of Doubleday."
  },
  {
    name: "Stephan Paternot",
    handle: "@stephanpaternot",
    role: "Co-founder, TheGlobe.com",
    era: "1995-2001",
    bio: "Co-founded TheGlobe.com with Todd Krizelman at Cornell. Famous IPO pop - 606% first day gain."
  },
  {
    name: "Todd Krizelman",
    handle: "@toddkrizelman",
    role: "Co-founder, TheGlobe.com",
    era: "1995-2001",
    bio: "Co-founded TheGlobe.com with Stephan Paternot. Early social networking pioneer."
  },
  {
    name: "Fernando Espuelas",
    handle: "@fernandoespuelas",
    role: "Co-founder & CEO, StarMedia",
    era: "1996-2002",
    bio: "Founded StarMedia, the leading Latin American internet portal. Major Silicon Alley success story."
  },
  {
    name: "Gene DeRose",
    handle: "@genederose",
    role: "CEO, Jupiter Communications",
    era: "1995-2000",
    bio: "Ran Jupiter Communications with Josh Harris. The leading internet research firm of the era."
  },
  {
    name: "Scott Kurnit",
    handle: "@scottkurnit",
    role: "Founder, About.com",
    era: "1996-Present",
    bio: "Founded About.com (originally MiningCo). Built massive content network. Later founded AdKeeper."
  },
  {
    name: "Seth Godin",
    handle: "@sethgodin",
    role: "Founder, Yoyodyne",
    era: "1995-1998",
    bio: "Founded Yoyodyne, pioneering permission marketing. Sold to Yahoo. Became legendary marketing author."
  },
  {
    name: "James Cramer",
    handle: "@jimcramer",
    role: "Co-founder, TheStreet.com",
    era: "1996-Present",
    bio: "Co-founded TheStreet.com. Former hedge fund manager turned financial media personality."
  },
  {
    name: "Larry Rosen",
    handle: "@larryrosen",
    role: "Founder, N2K",
    era: "1995-1999",
    bio: "Founded N2K, early online music company. Merged with CDnow. Pioneer of digital music commerce."
  },
  {
    name: "Dwight Merriman",
    handle: "@dmerr",
    role: "CTO, DoubleClick → Co-founder, MongoDB",
    era: "1996-Present",
    bio: "CTO of DoubleClick. Later co-founded MongoDB and 10gen. Key technical architect of the era."
  },

  // === THE MONEY PEOPLE ===
  {
    name: "Jim Robinson IV",
    handle: "@jimrobinson",
    role: "Co-founder, RRE Ventures",
    era: "1994-Present",
    bio: "Co-founded RRE Ventures with Stuart Ellman. Son of AmEx chairman. Early NYC tech VC."
  },
  {
    name: "Alan Patricof",
    handle: "@alanpatricof",
    role: "Founder, Patricof & Co (Apax)",
    era: "1969-Present",
    bio: "Legendary VC who backed many early internet companies. Founded Greycroft later."
  },
  {
    name: "Josh Kopelman",
    handle: "@joshk",
    role: "Founder, Infonautics → Half.com",
    era: "1992-Present",
    bio: "Founded Infonautics, then Half.com (sold to eBay). Later founded First Round Capital."
  },

  // === THE CULTURE MAKERS ===
  {
    name: "Jaime Levy",
    handle: "@jaimelevy",
    role: "Electronic Hollywood, UX Pioneer",
    era: "1990-Present",
    bio: "Created Electronic Hollywood floppy disk zine. Pioneer of UX strategy. Wrote the book on UX Strategy."
  },
  {
    name: "Mark Tribe",
    handle: "@marktribe",
    role: "Founder, Rhizome",
    era: "1996-Present",
    bio: "Founded Rhizome.org, the leading platform for new media art. Key bridge between art and tech."
  },
  {
    name: "Lisa Strausfeld",
    handle: "@lisastrausfeld",
    role: "Designer, Pentagram Digital",
    era: "1995-Present",
    bio: "Led digital design at Pentagram. Pioneer of information visualization and interactive design."
  },
  {
    name: "John Maeda",
    handle: "@johnmaeda",
    role: "MIT Media Lab → Design Leader",
    era: "1990-Present",
    bio: "MIT Media Lab professor who influenced NYC design scene. Later led RISD, Automattic, others."
  },
  {
    name: "Red Burns",
    handle: "@redburns",
    role: "Founder, NYU ITP",
    era: "1979-2013",
    bio: "Founded NYU's Interactive Telecommunications Program. Trained a generation of creative technologists."
  },

  // === THE CONNECTORS ===
  {
    name: "Alice Rodd O'Rourke",
    handle: "@aliceorourke",
    role: "Community Builder, NYNMA",
    era: "1995-2000",
    bio: "Key organizer of New York New Media Association events. Connected the entire scene."
  },
  {
    name: "Cecilia Pagkalinawan",
    handle: "@ceciliap",
    role: "Founder, Boutique Y2K",
    era: "1996-2001",
    bio: "Founded Boutique Y2K parties - legendary Silicon Alley networking events at Lot 61."
  },
  {
    name: "Courtney Pulitzer",
    handle: "@cyborganic",
    role: "Cyber Salon Host",
    era: "1994-1999",
    bio: "Hosted Cyber Salon gatherings. Key connector of the early digital scene."
  },
  {
    name: "Mark Stahlman",
    handle: "@markstahlman",
    role: "Founder, New York New Media Association",
    era: "1994-2000",
    bio: "Founded NYNMA, the trade association that gave Silicon Alley its identity."
  },

  // === THE INFRASTRUCTURE ===
  {
    name: "David Sifry",
    handle: "@dsifry",
    role: "Founder, Technorati",
    era: "1995-Present",
    bio: "Founded Technorati (blog search). Active in NYC and SF scenes."
  },
  {
    name: "Brewster Kahle",
    handle: "@brewsterkahle",
    role: "Founder, Internet Archive",
    era: "1996-Present",
    bio: "Founded Internet Archive and Alexa. Preserving the web's history since 1996."
  },

  // === MORE ENTREPRENEURS ===
  {
    name: "Kevin Conroy",
    handle: "@kevinconroy",
    role: "President, Excite@Home",
    era: "1995-2001",
    bio: "Led Excite@Home's east coast operations. Major player in the portal wars."
  },
  {
    name: "Henry Blodget",
    handle: "@hblodget",
    role: "Internet Analyst → Business Insider",
    era: "1996-Present",
    bio: "Famous internet analyst. Later co-founded Business Insider with Kevin Ryan."
  },
  {
    name: "Michael Wolff",
    handle: "@michaelwolff",
    role: "Founder, Burn Rate Author",
    era: "1995-Present",
    bio: "Founded several web ventures. Wrote 'Burn Rate' - the definitive Silicon Alley memoir."
  },
  {
    name: "Po Bronson",
    handle: "@pobronson",
    role: "Author, The Nudist on the Late Shift",
    era: "1995-2000",
    bio: "Chronicled Silicon Alley in 'The Nudist on the Late Shift' and other books."
  },
  {
    name: "Stacy Horn",
    handle: "@stacyhorn",
    role: "Founder, Echo NYC",
    era: "1989-Present",
    bio: "Founded Echo, NYC's original online community before the web. Pioneer of digital community."
  },
  {
    name: "Carl Steadman",
    handle: "@carlsteadman",
    role: "Co-founder, Suck.com → Plastic.com",
    era: "1995-2001",
    bio: "Co-founded Suck.com. Later created Plastic.com. Pioneer of web culture commentary."
  },

  // === LATE 90S WAVE ===
  {
    name: "Tim Armstrong",
    handle: "@timarmstrongog",
    role: "Google NYC → AOL CEO",
    era: "1996-Present",
    bio: "Early Google ad sales. Later CEO of AOL. Key figure in NYC digital advertising."
  },
  {
    name: "David Karp",
    handle: "@davidkarp",
    role: "Founder, Tumblr",
    era: "2007-Present",
    bio: "High school dropout who founded Tumblr in NYC. Sold to Yahoo for $1.1B."
  },
  {
    name: "Alexis Ohanian",
    handle: "@alexisohanian",
    role: "Co-founder, Reddit",
    era: "2005-Present",
    bio: "Co-founded Reddit. Major NYC tech community builder and investor."
  },
  {
    name: "Gary Vaynerchuk",
    handle: "@garyvee",
    role: "Founder, VaynerMedia",
    era: "2006-Present",
    bio: "Built Wine Library TV, then VaynerMedia. NYC digital marketing pioneer."
  },

  // === THE ANALYSTS ===
  {
    name: "Mary Meeker",
    handle: "@marymeeker",
    role: "Morgan Stanley Internet Analyst",
    era: "1995-Present",
    bio: "Legendary internet analyst at Morgan Stanley. Her reports defined the era. Later joined Kleiner Perkins."
  },
  {
    name: "Henry Blodget",
    handle: "@hblodget",
    role: "Merrill Lynch Analyst → Business Insider",
    era: "1996-Present",
    bio: "Famous for $400 Amazon price target. Later co-founded Business Insider."
  },
];

// Additional connections for V2 pioneers
const CONNECTIONS_V2: [string, string, string, number, string][] = [
  // Agency connections
  ["Craig Kanarick", "Jeff Dachis", "co-founder", 1995, "Co-founded Razorfish"],
  ["Kyle Shannon", "Chan Suh", "co-founder", 1995, "Co-founded Agency.com"],
  ["Craig Kanarick", "Kyle Shannon", "competitor", 1996, "Agency rivalry/collaboration"],

  // Publisher connections
  ["Jason Chervokas", "Tom Watson", "co-founder", 1995, "Co-founded @NY newsletter"],
  ["Steven Johnson", "Stefanie Syman", "co-founder", 1995, "Co-founded Feed Magazine"],
  ["Jason Chervokas", "Jason Calacanis", "colleague", 1996, "Both covering Silicon Alley"],
  ["Joey Anuff", "Carl Steadman", "co-founder", 1995, "Co-founded Suck.com"],
  ["Marisa Bowe", "Stefanie Syman", "colleague", 1996, "Both pioneering web publishing"],

  // iVillage
  ["Candice Carpenter", "Nancy Evans", "co-founder", 1995, "Co-founded iVillage"],
  ["Candice Carpenter", "Fred Wilson", "investor", 1996, "Flatiron backed iVillage"],

  // TheGlobe.com
  ["Stephan Paternot", "Todd Krizelman", "co-founder", 1995, "Co-founded TheGlobe.com"],

  // StarMedia
  ["Fernando Espuelas", "Fred Wilson", "investor", 1997, "Flatiron backed StarMedia"],

  // Jupiter/Pseudo
  ["Gene DeRose", "Josh Harris", "colleague", 1995, "Both at Jupiter Communications"],

  // DoubleClick expanded
  ["Dwight Merriman", "Kevin Ryan", "colleague", 1996, "DoubleClick technical leadership"],
  ["Dwight Merriman", "Kevin O'Connor", "colleague", 1996, "DoubleClick founding team"],

  // RRE
  ["Jim Robinson IV", "Stuart Ellman", "co-founder", 1994, "Co-founded RRE Ventures"],
  ["Jim Robinson IV", "Fred Wilson", "colleague", 1996, "NYC VC community"],

  // Money/entrepreneurs
  ["Bob Lessin", "Fred Wilson", "colleague", 1997, "NYC finance and VC overlap"],
  ["Seth Godin", "Fred Wilson", "investor", 1996, "Flatiron may have looked at Yoyodyne"],
  ["Scott Kurnit", "Kevin Ryan", "colleague", 1998, "Both building content companies"],

  // Culture/NYU
  ["Red Burns", "Clay Shirky", "colleague", 1995, "Both shaping NYU digital"],
  ["Red Burns", "Dan O'Sullivan", "colleague", 1995, "Both at NYU ITP"],
  ["John Maeda", "Red Burns", "colleague", 1998, "Both in design education"],
  ["Mark Tribe", "Jaime Levy", "colleague", 1996, "Both in digital art/culture"],

  // Community builders
  ["Alice Rodd O'Rourke", "Mark Stahlman", "colleague", 1995, "Both building NYNMA"],
  ["Cecilia Pagkalinawan", "Jason Calacanis", "colleague", 1997, "Party scene and media"],
  ["Alice Rodd O'Rourke", "Cecilia Pagkalinawan", "colleague", 1997, "Both connecting the scene"],

  // Media/analysts
  ["Henry Blodget", "Kevin Ryan", "colleague", 2007, "Co-founded Business Insider"],
  ["Henry Blodget", "Mary Meeker", "colleague", 1998, "Both internet analysts"],
  ["Michael Wolff", "Jason Calacanis", "colleague", 1998, "Both chronicling the scene"],

  // Stacy Horn / Echo
  ["Stacy Horn", "Clay Shirky", "colleague", 1994, "Both in early online community"],
  ["Stacy Horn", "Douglas Rushkoff", "colleague", 1994, "Both writing about digital culture"],

  // Later wave connections
  ["David Karp", "Fred Wilson", "investor", 2007, "USV backed Tumblr"],
  ["Dennis Crowley", "David Karp", "colleague", 2008, "Both young NYC founders"],
  ["Gary Vaynerchuk", "Kevin Ryan", "colleague", 2009, "NYC digital marketing"],
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
  for (const pioneer of PIONEERS_V2) {
    try {
      const existing = await sql`
        SELECT id FROM people WHERE name = ${pioneer.name}
      `;

      if (existing.rows.length > 0) {
        results.pioneersSkipped.push(pioneer.name);
        continue;
      }

      const id = uuidv4();
      await sql`
        INSERT INTO people (id, name, handle, role, era, bio, created_at)
        VALUES (${id}, ${pioneer.name}, ${pioneer.handle || null}, ${pioneer.role}, ${pioneer.era}, ${pioneer.bio}, NOW())
      `;
      results.pioneersAdded.push(pioneer.name);
    } catch (error) {
      results.errors.push(`Pioneer ${pioneer.name}: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  // Get all people for connection mapping
  const { rows: people } = await sql`SELECT id, name FROM people`;
  const personMap = new Map(people.map(p => [p.name.toLowerCase(), p.id]));

  // Add connections
  for (const [personA, personB, relationship, year, context] of CONNECTIONS_V2) {
    try {
      const idA = personMap.get(personA.toLowerCase());
      const idB = personMap.get(personB.toLowerCase());

      if (!idA || !idB) {
        results.connectionsSkipped.push(`${personA} → ${personB} (person not found)`);
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
      results.errors.push(`Connection ${personA} → ${personB}: ${error instanceof Error ? error.message : 'Unknown'}`);
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
