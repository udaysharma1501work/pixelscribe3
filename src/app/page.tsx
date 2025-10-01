import { LoginForm } from "@/components/auth/login-form";
import { BlinkingCursor } from "@/components/blinking-cursor";
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo />
        <div className="flex items-center gap-2">
           <p className="font-mono text-muted-foreground">Google Meet Summarizer powered by Mistral AI</p>
           {/* <Image src="/mistral-ai-icon.png" alt="mistral-ai-icon" width={50} height={50} className="h-5 w-5"/> */}
           <BlinkingCursor />
        </div>
      </div>
      
      <LoginForm />
      
    </main>
  );
}
