import { NextRequest, NextResponse } from 'next/server';
import { getMeeting } from '@/lib/meetings-store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  console.log('Getting meeting with ID:', params.id);
  try {
    const meeting = await getMeeting(params.id);
    console.log('Found meeting:', meeting ? 'Yes' : 'No');
    if (!meeting) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error getting meeting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



