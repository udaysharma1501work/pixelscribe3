import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-meeting-transcript.ts';
import '@/ai/flows/transcribe-meeting-audio.ts';
import '@/ai/flows/process-meeting-link.ts';
