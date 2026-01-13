# Silicon Alley Genealogy - Session Notes

This file is the project memory. When you return, say "continue" to pick up where you left off.

---

## 2026-01-11 | Session End

**Focus**: Establishing session continuity workflow

**Done**:
- Designed session notes system for all projects
- Created this SESSION_NOTES.md file

**In Progress**: Nothing active

**Decisions**: Using append-only SESSION_NOTES.md as project memory (not separate CONTINUE_HERE files)

**Next**:
1. Seed database with sample Silicon Alley stories (for richer demos)
2. Test all 4 agent modes (oracle, memory_collector, timeline_weaver, connection_finder)
3. Add timeline page using timeline_weaver mode
4. Update PersonChat component to use new agent API
5. Add rate limiting (Upstash) - see SECURITY_FIXES_REQUIRED.md
6. Atomic upserts for race condition fix

**Context**: Just wrapped a quick session establishing workflow. Main work was done Jan 10.

---

## 2026-01-10 | Major Build Day - Agent SDK + iPhone Demo

**Focus**: Build autonomous agent SDK, ship iPhone demo, fix security issues

**Done**:
- Built Silicon Alley Agent SDK with 11 tools across 3 categories
  - Memory: extract_story_data, store_memory, recall_memories, ask_followup
  - Timeline: detect_events, generate_timeline, place_in_context
  - Connection: map_connections, find_shared_history, suggest_connections
- Created 4 agent modes: oracle, memory_collector, timeline_weaver, connection_finder
- Shipped iPhone demo at /demo (voice-first, gorgeous UI)
- Fixed critical security issues:
  - SQL injection (8 locations)
  - Input validation (audio upload 25MB limit)
  - Memory bounds (agent loop limited to 20 messages)

**In Progress**: None (clean end)

**Decisions**:
- Agent uses tool-use loop (autonomous decides which tools to invoke)
- Voice recording is primary CTA for oral history capture
- "Oracle mode" as default for /demo page
- Security fixes shipped, but rate limiting deferred (needs Upstash setup)

**Next**:
1. Seed database with sample stories
2. Test all 4 modes extensively
3. Add timeline page
4. Update PersonChat to use new agent
5. Add rate limiting
6. Fix race conditions with atomic upserts

**Context**:
- Production URL: https://silicon-alley-genealogy.vercel.app
- Demo URL: https://silicon-alley-genealogy.vercel.app/demo
- Event: Jan 28-31, 2026 (30th Anniversary, Betaworks)
- Organizer: John Borthwick
- The "Our Town narrator" vision is now real

---

## Key Files Reference

**Agent SDK**:
- `lib/agent/silicon-alley-agent.ts` - Main agent runner
- `lib/agent/tools/memory-tools.ts` - Memory extraction & storage
- `lib/agent/tools/timeline-tools.ts` - Timeline generation
- `lib/agent/tools/connection-tools.ts` - Social network mapping
- `app/api/agent/route.ts` - Unified agent endpoint

**Pages**:
- `app/demo/page.tsx` - iPhone demo (voice-first)
- `app/agent-test/page.tsx` - Developer test interface
- `app/submit/page.tsx` - Story submission form
- `app/admin/page.tsx` - Admin interface

**Documentation**:
- `AGENT_COMPLETE.md` - Agent SDK architecture
- `SECURITY_FIXES_REQUIRED.md` - Security audit + remaining work
- `SESSION_SUMMARY_JAN_10_2026.md` - Detailed Jan 10 summary

---

## Quick Commands

```bash
cd /Users/sethstudio1/Projects/silicon-alley-genealogy

# Run locally
npm run dev

# Check deployment
vercel ls

# Recent commits
git log --oneline -5

# Redeploy
git push origin main
```

---

## Environment Variables (Vercel)

- `ANTHROPIC_API_KEY` - Claude API
- `OPENAI_API_KEY` - Whisper transcription
- `POSTGRES_URL` - Database

---
