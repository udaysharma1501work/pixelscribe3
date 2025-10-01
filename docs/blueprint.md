# **App Name**: Pixelscribe

## Core Features:

- User Authentication: Secure user sign-up/login with Firebase Authentication or MongoDB Atlas, enabling personalized meeting histories.
- Meeting Bot: Launch an automated bot on the backend that joins a Google Meet via provided URL.
- Audio Recording: Record the full audio from all participants within the Google Meet.
- Audio Transcription: Transcribe recorded audio to text using Mistral AI's Voxtral model via vLLM.
- AI Summarization: Generate a key summary of the meeting using the full transcript via a Mistral AI tool (vLLM).
- Meeting Data Storage: Store meeting links, titles, timestamps, transcripts, and AI summaries in Firestore or MongoDB Atlas.
- Meeting History Display: Display a list of past meetings with options to view the full transcript and AI summary.

## Style Guidelines:

- Primary color: Dark forest green (#3A4A33) for a cool and calm foundation.
- Background color: Dark slate gray (#A8BBA3) with low saturation to emulate retro dark palettes.
- Accent color: Light brown (#B87C4C) for highlights and interactive elements, ensuring sufficient contrast against the darker background.
- Body and headline font: 'PT Sans', a humanist sans-serif font, suitable for both headlines and body text in a retro UI.
- Implement pixel-art style icons with animations, a retro bot avatar, and animated microphone icon.
- Use a layout reminiscent of old 8-bit games, incorporating retro design elements for a nostalgic feel.
- Integrate retro animations (blinking cursor, game-like loading bar) for dynamic user engagement.