// This is a server-side file!
'use server';

import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
// Use a simple JSON file in /tmp (writable on Vercel)
const TMP_FILE = '/tmp/meetings.json';

export type MeetingTranscriptSegment = {
  speaker: string;
  timestamp: string;
  text: string;
};

export type MeetingRecord = {
  id: string;
  link: string;
  title: string;
  date: string;
  status: 'queued' | 'recording' | 'processing' | 'completed' | 'failed';
  summary?: string;
  transcript?: MeetingTranscriptSegment[];
  errorMessage?: string;
};

const DATA_DIR = path.join(process.cwd(), '.data');
const MEETINGS_FILE = path.join(DATA_DIR, 'meetings.json');

console.log('Using simple in-memory storage for Vercel');

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(MEETINGS_FILE);
  } catch {
    await fs.writeFile(MEETINGS_FILE, JSON.stringify({ meetings: [] }, null, 2), 'utf8');
  }
}

async function loadAll(): Promise<{ meetings: MeetingRecord[] }> {
  try {
    const raw = await fs.readFile(TMP_FILE, 'utf8');
    const data = JSON.parse(raw || '{"meetings":[]}');
    console.log('Loaded meetings from /tmp, count:', data.meetings.length);
    return data;
  } catch (error) {
    console.log('No existing file, starting with empty meetings');
    return { meetings: [] };
  }
}

async function saveAll(data: { meetings: MeetingRecord[] }): Promise<void> {
  console.log('Saving meetings to /tmp, count:', data.meetings.length);
  await fs.writeFile(TMP_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved to /tmp successfully');
}

export async function createMeeting(link: string): Promise<MeetingRecord> {
  try {
    const id = randomUUID();
    const now = new Date().toISOString();
    const record: MeetingRecord = {
      id,
      link,
      title: `Meeting: ${link.split('/').pop() || id}`,
      date: now,
      status: 'queued',
    };
    console.log('Creating meeting record:', record);
    const data = await loadAll();
    console.log('Loaded existing data, meetings count:', data.meetings.length);
    data.meetings.unshift(record);
    await saveAll(data);
    console.log('Saved meeting record successfully');
    return record;
  } catch (error) {
    console.error('Error in createMeeting:', error);
    throw error;
  }
}

export async function getMeeting(id: string): Promise<MeetingRecord | null> {
  console.log('getMeeting called with ID:', id);
  const data = await loadAll();
  console.log('Total meetings in storage:', data.meetings.length);
  console.log('Meeting IDs in storage:', data.meetings.map(m => m.id));
  const meeting = data.meetings.find(m => m.id === id) || null;
  console.log('Found meeting:', meeting ? 'Yes' : 'No');
  return meeting;
}

export async function listMeetings(): Promise<MeetingRecord[]> {
  const data = await loadAll();
  return data.meetings;
}

export async function updateMeeting(id: string, patch: Partial<MeetingRecord>): Promise<MeetingRecord | null> {
  const data = await loadAll();
  const idx = data.meetings.findIndex(m => m.id === id);
  if (idx === -1) return null;
  const updated: MeetingRecord = { ...data.meetings[idx], ...patch, id };
  data.meetings[idx] = updated;
  await saveAll(data);
  return updated;
}



