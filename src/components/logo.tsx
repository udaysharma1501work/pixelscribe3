import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline text-5xl font-bold tracking-tighter", className)}>
      <span className="text-shadow text-primary-foreground">Pixel</span>
      <span className="text-shadow text-accent">Scribe</span>
    </div>
  )
}
