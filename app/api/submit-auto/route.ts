import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { withRateLimit } from '@/lib/rate-limit';
import { pinImage, pinMetadata, generatePioneerMetadata } from '@/lib/ipfs/pinata';
import { sendSubmissionConfirmation, sendClaimEmail } from '@/lib/email/resend';

const AUTO_APPROVE_ENABLED = process.env.AUTO_APPROVE_ENABLED === 'true';
const AUTO_APPROVE_THRESHOLD = parseFloat(process.env.AUTO_APPROVE_CONFIDENCE_THRESHOLD || '0.8');

interface SubmissionData {
  name: string;
  email?: string;
  handle?: string;
  whereWereYou: string;
  whatWereYouBuilding: string;
  whoInspiredYou: string;
  favoriteMemory?: string;
  lessonsLearned?: string;
  connections?: string;
  transcription?: string;
  photoAnalysis?: {
    estimated_date?: string;
    location?: string;
    people_count?: number;
  };
}

function calculateConfidenceScore(data: SubmissionData): number {
  let score = 0;
  let maxScore = 0;

  // Required fields (weighted heavily)
  if (data.name && data.name.length > 2) {
    score += 25;
  }
  maxScore += 25;

  if (data.whereWereYou && data.whereWereYou.length > 10) {
    score += 25;
  }
  maxScore += 25;

  if (data.whatWereYouBuilding && data.whatWereYouBuilding.length > 10) {
    score += 25;
  }
  maxScore += 25;

  if (data.whoInspiredYou && data.whoInspiredYou.length > 5) {
    score += 15;
  }
  maxScore += 15;

  // Optional but valuable
  if (data.email && data.email.includes('@')) {
    score += 5;
  }
  maxScore += 5;

  if (data.favoriteMemory && data.favoriteMemory.length > 20) {
    score += 3;
  }
  maxScore += 3;

  if (data.connections && data.connections.length > 0) {
    score += 2;
  }
  maxScore += 2;

  return score / maxScore;
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const rateCheck = withRateLimit(request, 'submit');
  if (!rateCheck.allowed) {
    return rateCheck.response;
  }

  try {
    const data: SubmissionData = await request.json();

    // Validate required fields
    if (!data.name || !data.whereWereYou || !data.whatWereYouBuilding) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, whereWereYou, whatWereYouBuilding'
      }, { status: 400 });
    }

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(data);
    const shouldAutoApprove = AUTO_APPROVE_ENABLED && confidenceScore >= AUTO_APPROVE_THRESHOLD;

    // Generate IDs
    const personId = uuidv4();
    const storyId = uuidv4();
    const claimToken = uuidv4();

    // Create person record
    await sql`
      INSERT INTO people (id, name, handle, email, created_at)
      VALUES (${personId}, ${data.name}, ${data.handle || null}, ${data.email || null}, NOW())
    `;

    // Create story record (matching actual schema)
    await sql`
      INSERT INTO stories (
        id, person_id, where_were_you, what_were_you_building,
        who_inspired_you, favorite_memory, lessons_learned, connections_mentioned,
        status, confidence_score, auto_approved, submitted_at
      )
      VALUES (
        ${storyId}, ${personId}, ${data.whereWereYou}, ${data.whatWereYouBuilding},
        ${data.whoInspiredYou}, ${data.favoriteMemory || null},
        ${data.lessonsLearned || null}, ${data.connections || null},
        ${shouldAutoApprove ? 'approved' : 'pending'}, ${confidenceScore},
        ${shouldAutoApprove}, NOW()
      )
    `;

    // Connections are stored in story.connections_mentioned field
    // Skip separate connections table insert (different schema)

    // Send confirmation email
    if (data.email) {
      await sendSubmissionConfirmation(data.email, data.name);
    }

    // If auto-approved, prepare for NFT minting
    let ipfsMetadataHash = null;
    if (shouldAutoApprove) {
      try {
        // Fetch the OG image for this person
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://silicon-alley-genealogy.vercel.app';
        const ogImageResponse = await fetch(`${baseUrl}/api/og?id=${personId}&format=png`);

        if (ogImageResponse.ok) {
          const imageBuffer = Buffer.from(await ogImageResponse.arrayBuffer());

          // Pin image to IPFS
          const imageHash = await pinImage(imageBuffer, `pioneer-${personId}.png`);

          // Generate and pin metadata
          const metadata = generatePioneerMetadata(
            {
              id: personId,
              name: data.name,
              neighborhood: data.whereWereYou,
            },
            imageHash
          );
          ipfsMetadataHash = await pinMetadata(personId, metadata);

          // Create NFT card record (matching actual schema)
          await sql`
            INSERT INTO nft_cards (
              person_id, claim_token, ipfs_metadata_hash, ipfs_image_hash,
              claimed, minted_at
            )
            VALUES (
              ${personId}, ${claimToken}, ${ipfsMetadataHash},
              ${imageHash}, false, NOW()
            )
          `;

          // Send claim email
          if (data.email) {
            await sendClaimEmail(data.email, data.name, personId, claimToken);
          }
        }
      } catch (ipfsError) {
        console.error('IPFS pinning failed:', ipfsError);
        // Continue without IPFS - card can still be claimed later
      }
    }

    return NextResponse.json({
      success: true,
      personId,
      storyId,
      confidenceScore,
      autoApproved: shouldAutoApprove,
      claimUrl: shouldAutoApprove ? `/claim/${personId}?token=${claimToken}` : null,
      message: shouldAutoApprove
        ? 'Story approved! Check your email to claim your Pioneer Card.'
        : 'Story submitted for review. You\'ll hear from us soon!'
    });

  } catch (error) {
    console.error('Auto-submit error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit story'
    }, { status: 500 });
  }
}
