import Link from "next/link";
import { Button } from "@/components/ui/button";
import { meetings } from "@/lib/mock-data";
import { MeetingCard } from "@/components/dashboard/meeting-card";

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">My Meetings</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1 border-2 retro-shadow retro-shadow-hover" asChild>
            <Link href="/dashboard/new">
              New Meeting
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
       <div
        className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm bg-card/50"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            You have no more meetings
          </h3>
          <p className="text-sm text-muted-foreground">
            Start a new meeting to see your transcript here.
          </p>
          <Button className="mt-4 border-2 retro-shadow retro-shadow-hover" asChild>
            <Link href="/dashboard/new">New Meeting</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
