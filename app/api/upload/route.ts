/**
 * File Upload API - Vercel Blob Storage
 * Handles image and document uploads for Silicon Alley stories
 */

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Maximum file size: 25MB (matching security requirements)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'image/heic',
  'image/heif',
];

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPathname = `silicon-alley/${timestamp}-${sanitizedFileName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPathname, file, {
      access: 'public',
      addRandomSuffix: true, // Prevents collisions
    });

    // Return upload details
    return NextResponse.json({
      success: true,
      blob_url: blob.url,
      blob_pathname: blob.pathname,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: String(error) },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check upload status/health
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    max_file_size_mb: MAX_FILE_SIZE / 1024 / 1024,
    allowed_types: ALLOWED_TYPES,
  });
}
