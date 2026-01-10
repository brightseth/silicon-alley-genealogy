# 🚨 CRITICAL SECURITY FIXES REQUIRED
**Status**: MUST FIX BEFORE PRODUCTION
**Priority**: P0 - Blocking
**Estimated Time**: 4-6 hours

---

## 🔴 CRITICAL (Fix TODAY)

### 1. SQL Injection Vulnerabilities ⚠️ SHOWSTOPPER

**Files Affected**:
- `lib/agent/tools/memory-tools.ts` (lines 194, 214, 219, 239)
- `lib/agent/tools/connection-tools.ts` (lines 102, 115, 219, 222)
- `app/api/submit/route.ts`

**Current Code** (VULNERABLE):
```typescript
WHERE p.name ILIKE ${'%' + person_name + '%'}
```

**Fixed Code**:
```typescript
WHERE p.name ILIKE '%' || ${person_name} || '%'
```

**Action**: Replace ALL instances of string concatenation in SQL queries

---

### 2. Race Condition in Upsert Operations

**Files**: 
- `lib/agent/tools/memory-tools.ts` (lines 94-111)
- `app/api/submit/route.ts` (lines 17-42)

**Current Code** (UNSAFE):
```typescript
const existing = await sql`SELECT id FROM people WHERE email = ${email}`;
if (existing.rows.length > 0) {
  // UPDATE
} else {
  // INSERT - RACE CONDITION!
}
```

**Fixed Code**:
```typescript
const person = await sql`
  INSERT INTO people (name, handle, email, era)
  VALUES (${name}, ${handle}, ${email}, '1995-1996')
  ON CONFLICT (email) DO UPDATE 
  SET name = EXCLUDED.name, updated_at = NOW()
  RETURNING id
`;
```

---

### 3. Missing Rate Limiting

**Files**: All `/app/api/*` routes

**Install**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Add to each API route**:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

// In route handler:
const identifier = request.ip ?? 'anonymous';
const { success } = await ratelimit.limit(identifier);
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

---

### 4. Input Validation for Audio Upload

**File**: `app/api/transcribe/route.ts`

**Add**:
```typescript
const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB

if (!audio || typeof audio !== 'string') {
  return NextResponse.json({ error: 'Invalid audio data' }, { status: 400 });
}

const base64Data = audio.replace(/^data:audio\/\w+;base64,/, '');
const bufferSize = (base64Data.length * 3) / 4;

if (bufferSize > MAX_AUDIO_SIZE) {
  return NextResponse.json({ error: 'Audio too large' }, { status: 413 });
}
```

---

### 5. Unbounded Memory in Agent Loop

**File**: `lib/agent/silicon-alley-agent.ts`

**Add after line 104**:
```typescript
const MAX_MESSAGES = 20;

// Inside while loop, before calling Anthropic:
if (conversationMessages.length > MAX_MESSAGES) {
  conversationMessages = [
    conversationMessages[0], // Keep first message
    ...conversationMessages.slice(-MAX_MESSAGES)
  ];
}
```

---

## 🟡 HIGH PRIORITY (Fix Tomorrow)

### 6. Environment Variable Validation

**Create**: `lib/config.ts`

```typescript
const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'POSTGRES_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing: ${envVar}`);
  }
});
```

**Import at top of**: `lib/agent/silicon-alley-agent.ts`

---

### 7. Safer JSON Parsing

**All tool files**:

```typescript
function safeJsonParse(text: string): any {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}`);
  }
}
```

---

### 8. Agent Timeout

**File**: `lib/agent/silicon-alley-agent.ts`

```typescript
const AGENT_TIMEOUT = 55000; // 55 seconds

export async function runSiliconAlleyAgent(...) {
  return Promise.race([
    executeAgentLoop(messages, mode),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Agent timeout')), AGENT_TIMEOUT)
    )
  ]);
}
```

---

## 🟢 MEDIUM PRIORITY (This Week)

### 9. Type Safety Improvements
- Replace `any` types with proper interfaces
- Add input validation to all tool execute functions

### 10. Database Query Optimization
- Add GIN indexes for full-text search
- Combine queries in `findSharedHistory`

### 11. Error Message Sanitization
- Don't expose internal errors to users in production
- Create error constants

### 12. Logging & Observability
- Add structured logging
- Set up Vercel Log Drains

---

## 📋 Fix Checklist

**Before Next Deployment**:
- [ ] Fix SQL injection (all 8 locations)
- [ ] Fix race conditions (2 locations)
- [ ] Add rate limiting (all API routes)
- [ ] Add input validation (audio upload)
- [ ] Add memory bounds (agent loop)
- [ ] Test with malicious inputs
- [ ] Environment variable validation
- [ ] Error handling improvements

**Testing Required**:
- [ ] SQL injection prevention test
- [ ] Rate limit bypass attempts
- [ ] Large file upload rejection
- [ ] Agent loop termination
- [ ] Concurrent upsert operations

---

## 🚀 Deployment Hold

**DO NOT DEPLOY TO PRODUCTION** until:
1. ✅ All P0 (Critical) fixes complete
2. ✅ Security testing done
3. ✅ Rate limiting configured
4. ✅ Monitoring set up

**Current Status**: ⚠️ DEPLOYED BUT VULNERABLE

**Action**: Fix critical issues NOW, redeploy with fixes

---

## Estimated Timeline

**Critical Fixes**: 4-6 hours
**High Priority**: 4-6 hours
**Testing**: 2-4 hours

**Total**: 10-16 hours (1-2 days)

---

## Next Steps

1. **IMMEDIATE**: Stop promoting production URL until fixes deployed
2. Create feature branch for security fixes
3. Fix all P0 issues
4. Test thoroughly
5. Deploy fixes
6. Resume production rollout

**Need help with any of these fixes?** Let me know which ones to tackle first!

