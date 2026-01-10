# Silicon Alley Genealogy

**The definitive oral history and genealogy of Silicon Alley's founding era (1994-1996)**

Built for the 30th Anniversary celebration (January 28-31, 2026) organized by Betaworks and the Silicon Alley community.

## 🎯 Project Goals

1. **Preserve History** - Capture first-hand oral histories from the pioneers who built Silicon Alley
2. **Visualize Connections** - Map the genealogy of people, companies, and moments
3. **Create Artifacts** - Mint NFT player cards for each pioneer on Base
4. **Build Community** - Bring together the original community for reflection and celebration

## 🏗️ What We're Building

### 1. Oral History Collection
- Mobile-friendly submission form
- 5 structured questions to guide storytelling
- Admin curation and approval workflow

### 2. Interactive Timeline
- Chronological view of key events (1994-1996)
- Connections between people, companies, and moments
- Filterable by person, company, or event type

### 3. Player Cards (NFTs)
- Unique collectible card for each pioneer
- Mintable on Base (ERC-721)
- Claimable by the person featured
- Shareable on social media

### 4. People Directory
- Searchable directory of all pioneers
- View connections and stories
- Link to their player card

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Base (for NFTs)
- **Deployment**: Vercel
- **Future**: /vibe integration for community engagement

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)
- Base wallet (for NFT deployment)

### Installation

```bash
# Clone the repository
cd ~/Projects/silicon-alley-genealogy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit http://localhost:3000

### Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Base (for NFTs)
BASE_RPC_URL=https://mainnet.base.org
NFT_CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key

# Optional: Email notifications
SENDGRID_API_KEY=your_sendgrid_key
ADMIN_EMAIL=admin@example.com
```

## 📊 Database Setup

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for the complete schema.

Run the migration in Supabase:

```sql
-- See DATABASE_SCHEMA.md for full SQL
```

## 🎨 Design System

### Colors
- **Primary**: `#FF6B35` (Silicon Alley orange)
- **Secondary**: `#004E89` (Deep blue)
- **Accent**: `#F7B801` (Gold)
- **Dark**: `#1A1A1A`
- **Light**: `#F4F4F4`

### Typography
- **Sans**: Helvetica Neue, Arial
- **Mono**: Monaco, Courier New (for terminal aesthetic)

### Components
- Player cards: Gradient backgrounds, glassmorphism
- Timeline: Vertical with connection dots
- Forms: Clean, accessible, mobile-first

## 📝 Contributing

This is a community project. Ways to contribute:

1. **Share your story** at `/submit`
2. **Suggest connections** - who worked with whom?
3. **Add timeline events** - key moments we missed
4. **Improve the code** - PRs welcome

## 🗓️ Timeline

- **Now - Jan 20**: Build core features
- **Jan 20-25**: Collect stories, curate content
- **Jan 26-27**: Deploy, test, finalize
- **Jan 28-31**: Launch at 30th anniversary events

## 🔗 Links

- **Event**: Betaworks 30th Anniversary (Jan 28-31, 2026)
- **Organizer**: John Borthwick, Betaworks
- **Developer**: Seth Goldstein
- **Community**: Silicon Alley OGs

## 📜 License

MIT - This is a community project for historical preservation.

## 🙏 Acknowledgments

To all the pioneers who built the social internet in New York City in the mid-90s:
- John Borthwick, Janice Fraser, Fred Wilson
- Scott Heiferman, Jason Calacanis, Rufus Griscom
- Clay Shirky, Stacy Horn, Mark Stahlman
- And hundreds more who made it happen

Let's tell our story before it's lost to time.

---

**Built with ❤️ for the 30th anniversary of Silicon Alley**
