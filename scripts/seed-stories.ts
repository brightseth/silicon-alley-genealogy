import { sql } from '@vercel/postgres';

async function seedStories() {
  console.log('Seeding stories...');

  // Get John's ID and add his story
  await sql`
    INSERT INTO stories (person_id, where_were_you, what_were_you_building, who_inspired_you, favorite_memory, lessons_learned, connections_mentioned, status)
    SELECT
      id,
      'I was in Ottawa initially, then moved to NYC. The energy in New York was electric - you could feel something big was happening. The lofts in Flatiron, the cafes in SoHo, everyone was building something.',
      'Web Partner Studio - we merged Ottawa and Total New York. We were building websites before anyone knew what that meant. Early e-commerce, content sites, experimental web projects. We were making it up as we went.',
      'Marc Andreessen and the Netscape team showed what was possible. But locally, it was the whole community - Fred Wilson was thinking about funding the scene, Stacy Horn had created Echo and proved online communities worked. Everyone was inspiring everyone.',
      'Driving to MIT in March 1994 to see the Spyglass browser for the first time. It was a snowy day. I saw the browser and immediately knew everything was going to change. I called my partner from a payphone and said we need to drop everything and focus on this.',
      'Move fast but build real relationships. The connections you make during the crazy early days last forever. Also: New York brings a different energy to tech - more media-savvy, more design-conscious, more culturally aware.',
      'Seth Goldstein, Janice Fraser, Fred Wilson, Stacy Horn, Craig Kanarick, Jeff Dachis',
      'approved'
    FROM people WHERE handle = '@borthwick'
    ON CONFLICT DO NOTHING
  `;
  console.log('Added John story');

  // Get Seth's ID and add his story
  await sql`
    INSERT INTO stories (person_id, where_were_you, what_were_you_building, who_inspired_you, favorite_memory, lessons_learned, connections_mentioned, status)
    SELECT
      id,
      'Started at Agency.com in their early days, then moved to Condé Net working for Michael Wolf. By August 1995, I was in a small office in the Flatiron district launching SiteSpecific.',
      'SiteSpecific was about making the web more useful. We built tools and sites that helped people navigate this new medium. The web was chaos and we were trying to bring some order to it.',
      'John Borthwick was a huge influence - he showed me what was possible and how to think big. The Razorfish guys - Craig and Jeff - were building something amazing. Everyone at the Silicon Alley parties was pushing each other to think bigger.',
      'The first time we got a big client. Walking into a meeting room with suits who had no idea what the internet was, and walking out with a deal. The validation that this crazy thing we were building actually mattered.',
      'The scene matters more than the company. Silicon Alley worked because everyone knew everyone, shared ideas, helped each other. Competition was friendly. We were all proving the same point: NYC could do tech.',
      'John Borthwick, Michael Wolf, Craig Kanarick, Jeff Dachis, Fred Wilson',
      'approved'
    FROM people WHERE handle = '@sethgoldstein'
    ON CONFLICT DO NOTHING
  `;
  console.log('Added Seth story');

  // Get Janice's ID and add her story
  await sql`
    INSERT INTO stories (person_id, where_were_you, what_were_you_building, who_inspired_you, favorite_memory, lessons_learned, connections_mentioned, status)
    SELECT
      id,
      'Working with John at Web Partner Studio. We had offices that felt more like art studios than tech companies. Whiteboards everywhere, people sketching interfaces, arguing about user experience before that term even existed.',
      'Design for the web. Not just making things pretty, but making them work for humans. We were inventing information architecture, user research, interface design - all while building real projects for clients.',
      'The whole design community in NYC - print designers learning digital, digital artists discovering they could build interactive things. Also Richard Saul Wurman and his information architecture work.',
      'The moment when a client finally understood what we were trying to do. When they saw a prototype and their eyes lit up. That transition from skepticism to excitement - that happened over and over.',
      'Users are not technical requirements. They are humans with needs, fears, hopes. Design is empathy made visible. Also: in a male-dominated industry, bring your perspective - it is valuable precisely because it is different.',
      'John Borthwick, Richard Saul Wurman',
      'approved'
    FROM people WHERE handle = '@clevergirl'
    ON CONFLICT DO NOTHING
  `;
  console.log('Added Janice story');

  console.log('Done seeding stories!');
}

seedStories().catch(console.error);
