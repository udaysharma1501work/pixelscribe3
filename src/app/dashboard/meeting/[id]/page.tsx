'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Meeting } from "@/lib/mock-data";
import { notFound, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

export default function MeetingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [meeting, setMeeting] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const pollIntervalMs = 3000;

  const isDone = useMemo(() => meeting?.status === 'completed' || meeting?.status === 'failed', [meeting]);

  useEffect(() => {
    let cancelled = false;

    async function fetchOnce() {
      try {
        const resp = await fetch(`/api/meetings/${id}`, { cache: 'no-store' });
        if (!resp.ok) {
          setMeeting(null);
          setLoading(false);
          return;
        }
        const data = await resp.json();
        if (!cancelled) {
          setMeeting(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOnce();

    const interval = setInterval(() => {
      if (!isDone) {
        fetchOnce();
      }
    }, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, isDone]);


  if (loading) {
    return (
       <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!meeting) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
          <p className="text-sm text-muted-foreground">
             {new Date(meeting.date).toLocaleDateString("en-US", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
          </p>
        </div>
         <Button asChild variant="outline" className="ml-auto">
            <Link href="/dashboard">Back to Meetings</Link>
         </Button>
      </div>

      {meeting.status !== 'completed' && (
        <div className="rounded-md border-2 p-3 text-sm">
          <span className="font-medium">Status:</span> {meeting.status}
          {meeting.errorMessage ? (
            <span className="ml-2 text-destructive">{meeting.errorMessage}</span>
          ) : null}
        </div>
      )}
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary"><Bot className="mr-2 h-4 w-4" /> AI Summary</TabsTrigger>
          <TabsTrigger value="transcript"><FileText className="mr-2 h-4 w-4" /> Transcript</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>AI Generated Summary</CardTitle>
              <CardDescription>
                A concise overview of the key points and action items from the
                meeting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{meeting.summary || 'Summary will appear here once processing completes.'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transcript">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Full Transcript</CardTitle>
              <CardDescription>
                A complete record of the conversation from the meeting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(meeting.transcript || []).map((segment: any, index: number) => (
                <div key={index} className="grid grid-cols-[80px_1fr] gap-4">
                  <div className="font-mono text-xs text-right text-accent">
                    {segment.timestamp}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-foreground">{segment.speaker}</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{segment.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
