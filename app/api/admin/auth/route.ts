import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Simple password check - in production, use proper authentication
    const adminPassword = process.env.ADMIN_PASSWORD || 'silicon-alley-admin';

    if (password === adminPassword) {
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
