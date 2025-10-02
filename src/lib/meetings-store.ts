// This is a server-side file!
'use server';

import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
// Simple in-memory storage for now - will persist during function execution
let memoryStore: { meetings: MeetingRecord[] } = { meetings: [] };

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
  console.log('Loading meetings from memory store, count:', memoryStore.meetings.length);
  return memoryStore;
}

async function saveAll(data: { meetings: MeetingRecord[] }): Promise<void> {
  console.log('Saving meetings to memory store, count:', data.meetings.length);
  memoryStore = data;
  console.log('Saved to memory store successfully');
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



