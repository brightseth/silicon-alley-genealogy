# Vercel Postgres Setup Guide

**Quick setup for Silicon Alley Genealogy database**

---

## Step 1: Add Postgres to Your Vercel Project

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to your project dashboard**:
   - Visit: https://vercel.com/sethvibes/silicon-alley-genealogy
   - Or run: `vercel open`

2. **Navigate to Storage tab**:
   - Click "Storage" in the top navigation
   - Click "Create Database"
   - Select "Postgres" (powered by Neon)

3. **Create the database**:
   - Database name: `silicon-alley-genealogy` (or accept default)
   - Region: Choose closest to your users (e.g., US East for NYC event)
   - Click "Create"

4. **Connect to your project**:
   - Select your project: `silicon-alley-genealogy`
   - Environment: Select "Production" (and optionally "Development")
   - Click "Connect"

5. **Done!** Vercel automatically adds these environment variables:
   ```
   POSTGRES_URL
   POSTGRES_PRISMA_URL
   POSTGRES_URL_NO_SSL
   POSTGRES_URL_NON_POOLING
   POSTGRES_USER
   POSTGRES_HOST
   POSTGRES_PASSWORD
   POSTGRES_DATABASE
   ```

### Option B: Via Vercel CLI

```bash
cd ~/Projects/silicon-alley-genealogy
vercel env pull
```

This will download the environment variables locally to `.env.local`.

---

## Step 2: Run the Database Schema

### Via Vercel Dashboard

1. **Open the SQL Editor**:
   - Go to Storage → Your Postgres database
   - Click "Data" tab
   - Click "Query" button

2. **Copy and paste the entire `schema.sql` file**:
   - Open `schema.sql` in your project
   - Copy all contents
   - Paste into the Vercel SQL editor
   - Click "Run Query"

3. **Verify the tables were created**:
   - Click "Tables" tab
   - You should see 8 tables:
     - people
     - stories
     - connections
     - timeline_events
     - timeline_event_people
     - companies
     - company_founders
     - nft_cards

4. **Verify seed data**:
   - Click on "people" table
   - You should see 3 rows: John Borthwick, Seth Goldstein, Janice Fraser

### Via Local SQL Client (Alternative)

If you prefer using a SQL client like TablePlus or Postico:

1. Get connection string from Vercel dashboard
2. Connect to the database
3. Run the `schema.sql` file

---

## Step 3: Test the API

### Test Locally First

```bash
cd ~/Projects/silicon-alley-genealogy

# Pull environment variables
vercel env pull

# Start dev server
npm run dev
```

Visit http://localhost:3000 and try:

1. **Test People API**:
   ```bash
   curl http://localhost:3000/api/people
   ```
   Should return 3 people (John, Seth, Janice)

2. **Test Timeline API**:
   ```bash
   curl http://localhost:3000/api/timeline
   ```
   Should return 5 events

3. **Test Story Submission**:
   - Go to http://localhost:3000/submit
   - Fill out the form
   - Submit
   - Check Vercel dashboard → Data → stories table

### Test Production

Once deployed:

```bash
curl https://silicon-alley-genealogy.vercel.app/api/people
curl https://silicon-alley-genealogy.vercel.app/api/timeline
```

---

## Step 4: Redeploy

After setting up the database:

```bash
cd ~/Projects/silicon-alley-genealogy
git add .
git commit -m "Add Vercel Postgres integration"
git push

# Or redeploy manually
vercel --prod
```

The environment variables are already connected, so the new deployment will automatically use the database.

---

## Troubleshooting

### "Error: Missing environment variable POSTGRES_URL"

**Solution**: Run `vercel env pull` to download environment variables locally.

### "Error: relation 'people' does not exist"

**Solution**: Run the `schema.sql` file in the Vercel SQL editor.

### "Error: Connection timeout"

**Solution**:
- Check that you're using `POSTGRES_URL` (pooling connection)
- Verify the database region is close to your deployment region

### "Can't see my data in production"

**Solution**:
- Make sure you ran schema.sql in the **production** database
- Check Vercel dashboard → Storage → Data tab

---

## What's Next?

Once the database is set up:

1. ✅ **Stories work end-to-end**
   - People can submit via /submit
   - Stories save to database
   - Admin can approve via SQL (or build admin UI)

2. ✅ **Timeline is dynamic**
   - Update `/app/timeline/page.tsx` to fetch from API
   - Events load from database

3. ✅ **People directory is dynamic**
   - Update `/app/people/page.tsx` to fetch from API
   - Cards generated from real data

4. **Build admin interface**
   - Approve/reject stories
   - Create connections
   - Add timeline events

---

## Quick Reference

### Environment Variables (Auto-added by Vercel)
```bash
POSTGRES_URL              # Use this for queries (pooling enabled)
POSTGRES_URL_NON_POOLING # Use for migrations
```

### Key Files
- `schema.sql` - Database schema and seed data
- `app/api/submit/route.ts` - Story submission endpoint
- `app/api/people/route.ts` - Get all people
- `app/api/timeline/route.ts` - Get timeline events

### Useful Commands
```bash
# Pull env vars locally
vercel env pull

# Open Vercel dashboard
vercel open

# View logs
vercel logs

# Redeploy
vercel --prod
```

---

## Database Overview

### Tables
- **people** - Silicon Alley pioneers (201 columns, indexed)
- **stories** - Oral history submissions
- **connections** - Relationships between people
- **timeline_events** - Key moments (1994-1996)
- **timeline_event_people** - Junction table
- **companies** - Silicon Alley companies
- **company_founders** - Junction table
- **nft_cards** - NFT minting status

### Seed Data
- 3 people (John, Seth, Janice)
- 5 timeline events
- 1 connection (John → Seth, mentor)

---

**Ready to collect stories!** 🎉

Once set up, share the live URL:
https://silicon-alley-genealogy.vercel.app/submit
