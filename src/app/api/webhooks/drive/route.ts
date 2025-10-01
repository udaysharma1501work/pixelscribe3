import { NextRequest, NextResponse } from 'next/server';
import { transcribeMeetingAudio } from '@/ai/flows/transcribe-meeting-audio';
import { summarizeMeetingTranscript } from '@/ai/flows/summarize-meeting-transcript';
import { updateMeeting } from '@/lib/meetings-store';

// Placeholder webhook to simulate receiving a recording ready event from Google Drive/Meet
// In production, verify signatures and permissions.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const meetingId: string | undefined = body?.meetingId;
    const audioDataUri: string | undefined = body?.audioDataUri;
    const recordingUrl: string | undefined = body?.recordingUrl;

    if (!meetingId) {
      return NextResponse.json({ error: 'meetingId is required' }, { status: 400 });
    }

    // Mark processing
    await updateMeeting(meetingId, { status: 'processing' });

    // If audioDataUri is provided directly, use it. Otherwise, in a real impl
    // we would download from recordingUrl (not implemented here).
    if (!audioDataUri && recordingUrl) {
      // TODO: fetch and convert to data URI; omitted for MVP
      return NextResponse.json({ error: 'Downloading from recordingUrl not implemented in MVP' }, { status: 501 });
    }
    if (!audioDataUri) {
      return NextResponse.json({ error: 'audioDataUri is required for MVP' }, { status: 400 });
    }

    const { transcript } = await transcribeMeetingAudio({ audioDataUri });
    const { summary } = await summarizeMeetingTranscript({ transcript });

    // Basic segmentation by lines for UI display
    const segments = transcript.split('\n').map((line, idx) => ({
      speaker: `Speaker ${1 + (idx % 2)}`,
      timestamp: '00:00:00',
      text: line,
    }));

    await updateMeeting(meetingId, {
      status: 'completed',
      summary,
      transcript: segments,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON or processing error' }, { status: 400 });
  }
}



