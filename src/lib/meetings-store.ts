// This is a server-side file!
'use server';

import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
// Optional: Vercel Blob in production
let vercelBlob: any = null;
try {
  // Lazy require to avoid build errors if not installed locally
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  vercelBlob = require('@vercel/blob');
} catch {}

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
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

console.log('Storage config:', {
  USE_BLOB,
  hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  hasVercelBlobToken: !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
  vercelBlobAvailable: !!vercelBlob
});

const BLOB_KEY = 'pixelscribe/meetings.json';

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(MEETINGS_FILE);
  } catch {
    await fs.writeFile(MEETINGS_FILE, JSON.stringify({ meetings: [] }, null, 2), 'utf8');
  }
}

async function loadAll(): Promise<{ meetings: MeetingRecord[] }> {
  if (USE_BLOB && vercelBlob) {
    try {
      const { list } = vercelBlob;
      const listing = await list({ prefix: BLOB_KEY, token: process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN });
      const existing = (listing.blobs || []).find((b: any) => b.pathname === BLOB_KEY);
      if (!existing) {
        return { meetings: [] };
      }
      const res = await fetch(existing.url, { cache: 'no-store' });
      if (!res.ok) return { meetings: [] };
      const json = await res.json();
      return json;
    } catch (error) {
      console.error('Error loading from blob:', error);
      return { meetings: [] };
    }
  }

  // Fallback: in-memory storage for Vercel (not persistent across function invocations)
  if (process.env.VERCEL) {
    console.log('Using in-memory storage (not persistent)');
    return { meetings: [] };
  }

  try {
    await ensureDataFile();
    const raw = await fs.readFile(MEETINGS_FILE, 'utf8');
    return JSON.parse(raw || '{"meetings":[]}');
  } catch (error) {
    console.error('Error loading from filesystem:', error);
    return { meetings: [] };
  }
}

async function saveAll(data: { meetings: MeetingRecord[] }): Promise<void> {
  if (USE_BLOB && vercelBlob) {
    try {
      const { put } = vercelBlob;
      await put(BLOB_KEY, JSON.stringify(data, null, 2), {
        access: 'private',
        contentType: 'application/json',
        token: process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });
      console.log('Saved to blob successfully');
      return;
    } catch (error) {
      console.error('Error saving to blob:', error);
      // Continue to fallback
    }
  }

  // Fallback: in-memory storage for Vercel (not persistent)
  if (process.env.VERCEL) {
    console.log('Using in-memory storage (not persistent) - data will be lost on function restart');
    return;
  }

  try {
    await ensureDataFile();
    await fs.writeFile(MEETINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving to filesystem:', error);
    throw error;
  }
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



