import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json();

    if (!linkedinUrl) {
      return NextResponse.json({
        success: false,
        error: 'No LinkedIn URL provided'
      }, { status: 400 });
    }

    // Fetch the LinkedIn page (note: this works better with LinkedIn public profiles)
    const response = await fetch(linkedinUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const html = await response.text();

    // Use Claude to extract job history from the HTML
    const extraction = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3072,
      messages: [{
        role: 'user',
        content: `You are extracting work history from a LinkedIn profile HTML page.

Here's the HTML:
${html.substring(0, 50000)}

Find all jobs from 1994-1996 (Silicon Alley era). Extract:
- Company name
- Role/title
- Dates (start/end)
- Location (if NYC)
- Description

Also extract:
- Person's name
- Current headline/bio

Return as JSON:
{
  name: ...,
  bio: ...,
  jobs: [
    {
      company: ...,
      role: ...,
      startDate: ...,
      endDate: ...,
      location: ...,
      description: ...
    }
  ]
}

Focus on Silicon Alley companies and NYC tech roles from the 1994-1996 era.`
      }]
    });

    const content = extraction.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response');
    }

    const data = JSON.parse(jsonMatch[0]);

    // Auto-generate story suggestions from work history
    let storySuggestions = '';
    if (data.jobs && data.jobs.length > 0) {
      const siliconAlleyJobs = data.jobs.filter(j => 
        j.startDate && (j.startDate.includes('1994') || j.startDate.includes('1995') || j.startDate.includes('1996'))
      );

      if (siliconAlleyJobs.length > 0) {
        const companies = siliconAlleyJobs.map(j => j.company).join(', ');
        storySuggestions = `Based on your LinkedIn, you were at ${companies} during the Silicon Alley era. Tell us about that time!`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        name: data.name || '',
        bio: data.bio || '',
        jobs: data.jobs || [],
        storySuggestions
      }
    });

  } catch (error: any) {
    console.error('LinkedIn extraction error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to extract LinkedIn data',
      details: error.toString()
    }, { status: 500 });
  }
}
