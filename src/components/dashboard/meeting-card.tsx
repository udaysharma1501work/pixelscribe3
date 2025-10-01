import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Meeting } from "@/lib/mock-data";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Card className="border-2 retro-shadow">
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{meeting.title}</CardTitle>
          <CardDescription>
            {new Date(meeting.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
         <p className="line-clamp-3">{meeting.summary}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full border-2 retro-shadow retro-shadow-hover" asChild>
          <Link href={`/dashboard/meeting/${meeting.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
