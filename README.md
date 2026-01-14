# Silicon Alley Genealogy

**The definitive oral history and network map of Silicon Alley's founding era (1994-2001)**

Built for the 30th Anniversary celebration (January 28-31, 2026) organized by Betaworks and the Silicon Alley community.

🌐 **Live**: https://silicon-alley-genealogy.vercel.app

## Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Pioneer Database | ✅ Live | 105 pioneers, 110 connections |
| Network Visualizer | ✅ Live | Force-directed graph with timeline |
| Voice Interview | ✅ Live | OpenAI Whisper transcription |
| Auto-Approve Flow | ✅ Live | Confidence scoring, IPFS pinning |
| NFT Claim Pages | ✅ Live | Smart Wallet ready |
| Smart Contracts | 🔧 Ready | Not deployed to Base yet |
| Email Notifications | ✅ Configured | Resend integration |

## Features

### 1. Network Visualization (`/network`)
Interactive force-directed graph showing connections between pioneers. Timeline slider (1987-2015) reveals how the network grew.

**Known Issues**: Canvas sizing, performance at scale, no zoom/pan. See `components/NetworkGraph.tsx`.

### 2. Voice Interview (`/submit`)
5-question guided interview captured via voice. Uses OpenAI Whisper for transcription. Auto-extracts structured data.

### 3. Pioneer Cards (`/person/[id]`)
Player cards for each pioneer with their role, era, bio, and connections. OG image generation for social sharing.

### 4. NFT Claiming (`/claim/[personId]`)
Gasless NFT minting via Coinbase Smart Wallet (OnchainKit). Cards minted on Base as ERC-721.

### 5. Auto-Approve Pipeline
```
Voice Interview → Transcription → Confidence Score → Auto-Approve (≥0.8) → IPFS Pin → Email → Claim
```

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres (Neon)
- **Auth**: None (public submission, admin endpoints protected)
- **NFTs**: Base L2, ERC-721, OnchainKit Smart Wallet
- **Storage**: Pinata (IPFS)
- **Email**: Resend
- **AI**: OpenAI (Whisper, GPT-4)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Vercel account (for Postgres)
- OpenAI API key

### Installation

```bash
git clone https://github.com/brightseth/silicon-alley-genealogy.git
cd silicon-alley-genealogy
npm install
```

### Environment Variables

Create `.env.local`:

```bash
# Required - Vercel Postgres
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Required - OpenAI (for voice transcription)
OPENAI_API_KEY="sk-..."

# Optional - IPFS (Pinata)
PINATA_API_KEY="..."
PINATA_SECRET_KEY="..."

# Optional - Email (Resend)
RESEND_API_KEY="re_..."

# Optional - Auto-approve
AUTO_APPROVE_ENABLED="true"
AUTO_APPROVE_CONFIDENCE_THRESHOLD="0.8"

# Optional - NFTs (after contract deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_ONCHAINKIT_API_KEY="..."
```

### Database Setup

1. Create Vercel Postgres database in dashboard
2. Run `schema.sql` in SQL editor
3. Seed pioneers: `POST /api/seed-pioneers` with `Authorization: Bearer silicon-alley-2025`

### Development

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # Run linter
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── network/         # Network graph data
│   │   ├── people/          # Pioneer CRUD
│   │   ├── submit/          # Manual submission
│   │   ├── submit-auto/     # V3 auto-approve flow
│   │   ├── seed-pioneers/   # Seed endpoints (v1, v2, v3)
│   │   ├── seed-connections/# Seed relationships
│   │   └── og/              # OG image generation
│   ├── claim/[personId]/    # NFT claim page
│   ├── network/             # Network visualization
│   ├── person/[id]/         # Pioneer profile
│   ├── submit/              # Voice interview
│   └── layout.tsx           # App shell
├── components/
│   ├── NetworkGraph.tsx     # Force-directed canvas graph
│   ├── VoiceInterview.tsx   # Voice recording component
│   └── web3/                # Wallet, NFT components
├── contracts/               # Solidity (Foundry)
│   ├── src/
│   │   ├── SiliconAlleyPioneers.sol  # ERC-721
│   │   └── AlleyToken.sol            # ERC-20 (rewards)
│   └── script/Deploy.s.sol
├── lib/
│   ├── web3/               # Wagmi config, contract ABIs
│   ├── ipfs/               # Pinata integration
│   └── email/              # Resend integration
├── migrations/             # SQL migrations
├── schema.sql              # Full database schema
└── CLAUDE.md               # Project context
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/people` | GET | No | List all pioneers |
| `/api/network` | GET | No | Network graph data |
| `/api/submit` | POST | No | Manual story submission |
| `/api/submit-auto` | POST | No | Auto-approve submission |
| `/api/seed-pioneers` | POST | Bearer | Seed pioneer data |
| `/api/seed-connections` | POST | Bearer | Seed relationships |
| `/api/og` | GET | No | Generate OG images |

## Data Model

**People**: 105 pioneers with name, handle, email, role, era, bio

**Connections**: 110 relationships with type (co-founder, investor, mentor, colleague), year, description

**Stories**: Submitted oral histories with confidence scores

**NFT Cards**: Claim tokens, IPFS hashes, mint status

## Known Issues & TODOs

### High Priority
- [ ] Network visualizer: responsive canvas, zoom/pan, performance
- [ ] Deploy smart contracts to Base mainnet
- [ ] Admin dashboard for story approval

### Medium Priority
- [ ] More pioneers (goal: 200+)
- [ ] More connections (LinkedIn scraping? manual curation?)
- [ ] Timeline events integration
- [ ] Company profiles (not just people)

### Low Priority
- [ ] Voice interview improvements (better prompts, follow-ups)
- [ ] Social sharing features
- [ ] Search/filter on people page

## Contributing

1. **Add pioneers**: Edit `app/api/seed-pioneers-v*/route.ts`
2. **Add connections**: Edit `app/api/seed-connections/route.ts`
3. **Fix bugs**: PRs welcome
4. **Share stories**: Visit `/submit`

## Timeline

- **Jan 13**: 105 pioneers, network viz live
- **Jan 20**: Target 150+ pioneers, contracts deployed
- **Jan 25**: Final polish, testing
- **Jan 28-31**: Launch at 30th anniversary events

## Team

- **John Borthwick** - Project lead, Betaworks
- **Seth Goldstein** - Technical lead, Silicon Alley alum
- **Community** - Silicon Alley pioneers contributing stories

## License

MIT - This is a community project for historical preservation.

---

**Built with ❤️ for the 30th anniversary of Silicon Alley (1995-2025)**
