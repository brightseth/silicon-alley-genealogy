# Silicon Alley Genealogy

**Preserving the history of NYC's first tech scene (1995-2001)**

Collaboration with **John Borthwick** for the 30th anniversary.

---

## Status: Database Setup Needed

**Live Site**: https://silicon-alley-genealogy.vercel.app
**Code**: Complete and deployed
**Database**: Needs Vercel Postgres setup (~10 min)

---

## What This Is

A digital archive and NFT project documenting Silicon Alley pioneers, companies, and moments. Story submissions from the community, player cards for key figures, timeline of events.

**Target**: Launch by Jan 30 for 30th anniversary

---

## Quick Setup (10 min)

1. **Add Postgres**: Vercel dashboard → Storage → Create Database → Postgres
2. **Run schema**: Copy `schema.sql` into Vercel SQL editor
3. **Redeploy**: `vercel --prod`
4. **Test**: `curl https://silicon-alley-genealogy.vercel.app/api/people`

See `NEXT_STEPS.md` for detailed walkthrough.

---

## Seed Data Ready

- **3 people**: John Borthwick, Seth Goldstein, Janice Fraser
- **5 timeline events**: 1994-1996 Silicon Alley boom
- **1 connection**: John → Seth (mentor)

---

## Key Files

| File | Purpose |
|------|---------|
| `NEXT_STEPS.md` | Database setup guide |
| `schema.sql` | Full schema + seed data |
| `DATABASE_SCHEMA.md` | Schema documentation |
| `DEMO_GUIDE_FOR_BORTHWICK.md` | What to show John |
| `app/api/` | API routes (submit, people, timeline) |

---

## API Endpoints

```
GET  /api/people    → All pioneers
GET  /api/timeline  → Timeline events
POST /api/submit    → Story submission
```

---

## Next Actions

- [ ] Complete Vercel Postgres setup
- [ ] Share URL with John Borthwick
- [ ] Collect first stories from pioneers
- [ ] Add more seed data from John's archive
- [ ] Build admin interface for approvals

---

## Quick Commands

```bash
# Open Vercel dashboard
vercel open

# Local development
npm run dev

# Deploy
vercel --prod

# View logs
vercel logs
```

---

## Collaboration

**John Borthwick** - Silicon Alley pioneer, betaworks founder
- Has archive of photos, stories, connections
- Key source for seed data

**Seth** - Technical lead, also a Silicon Alley alum (SiteSpecific/Root Markets)

---

*Project: ~/Projects/silicon-alley-genealogy*
*Live: https://silicon-alley-genealogy.vercel.app*
