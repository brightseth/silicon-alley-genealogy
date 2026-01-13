import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// Silicon Alley Pioneers - The founding generation
const PIONEERS = [
  {
    name: "Fred Wilson",
    handle: "@fredwilson",
    email: "fred@usv.com",
    role: "VC, Flatiron Partners → Union Square Ventures",
    era: "1996-Present",
    bio: "Co-founded Flatiron Partners with Jerry Colonna, backed many Silicon Alley startups. Later founded Union Square Ventures."
  },
  {
    name: "Jason Calacanis",
    handle: "@jason",
    email: "jason@calacanis.com",
    role: "Founder, Silicon Alley Reporter",
    era: "1996-Present",
    bio: "Founded Silicon Alley Reporter, the definitive newsletter of the scene. Later founded Weblogs Inc, sold to AOL."
  },
  {
    name: "Clay Shirky",
    handle: "@cshirky",
    email: "clay@shirky.com",
    role: "Professor, Writer, Consultant",
    era: "1995-Present",
    bio: "NYU professor who wrote seminal works on internet culture. Consulted for many Silicon Alley startups."
  },
  {
    name: "Di-Ann Eisnor",
    handle: "@diann",
    email: "diann@eisnor.com",
    role: "Co-founder, Platial → Waze",
    era: "1995-Present",
    bio: "Digital mapping pioneer. Co-founded Platial, later key role at Waze."
  },
  {
    name: "Kevin Ryan",
    handle: "@kevinryan",
    email: "kevin@alleycorp.com",
    role: "CEO, DoubleClick → AlleyCorp",
    era: "1996-Present",
    bio: "Ran DoubleClick from startup to $2.5B Google acquisition. Founded AlleyCorp, Gilt Groupe, MongoDB, Business Insider."
  },
  {
    name: "Jeff Dachis",
    handle: "@jeffdachis",
    email: "jeff@dachisgroup.com",
    role: "Co-founder, Razorfish",
    era: "1995-Present",
    bio: "Co-founded Razorfish, one of the largest digital agencies. Pioneer of digital marketing and experience design."
  },
  {
    name: "Andy Merkatz",
    handle: "@andymerkatz",
    email: "andy@merkatz.com",
    role: "Entrepreneur, Community Builder",
    era: "1995-Present",
    bio: "Serial entrepreneur and connector in the Silicon Alley scene."
  },
  {
    name: "Jerry Colonna",
    handle: "@jerrycolonna",
    email: "jerry@reboot.io",
    role: "VC, Flatiron Partners → Reboot",
    era: "1996-Present",
    bio: "Co-founded Flatiron Partners with Fred Wilson. Later became executive coach, founded Reboot."
  },
  {
    name: "Chan Suh",
    handle: "@chansuh",
    email: "chan@agency.com",
    role: "Co-founder, Agency.com",
    era: "1995-Present",
    bio: "Co-founded Agency.com, one of the first major digital agencies."
  },
  {
    name: "Andrew Rasiej",
    handle: "@rasiej",
    email: "andrew@civichall.org",
    role: "Founder, Personal Democracy Forum",
    era: "1995-Present",
    bio: "Pioneer of civic tech. Founded Personal Democracy Forum and Civic Hall."
  },
  {
    name: "Gordon Gould",
    handle: "@gordongould",
    email: "gordon@gould.com",
    role: "Entrepreneur, Investor",
    era: "1995-Present",
    bio: "Early Silicon Alley entrepreneur and angel investor."
  },
  {
    name: "Joanne Wilson",
    handle: "@thegotham",
    email: "joanne@gothamgal.com",
    role: "Angel Investor, Gotham Gal",
    era: "1995-Present",
    bio: "Prolific angel investor in NYC startups. Married to Fred Wilson."
  },
  {
    name: "Kevin O'Connor",
    handle: "@kevinoconnor",
    email: "kevin@doubleclick.com",
    role: "Co-founder, DoubleClick",
    era: "1996-Present",
    bio: "Co-founded DoubleClick, which pioneered internet advertising."
  },
  {
    name: "Josh Harris",
    handle: "@weliveinpublic",
    email: "josh@pseudo.com",
    role: "Founder, Pseudo.com, Jupiter Communications",
    era: "1994-2000",
    bio: "Visionary/provocateur who founded Jupiter Communications and Pseudo.com. Subject of 'We Live in Public' documentary."
  },
  {
    name: "Rufus Griscom",
    handle: "@rufusgriscom",
    email: "rufus@nextbigideaclub.com",
    role: "Co-founder, Nerve.com → Babble",
    era: "1997-Present",
    bio: "Co-founded Nerve.com with Genevieve Field. Later founded Babble, sold to Disney."
  },
  {
    name: "Genevieve Field",
    handle: "@genevievefield",
    email: "genevieve@nerve.com",
    role: "Co-founder, Nerve.com",
    era: "1997-Present",
    bio: "Co-founded Nerve.com with Rufus Griscom. Pioneer of online publishing."
  },
  {
    name: "Jaime Levy",
    handle: "@jaimelevy",
    email: "jaime@jaimelevy.com",
    role: "UX Pioneer, Electronic Hollywood",
    era: "1990-Present",
    bio: "Created Electronic Hollywood floppy disk magazine. Pioneer of UX strategy and digital publishing."
  },
  {
    name: "Nick Denton",
    handle: "@nickdenton",
    email: "nick.denton@gmail.com",
    role: "Founder, Gawker Media",
    era: "1997-Present",
    bio: "Founded First Tuesday in NYC, then Gawker Media empire."
  },
  {
    name: "Esther Dyson",
    handle: "@edyson",
    email: "edyson@edventure.com",
    role: "Investor, ICANN Chair, EDventure",
    era: "1983-Present",
    bio: "Legendary tech investor and analyst. First ICANN chair. Published Release 1.0 newsletter."
  },
  {
    name: "Howard Morgan",
    handle: "@howardmorgan",
    email: "howard@b.capital",
    role: "Co-founder, First Round Capital",
    era: "1995-Present",
    bio: "Co-founded First Round Capital. Early investor in many foundational internet companies."
  },
  {
    name: "Chris Fralic",
    handle: "@chrisfralic",
    email: "chris@firstround.com",
    role: "Partner, First Round Capital",
    era: "1995-Present",
    bio: "Partner at First Round Capital. Previously at DoubleClick and Half.com."
  },
  {
    name: "Susan Lyne",
    handle: "@susanlyne",
    email: "susan@bbgv.com",
    role: "CEO, Gilt Groupe → BBG Ventures",
    era: "2000-Present",
    bio: "Led Gilt Groupe, now runs BBG Ventures backing female founders."
  },
  {
    name: "Douglas Rushkoff",
    handle: "@rushkoff",
    email: "rushkoff@rushkoff.com",
    role: "Author, Media Theorist",
    era: "1994-Present",
    bio: "Author of 'Cyberia' and 'Program or Be Programmed'. Documented early internet culture."
  },
  {
    name: "Nicholas Thompson",
    handle: "@nxthompson",
    email: "nxthompson@gmail.com",
    role: "Editor, Wired → The Atlantic",
    era: "1995-Present",
    bio: "Editor-in-Chief of Wired, now CEO of The Atlantic."
  },
  {
    name: "Dennis Crowley",
    handle: "@dens",
    email: "dens@hopscotchlabs.co",
    role: "Co-founder, Dodgeball → Foursquare",
    era: "2000-Present",
    bio: "Founded Dodgeball (sold to Google), then Foursquare. Pioneer of location-based social."
  },
  {
    name: "Adam Seifer",
    handle: "@adamseifer",
    email: "aseifer@gmail.com",
    role: "Entrepreneur, Community Builder",
    era: "1995-Present",
    bio: "Silicon Alley entrepreneur and community connector."
  },
  {
    name: "Scott Heiferman",
    handle: "@heif",
    email: "heiferman@gmail.com",
    role: "Co-founder, Meetup",
    era: "1995-Present",
    bio: "Co-founded i-traffic, then Meetup.com after 9/11 inspired focus on real-world community."
  },
  {
    name: "Anil Dash",
    handle: "@anildash",
    email: "a@anildash.com",
    role: "Blogger, CEO Glitch",
    era: "1999-Present",
    bio: "Pioneering blogger, tech activist. Former CEO of Glitch (Fog Creek)."
  },
  {
    name: "Dawn Barber",
    handle: "@dawnbarber",
    email: "barberdawn@gmail.com",
    role: "Co-founder, NY Tech Meetup",
    era: "1995-Present",
    bio: "Co-founded NY Tech Meetup with Scott Heiferman. Community builder."
  },
  {
    name: "Kevin Slavin",
    handle: "@slavin_fpo",
    email: "slavin.fpo@gmail.com",
    role: "Co-founder, Area/Code → MIT Media Lab",
    era: "1995-Present",
    bio: "Co-founded Area/Code (games). Professor at MIT Media Lab. Famous TED talk on algorithms."
  },
  {
    name: "Habib Warren",
    handle: "@whabib",
    email: "whabib@gmail.com",
    role: "Entrepreneur, Investor",
    era: "1995-Present",
    bio: "Silicon Alley entrepreneur and angel investor."
  },
  {
    name: "Jonathan Glick",
    handle: "@jonathanglick",
    email: "jonathan@sulia.com",
    role: "Founder, Sulia",
    era: "1995-Present",
    bio: "Founded Sulia. Early Silicon Alley entrepreneur."
  },
  {
    name: "Steven Johnson",
    handle: "@stevenbjohnson",
    email: "stevenberlinjohnson@gmail.com",
    role: "Author, FEED Magazine",
    era: "1995-Present",
    bio: "Co-founded FEED magazine. Author of 'Interface Culture', 'Where Good Ideas Come From'."
  },
  {
    name: "Stuart Ellman",
    handle: "@stuartellman",
    email: "sje@rre.com",
    role: "Founder, RRE Ventures",
    era: "1994-Present",
    bio: "Founded RRE Ventures, one of NYC's first tech-focused VC firms."
  },
  {
    name: "Baratunde Thurston",
    handle: "@baratunde",
    email: "baratunde@baratunde.com",
    role: "Writer, Comedian, The Onion",
    era: "2000-Present",
    bio: "Digital director at The Onion. Author of 'How to Be Black'. Tech culture commentator."
  },
  {
    name: "Bob Stein",
    handle: "@futureofthebook",
    email: "futureofthebook@gmail.com",
    role: "Founder, Voyager Company → Institute for Future of Book",
    era: "1985-Present",
    bio: "Pioneer of CD-ROM publishing. Founded Institute for the Future of the Book."
  },
  {
    name: "Caterina Fake",
    handle: "@caterina",
    email: "caterina@gmail.com",
    role: "Co-founder, Flickr → Hunch → Yes VC",
    era: "1995-Present",
    bio: "Co-founded Flickr (sold to Yahoo), Hunch (sold to eBay). Now runs Yes VC."
  },
  {
    name: "Dan O'Sullivan",
    handle: "@danosullivan",
    email: "dan.osullivan@nyu.edu",
    role: "Professor, NYU ITP",
    era: "1995-Present",
    bio: "Professor at NYU's ITP program. Trained a generation of creative technologists."
  },
  {
    name: "Joshua Schachter",
    handle: "@joshu",
    email: "joshua@schachter.org",
    role: "Founder, del.icio.us",
    era: "1998-Present",
    bio: "Created del.icio.us, pioneering social bookmarking. Sold to Yahoo."
  },
  {
    name: "Karin Klein",
    handle: "@karinmklein",
    email: "karin@bloombergbeta.com",
    role: "Partner, Bloomberg Beta",
    era: "1995-Present",
    bio: "Partner at Bloomberg Beta. Early Silicon Alley participant."
  },
  {
    name: "Om Malik",
    handle: "@om",
    email: "om@trueventures.com",
    role: "Founder, GigaOm → Partner, True Ventures",
    era: "1995-Present",
    bio: "Founded GigaOm. Now partner at True Ventures."
  },
  {
    name: "Brian McCullough",
    handle: "@brianmcc",
    email: "brian@ridehomefund.com",
    role: "Founder, Internet History Podcast",
    era: "1995-Present",
    bio: "Created Internet History Podcast documenting the web's history. Author of 'How the Internet Happened'."
  },
  {
    name: "Cyndi Stivers",
    handle: "@cyndistivers",
    email: "cyndi.stivers@gmail.com",
    role: "Editor, Time Out New York → TED",
    era: "1995-Present",
    bio: "Launched Time Out New York digital. Later led content at TED."
  }
];

