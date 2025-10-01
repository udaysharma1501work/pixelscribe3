// This is a server-side file!
'use server';

/**
 * @fileOverview Transcribes meeting audio to text using Mistral AI's Voxtral model.
 *
 * - transcribeMeetingAudio - A function that transcribes the audio recording of a meeting into text.
 * - TranscribeMeetingAudioInput - The input type for the transcribeMeetingAudio function.
 * - TranscribeMeetingAudioOutput - The return type for the transcribeMeetingAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeMeetingAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio recording of the meeting as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeMeetingAudioInput = z.infer<typeof TranscribeMeetingAudioInputSchema>;

const TranscribeMeetingAudioOutputSchema = z.object({
  transcript: z.string().describe('The full transcript of the meeting audio.'),
});
export type TranscribeMeetingAudioOutput = z.infer<typeof TranscribeMeetingAudioOutputSchema>;

export async function transcribeMeetingAudio(input: TranscribeMeetingAudioInput): Promise<TranscribeMeetingAudioOutput> {
  return transcribeMeetingAudioFlow(input);
}

const transcribeMeetingAudioPrompt = ai.definePrompt({
  name: 'transcribeMeetingAudioPrompt',
  input: {schema: TranscribeMeetingAudioInputSchema},
  output: {schema: TranscribeMeetingAudioOutputSchema},
  prompt: `Transcribe the following audio recording to text.\n\nAudio: {{media url=audioDataUri}}`,
});

const transcribeMeetingAudioFlow = ai.defineFlow(
  {
    name: 'transcribeMeetingAudioFlow',
    inputSchema: TranscribeMeetingAudioInputSchema,
    outputSchema: TranscribeMeetingAudioOutputSchema,
  },
  async input => {
    const {output} = await transcribeMeetingAudioPrompt(input);
    return output!;
  }
);
