import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  return (

    <Card className="mx-auto mt-8 w-full max-w-sm border-2 retro-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        {/* <CardDescription>
          Enter your email below to login to your account
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              required
              className="border-2"
            />
          </div>


          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link
                href="#"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link> */}
            </div>
            <Input id="password" type="password" required className="border-2" />
          </div>

          {/* <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                required
                className="border-2 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  const input = document.getElementById("password") as HTMLInputElement;
                  if (input) {
                    input.type = input.type === "password" ? "text" : "password";
                  }
                }}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div> */}
          
          <Button type="submit" className="w-full border-2 retro-shadow retro-shadow-hover" asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
