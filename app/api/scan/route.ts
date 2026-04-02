import { NextRequest, NextResponse } from 'next/server';
import { analyzePollution } from '@/lib/gemini';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body as { imageBase64: string; mimeType: string };

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing imageBase64 or mimeType' }, { status: 400 });
    }

    // Remove data URL prefix if present
    const base64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const result = await analyzePollution(base64, mimeType);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Scan API error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}
