import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting for auth attempts
const authAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = authAttempts.get(ip);

  if (!record || now > record.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        error: 'Too many attempts. Try again later.'
      }, { status: 429 });
    }

    const { password } = await request.json();

    // REQUIRED: ADMIN_PASSWORD must be set in environment
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return NextResponse.json({
        success: false,
        error: 'Admin access not configured'
      }, { status: 503 });
    }

    if (password === adminPassword) {
      // Reset attempts on successful login
      authAttempts.delete(ip);

      return NextResponse.json({
        success: true,
        message: 'Authenticated'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}