export async function POST(request: NextRequest) {
  // Simple auth check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'silicon-alley-2025'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    added: [] as string[],
    skipped: [] as string[],
    errors: [] as string[]
  };

  for (const pioneer of PIONEERS) {
    try {
      // Check if person already exists by email or name
      const existing = await sql`
        SELECT id FROM people
        WHERE email = ${pioneer.email} OR name = ${pioneer.name}
      `;

      if (existing.rows.length > 0) {
        results.skipped.push(pioneer.name);
        continue;
      }

      // Insert new pioneer
      const id = uuidv4();
      await sql`
        INSERT INTO people (id, name, handle, email, role, era, bio, created_at)
        VALUES (
          ${id},
          ${pioneer.name},
          ${pioneer.handle},
          ${pioneer.email},
          ${pioneer.role},
          ${pioneer.era},
          ${pioneer.bio},
          NOW()
        )
      `;
      results.added.push(pioneer.name);
    } catch (error) {
      results.errors.push(`${pioneer.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return NextResponse.json({
    success: true,
    summary: {
      total: PIONEERS.length,
      added: results.added.length,
      skipped: results.skipped.length,
      errors: results.errors.length
    },
    results
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with Authorization header to seed pioneers',
    pioneerCount: PIONEERS.length
  });
}
