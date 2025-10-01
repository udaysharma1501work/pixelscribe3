'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const processingSteps = [
  "Dispatching bot to meeting...",
  "Bot is recording...",
  "Transcribing and summarizing...",
  "Done!",
];

export default function NewMeetingPage() {
  const [meetingLink, setMeetingLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingLink) {
      toast({
        variant: 'destructive',
        title: 'No link provided',
        description: 'Please provide a Google Meet link to start.',
      });
      return;
    }
    setIsProcessing(true);
    
    try {
      // Step 1: Dispatch bot
      setCurrentStep(processingSteps[0]);
      setProgress(10);
      
      // Step 2: "Recording"
      // In a real scenario, this would be a long-running task.
      // We will just move through the steps for demonstration.
       setTimeout(() => {
        setCurrentStep(processingSteps[1]);
        setProgress(33);
      }, 2000);


      // Step 3: Create meeting via API
      setCurrentStep(processingSteps[2]);
      setProgress(66);
      const resp = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: meetingLink }),
      });
      if (!resp.ok) {
        throw new Error(`Failed to create meeting (${resp.status})`);
      }
      const { id } = await resp.json();

      // Step 4: Done & Redirect to meeting detail page
      setCurrentStep(processingSteps[3]);
      setProgress(100);
      setTimeout(() => router.push(`/dashboard/meeting/${id}`), 800);

    } catch (error) {
      console.error("Processing failed:", error);
      let description = "Could not process the meeting link. Please try again.";
      if (error instanceof Error) {
        description = error.message.includes('Invalid URL') ? 'Please enter a valid Google Meet link.' : description;
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: description,
      });
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-lg border-2 retro-shadow">
        <CardHeader>
          <CardTitle>New Meeting</CardTitle>
          <CardDescription>
            Provide a Google Meet link and Pixelscribe will join, record, and process it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isProcessing ? (
            <form onSubmit={handleStart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-link">Google Meet Link</Label>
                <Input
                  id="meeting-link"
                  type="url"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  required
                  className="border-2"
                />
              </div>
              <Button type="submit" className="w-full gap-2 border-2 retro-shadow retro-shadow-hover" disabled={!meetingLink}>
                <Bot className="h-4 w-4" />
                Dispatch Bot
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <Progress value={progress} className="h-4 border-2 border-primary" />
              <p className="font-mono text-sm text-accent animate-pulse">{currentStep}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
