import { NextRequest, NextResponse } from 'next/server';
import { createMeeting, updateMeeting } from '@/lib/meetings-store';
import { processMeetingLink } from '@/ai/flows/process-meeting-link';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const link: string | undefined = body?.link;
    if (!link || typeof link !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid link' }, { status: 400 });
    }

    const meeting = await createMeeting(link);

    // Fire-and-forget processing using the placeholder flow for now
    // In production, move to a durable queue/cron/task runner.
    ;(async () => {
      try {
        await updateMeeting(meeting.id, { status: 'recording' });
        const result = await processMeetingLink({ meetingLink: link });
        await updateMeeting(meeting.id, {
          status: 'completed',
          title: result.title,
          summary: result.summary,
          transcript: result.transcript,
        });
      } catch (err: unknown) {
        await updateMeeting(meeting.id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    })();

    return NextResponse.json({ id: meeting.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}



