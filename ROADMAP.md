# Silicon Alley Genealogy - Build Roadmap

**Current Status**: ✅ Mobile-friendly, deployed, API ready
**Live**: https://silicon-alley-genealogy.vercel.app
**Days until launch**: 21 (Jan 30, 2026)

---

## ✅ Completed (Jan 9)

### Foundation
- ✅ Next.js app with full design system
- ✅ Mobile-responsive layout and navigation
- ✅ 4 pages: Home, Submit, Timeline, People
- ✅ Vercel Postgres SDK integrated
- ✅ API routes built (submit, people, timeline)
- ✅ Database schema created with seed data
- ✅ Deployed to production
- ✅ GitHub repository public

### What Works Now
- ✅ Story submission form (connects to API)
- ✅ Mobile-friendly navigation
- ✅ Loading states and error handling
- ✅ Responsive design (mobile → desktop)

---

## 🎯 Next Up (Priority Order)

### 1. **Database Setup** (10 minutes) - DO THIS FIRST
**Why**: Nothing works without the database

**Steps**:
1. Open Vercel dashboard: `vercel open`
2. Storage → Create Database → Postgres
3. Connect to project
4. Run `schema.sql` in SQL editor
5. Verify seed data (3 people, 5 events)

**Result**: Form submissions save, API endpoints return data

---

### 2. **Make Pages Dynamic** (1 hour)
**Why**: Currently showing mock data, need real database content

#### Timeline Page (`/timeline`)
```typescript
// Update app/timeline/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        setEvents(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading timeline...</div>;

  return (
    // Render events from database
  );
}
```

#### People Page (`/people`)
```typescript
// Update app/people/page.tsx
// Same pattern - fetch from /api/people
```

**Result**: Live data from database, grows as stories are submitted

---

### 3. **Admin Interface** (2-3 hours)
**Why**: Need to approve stories, create connections, manage content

#### Create `/app/admin/page.tsx`
```typescript
'use client';
// Protected route (simple password auth for now)
// Show pending stories
// Approve/reject stories
// Create connections between people
// Add timeline events
```

#### Features Needed:
- ✅ List pending stories
- ✅ Approve/reject with one click
- ✅ Edit person details
- ✅ Create connections (drag & drop?)
- ✅ Add timeline events
- ✅ Simple password protection (env var)

**Result**: You can curate submissions, build the genealogy

---

### 4. **Enhanced Story Display** (1 hour)
**Why**: Approved stories should be visible on the site

#### Add `/app/stories/page.tsx`
- Show all approved stories
- Filter by person
- Search functionality
- Featured stories section

#### Update Homepage
- Show latest approved stories
- Featured pioneer of the day
- Statistics (X stories, Y people, Z connections)

**Result**: Visitors see the growing genealogy

---

### 5. **Social Sharing** (2 hours)
**Why**: Viral growth for the event

#### Player Card Sharing
- Generate shareable image for each person
- "Share your Silicon Alley card" button
- Twitter/X integration
- Download as PNG

#### Technology:
- Use `@vercel/og` for dynamic OG images
- Or canvas API for client-side generation

**Result**: People share their cards, drive traffic

---

### 6. **Email Notifications** (1 hour)
**Why**: Let people know when their story is approved

#### Setup:
- Use Vercel's email (Resend integration)
- Or SendGrid API
- Send on story approval
- Include link to their player card

**Result**: Better user experience, re-engagement

---

### 7. **NFT Smart Contract** (4-6 hours)
**Why**: Player cards as on-chain collectibles

#### Steps:
1. **Write ERC-721 Contract** (Solidity)
   ```solidity
   // SiliconAlleyPioneers.sol
   // Metadata: name, role, era, connections
   // Soulbound (non-transferable)
   ```

2. **Deploy to Base Testnet**
   - Test minting
   - Verify metadata
   - Test claiming

3. **Deploy to Base Mainnet**
   - Production contract
   - Add to Vercel env vars

4. **Build Claiming UI**
   - Connect wallet (RainbowKit)
   - Mint/claim card
   - View on OpenSea

**Result**: Each pioneer gets an NFT card

---

### 8. **Data Collection Campaign** (Ongoing)
**Why**: Need 100+ stories for impact

