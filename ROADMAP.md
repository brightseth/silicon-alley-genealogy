# Silicon Alley Genealogy - Roadmap

## Current State (Jan 13, 2026)

### What's Working
- **105 pioneers** seeded with bios, roles, eras
- **110 connections** mapped between them
- **Network visualizer** with timeline slider (buggy but functional)
- **Voice interview** flow with AI transcription
- **Auto-approve pipeline** with confidence scoring
- **NFT claim pages** ready (contracts not deployed)
- **IPFS + Email** integrations configured

### What's Not Working
- Network graph: fixed canvas, no zoom/pan, performance issues
- Smart contracts: written but not deployed to Base
- Admin dashboard: none (manual DB queries)
- Search/filter: minimal

---

## Phase 1: Stabilization (Jan 13-17)

### 1.1 Network Visualizer Fix
**Priority**: High

Options:
- **A) Patch existing**: Fix canvas sizing, remove hover from deps, add settle detection
- **B) D3 rewrite**: Use d3-force + d3-zoom, render to canvas
- **C) External lib**: vis.js, sigma.js, or react-force-graph

Recommendation: **B** - D3 is battle-tested for this scale

Tasks:
- [ ] Responsive canvas with devicePixelRatio
- [ ] Zoom/pan controls
- [ ] Settle detection (stop animation when stable)
- [ ] Click to focus on node's subgraph
- [ ] Better initial layout (not spiral)

### 1.2 Deploy Smart Contracts
**Priority**: High

Tasks:
- [ ] Deploy SiliconAlleyPioneers.sol to Base Sepolia (test)
- [ ] Test mint flow end-to-end
- [ ] Deploy to Base mainnet
- [ ] Update env vars in Vercel
- [ ] Verify contract on BaseScan

### 1.3 Admin Dashboard
**Priority**: Medium

MVP Features:
- [ ] View pending stories
- [ ] Approve/reject with one click
- [ ] Edit pioneer profiles
- [ ] View network stats

---

## Phase 2: Content Expansion (Jan 17-22)

### 2.1 More Pioneers (Target: 200+)

Missing categories:
- [ ] More agency people (Sapient, Viant, USWeb, Modem Media)
- [ ] More publishers (Paper, Time Out Digital, early blogs)
- [ ] Infrastructure (ISPs, hosting, Echo NYC regulars)
- [ ] Events people (Silicon Alley 2000 organizers)
- [ ] International connections (London, SF crossover)

Sources:
- John Borthwick's archives
- Silicon Alley Reporter back issues
- @NY archives
- LinkedIn (manual, not scraping)
- Direct outreach

### 2.2 More Connections

Tasks:
- [ ] Review each pioneer, add 3-5 connections each
- [ ] Add company affiliations (who worked where)
- [ ] Add investment relationships (who funded whom)
- [ ] Add mentorship chains
- [ ] Verify years/dates

### 2.3 Timeline Events

Key events to add:
- [ ] Company foundings (with exact dates)
- [ ] IPOs and acquisitions
- [ ] Key parties/gatherings
- [ ] Publication launches
- [ ] Office locations/moves

---

## Phase 3: Polish (Jan 22-27)

### 3.1 UX Improvements
- [ ] Mobile-responsive network view
- [ ] People page: search, filter by era/role
- [ ] Person page: show connections visually
- [ ] Better voice interview prompts
- [ ] Loading states and error handling

### 3.2 Social Features
- [ ] Shareable pioneer cards (OG images work)
- [ ] Twitter/LinkedIn share buttons
- [ ] "I was there" badge system
- [ ] Connection suggestions ("You might know...")

### 3.3 Performance
- [ ] Network graph optimization for 200+ nodes
- [ ] API caching
- [ ] Image optimization
- [ ] Lazy loading

---

## Phase 4: Launch (Jan 28-31)

### Pre-Launch (Jan 27)
- [ ] Final data review
- [ ] Test all flows on production
- [ ] Prepare demo script
- [ ] Brief John Borthwick

### Launch Day (Jan 28)
- [ ] Monitor for issues
- [ ] Be ready to hotfix
- [ ] Collect real-time feedback

### During Event (Jan 28-31)
- [ ] Encourage submissions at the event
- [ ] Live network updates as people connect
- [ ] NFT minting demos
- [ ] Capture photos for timeline

---

## Technical Debt

### Must Fix Before Launch
- [ ] Network graph stability
- [ ] Contract deployment
- [ ] Error handling in submit flow

### Can Wait
- [ ] Test coverage
- [ ] TypeScript strict mode
- [ ] API rate limiting (basic exists)
- [ ] Database indexes review

---

## Open Questions

1. **Network graph library choice** - D3, vis.js, or patch existing?
2. **Connection data collection** - Manual curation vs community submission?
3. **NFT economics** - Free mint? Gas sponsorship? Edition limits?
4. **Post-event maintenance** - Who owns this long-term?

---

## Success Metrics

- **Pioneers**: 200+ by launch
- **Connections**: 300+ by launch
- **Stories submitted**: 50+ during event
- **NFTs minted**: 25+ during event
- **No critical bugs** during event

---

*Last updated: Jan 13, 2026*
