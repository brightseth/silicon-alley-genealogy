import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get('name') || 'Silicon Alley Pioneer';
    const handle = searchParams.get('handle') || '';
    const role = searchParams.get('role') || '';
    const era = searchParams.get('era') || '1995-1996';
    const bio = searchParams.get('bio') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #004E89 0%, #FF6B35 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              height: '90%',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1
                  style={{
                    fontSize: '72px',
                    fontWeight: 'bold',
                    color: '#004E89',
                    margin: '0',
                    lineHeight: '1.1',
                  }}
                >
                  {name}
                </h1>
                {handle && (
                  <p
                    style={{
                      fontSize: '32px',
                      color: '#666',
                      margin: '8px 0 0 0',
                    }}
                  >
                    {handle}
                  </p>
                )}
              </div>
              <div
                style={{
                  fontSize: '80px',
                  lineHeight: '1',
                }}
              >
                🃏
              </div>
            </div>

            {/* Era */}
            {era && (
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
                <div
                  style={{
                    fontSize: '20px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '8px',
                  }}
                >
                  ERA
                </div>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  {era}
                </div>
              </div>
            )}

            {/* Role */}
            {role && (
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
                <div
                  style={{
                    fontSize: '20px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '8px',
                  }}
                >
                  ROLE
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#333',
                    lineHeight: '1.3',
                  }}
                >
                  {role}
                </div>
              </div>
            )}

            {/* Bio */}
            {bio && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                <p
                  style={{
                    fontSize: '28px',
                    color: '#555',
                    lineHeight: '1.5',
                    margin: '0',
                  }}
                >
                  {bio.length > 200 ? bio.substring(0, 200) + '...' : bio}
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '2px solid #E5E5E5',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#FF6B35',
                }}
              >
                Silicon Alley 30
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#999',
                }}
              >
                January 28-31, 2026
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