#### Activities:
- Email 800 RSVPs with submission link
- John's archive integration
- Social media posts
- Direct outreach to key people

#### Tools Needed:
- Email template
- Social media graphics
- QR code for event
- Print materials

**Result**: Rich, comprehensive genealogy

---

### 9. **Advanced Features** (Nice-to-have)
**Why**: Enhance the experience

- **Connection Visualization**: Graph view of relationships
- **Search & Filter**: Find people by company, year, role
- **Timeline Expansion**: Add photos, videos
- **Voice Recordings**: Audio oral histories
- **Map View**: Where people were in NYC (1995-96)
- **Company Pages**: Deep dives on Silicon Alley companies
- **AI Insights**: Auto-suggest connections from stories

---

### 10. **/vibe Integration** (Post-event)
**Why**: Ongoing community engagement

- Share stories in /vibe
- Terminal-native browsing
- Agent conversations about Silicon Alley
- Living history archive

---

## 📅 Suggested Timeline

### Week 1 (Jan 10-17)
- ✅ Database setup (10 min)
- ✅ Make pages dynamic (1 hr)
- ✅ Admin interface MVP (3 hrs)
- ✅ Email notifications (1 hr)
- 🎯 **Milestone**: Can collect & approve stories

### Week 2 (Jan 18-24)
- ✅ Social sharing (2 hrs)
- ✅ Enhanced story display (1 hr)
- ✅ NFT contract (testnet) (4 hrs)
- ✅ Data collection campaign
- 🎯 **Milestone**: Viral growth, NFTs work

### Week 3 (Jan 25-30)
- ✅ NFT contract (mainnet)
- ✅ Polish & bug fixes
- ✅ Content curation
- ✅ Event preparation
- 🎯 **Milestone**: Launch ready!

### Jan 28-31
- 🎉 **LAUNCH AT EVENT**
- Display at venue
- Live submissions
- NFT minting station
- Physical player cards

---

## 💡 Quick Wins (Do These First)

1. **Database setup** (10 min) - Unlocks everything
2. **Dynamic timeline** (30 min) - Shows it's real
3. **Dynamic people** (30 min) - Growing directory
4. **Admin password** (15 min) - You can manage content
5. **Story approval** (1 hr) - Core workflow works

These 5 things = fully functional genealogy in **~3 hours**

---

## 🛠️ Technical Debt to Address

- Add TypeScript strict mode
- Add unit tests (Jest)
- Add E2E tests (Playwright)
- Improve error boundaries
- Add logging (Sentry)
- Performance monitoring
- SEO optimization
- Accessibility audit (a11y)

---

## 📊 Success Metrics

### By Jan 20
- ✅ 20+ stories submitted
- ✅ 50+ people in database
- ✅ 20+ connections mapped
- ✅ Admin workflow smooth

### By Jan 27
- ✅ 50+ stories submitted
- ✅ 100+ people in database
- ✅ 50+ connections mapped
- ✅ NFTs mintable

### By Jan 30 (Launch)
- ✅ 100+ stories
- ✅ 200+ people
- ✅ 100+ connections
- ✅ 50+ NFTs minted
- ✅ 1000+ site visitors

---

## 🚀 How to Use This Roadmap

### Daily Building Sessions
1. Pick one item from "Next Up"
2. Build for 1-3 hours
3. Deploy and test
4. Move to next item

### Weekend Sprints
- Saturday: NFT contract + minting UI
- Sunday: Admin interface + content curation

### Final Push (Jan 25-30)
- Polish, polish, polish
- Test everything
- Load real content
- Prepare for event

---

## 📞 Quick Commands

```bash
# Start building
cd ~/Projects/silicon-alley-genealogy
npm run dev

# Deploy
git add . && git commit -m "Feature: description" && git push
vercel --prod

# View logs
vercel logs

# Database query
# Use Vercel dashboard → Storage → Query
```

---

## 🎯 Current Priority

**RIGHT NOW**: Set up the database (10 minutes)

Then you can:
1. Start collecting real stories
2. Build admin interface
3. Make pages dynamic
4. Everything else follows

**Next command to run**:
```bash
vercel open
# Then: Storage → Create Database → Postgres
```

---

**The foundation is done. Now build on it! 🚀**

21 days to create the definitive Silicon Alley genealogy.
