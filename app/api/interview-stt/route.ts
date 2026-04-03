import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Deepgram API key not configured' }, { status: 500 });
    }

    const audioData = await req.arrayBuffer();

    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'audio/webm',
      },
      body: audioData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Deepgram error:', err);
      return NextResponse.json({ error: 'STT failed' }, { status: 500 });
    }

    const result = await response.json();
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    return NextResponse.json({ transcript });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('STT error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
