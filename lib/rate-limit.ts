import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting (resets on cold start, but good enough for launch)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  limit: number;      // Max requests per window
  windowMs: number;   // Window in milliseconds
}

// Default configs per endpoint type
export const RATE_LIMITS = {
  agent: { limit: 30, windowMs: 60 * 1000 },        // 30/min for chat
  transcribe: { limit: 10, windowMs: 60 * 1000 },   // 10/min for voice
  photo: { limit: 10, windowMs: 60 * 1000 },        // 10/min for photos
  submit: { limit: 5, windowMs: 60 * 1000 },        // 5/min for submissions
  default: { limit: 60, windowMs: 60 * 1000 }       // 60/min default
};

export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.default
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, resetAt: now + config.windowMs };
  }

  if (record.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: config.limit - record.count, resetAt: record.resetAt };
}

export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json({
    success: false,
    error: 'Rate limit exceeded. Please try again later.'
  }, {
    status: 429,
    headers: {
      'Retry-After': String(retryAfter),
      'X-RateLimit-Reset': String(resetAt)
    }
  });
}

// Helper to apply rate limiting in route handlers
export function withRateLimit(
  request: NextRequest,
  endpoint: keyof typeof RATE_LIMITS
): { allowed: boolean; response?: NextResponse } {
  const ip = getClientIP(request);
  const key = `${endpoint}:${ip}`;
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return { allowed: false, response: rateLimitResponse(result.resetAt) };
  }

  return { allowed: true };
}
