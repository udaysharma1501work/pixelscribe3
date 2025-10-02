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

    console.log('Creating meeting for link:', link);
    const meeting = await createMeeting(link);
    console.log('Created meeting:', meeting.id);

    // Fire-and-forget processing using the placeholder flow for now
    // In production, move to a durable queue/cron/task runner.
    ;(async () => {
      try {
        await updateMeeting(meeting.id, { status: 'recording' });
        
        // Only run AI processing if API key is available
        console.log('GOOGLE_API_KEY available:', !!process.env.GOOGLE_API_KEY);
        if (process.env.GOOGLE_API_KEY) {
          console.log('Running AI processing...');
          const result = await processMeetingLink({ meetingLink: link });
          await updateMeeting(meeting.id, {
            status: 'completed',
            title: result.title,
            summary: result.summary,
            transcript: result.transcript,
          });
          console.log('AI processing completed');
        } else {
          // No API key - just mark as queued for manual processing
          console.log('No API key, marking as queued');
          await updateMeeting(meeting.id, { 
            status: 'queued',
            errorMessage: 'AI processing requires GOOGLE_API_KEY to be set'
          });
        }
      } catch (err: unknown) {
        await updateMeeting(meeting.id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    })();

    // Trigger the bot to start recording
    if (process.env.BOT_SERVICE_URL) {
      try {
        console.log('Triggering bot to start recording...');
        const botResponse = await fetch(`${process.env.BOT_SERVICE_URL}/start-recording`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetingId: meeting.id,
            meetLink: link
          })
        });
        
        if (botResponse.ok) {
          console.log('Bot recording started successfully');
        } else {
          console.error('Bot failed to start:', await botResponse.text());
        }
      } catch (error) {
        console.error('Error triggering bot:', error);
      }
    } else {
      console.log('BOT_SERVICE_URL not set, skipping bot trigger');
    }

    return NextResponse.json({ id: meeting.id }, { status: 201 });
  } catch (e) {
    console.error('Error in POST /api/meetings:', e);
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}



