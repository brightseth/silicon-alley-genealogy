import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();

    if (!audio) {
      return NextResponse.json({
        success: false,
        error: 'No audio provided'
      }, { status: 400 });
    }

    const audioBuffer = Buffer.from(audio.replace(/^data:audio\/\w+;base64,/, ''), 'base64');
    const audioFile = new File([audioBuffer], 'recording.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    return NextResponse.json({
      success: true,
      text: transcription.text
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
