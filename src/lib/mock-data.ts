export type TranscriptSegment = {
  speaker: string;
  timestamp: string;
  text: string;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  summary: string;
  transcript: TranscriptSegment[];
};

export const meetings: Meeting[] = [
  {
    id: "proj-sync-001",
    title: "Project Sync - Q2 Roadmap",
    date: "2024-05-10",
    summary:
      "The team aligned on the Q2 roadmap, prioritizing the 'Pixel Engine' feature. Key decisions included allocating extra resources to the UI/UX team and setting a hard deadline for the alpha release on June 15th. Action items were assigned to Alex for resource management and to Sarah for updating the project timeline.",
    transcript: [
      {
        speaker: "Alice",
        timestamp: "00:01:23",
        text: "Alright team, let's kick off the Q2 roadmap discussion. Top of the list is the 'Pixel Engine' feature. Where are we with that?",
      },
      {
        speaker: "Bob",
        timestamp: "00:01:55",
        text: "We've completed the initial prototyping. The core logic is sound, but we're facing some challenges with rendering performance on older devices.",
      },
      {
        speaker: "Charlie",
        timestamp: "00:02:30",
        text: "I agree. The UI/UX team needs more resources if we want to hit the performance targets without compromising the design. I suggest we allocate Alex to help with optimization.",
      },
      {
        speaker: "Alice",
        timestamp: "00:03:10",
        text: "Good point, Charlie. Alex, can you support the UI/UX team on this? Let's make that a priority. We need a hard deadline for the alpha release. How does June 15th sound?",
      },
      {
        speaker: "Sarah",
        timestamp: "00:03:45",
        text: "June 15th is aggressive but doable if we get the extra resources. I'll update the project timeline and create the new tickets.",
      },
    ],
  },
  {
    id: "marketing-strat-002",
    title: "Marketing Strategy Session",
    date: "2024-05-08",
    summary:
      "The marketing team reviewed the campaign performance for April. The 'Retro Reels' social media campaign exceeded expectations, driving a 20% increase in user engagement. The team decided to double down on video content for May and explore a partnership with influencer 'Pixel-Pete'.",
    transcript: [
      {
        speaker: "Dave",
        timestamp: "00:00:45",
        text: "Let's look at the April numbers. The 'Retro Reels' campaign was a huge success.",
      },
      {
        speaker: "Eve",
        timestamp: "00:01:20",
        text: "Absolutely. We saw a 20% jump in engagement across all platforms. The 8-bit aesthetic is really resonating with our audience.",
      },
      {
        speaker: "Dave",
        timestamp: "00:01:50",
        text: "I think we should double down on video content. What if we did a collaboration? I was thinking of reaching out to 'Pixel-Pete'.",
      },
      {
        speaker: "Frank",
        timestamp: "00:02:15",
        text: "Pixel-Pete would be a great fit. I'll draft an outreach email and run the numbers on a potential partnership.",
      },
    ],
  },
];
