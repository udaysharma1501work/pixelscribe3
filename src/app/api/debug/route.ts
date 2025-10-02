import { NextResponse } from 'next/server';
import { listMeetings } from '@/lib/meetings-store';

export async function GET() {
  try {
    const meetings = await listMeetings();
    return NextResponse.json({ 
      meetings,
      count: meetings.length,
      storage: {
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        hasVercelBlobToken: !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
        isVercel: !!process.env.VERCEL
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
