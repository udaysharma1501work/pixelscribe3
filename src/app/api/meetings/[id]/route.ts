import { NextRequest, NextResponse } from 'next/server';
import { getMeeting } from '@/lib/meetings-store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const meeting = await getMeeting(params.id);
  if (!meeting) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(meeting);
}



