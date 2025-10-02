import { NextRequest, NextResponse } from 'next/server';
import { getMeeting, updateMeeting } from '@/lib/meetings-store';

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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('Updating meeting with ID:', params.id);
  try {
    const body = await req.json();
    const { status, errorMessage } = body;
    
    const updatedMeeting = await updateMeeting(params.id, { status, errorMessage });
    if (!updatedMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    
    console.log('Meeting updated successfully');
    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



