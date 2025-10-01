import { SignupForm } from "@/components/auth/signup-form";
import { BlinkingCursor } from "@/components/blinking-cursor";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo />
        <div className="flex items-center gap-2">
           <p className="font-mono text-muted-foreground">Create your Pixelscribe account</p>
           <BlinkingCursor />
        </div>
      </div>
      
      <SignupForm />
      
    </main>
  );
}
