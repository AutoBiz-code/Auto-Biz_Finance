
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import type { AuthError } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.938,44,30.417,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M19.143 14.302c-.08 3.65-2.52 5.568-4.938 5.586-1.07.02-2.12-.47-3.15-.47-.96 0-2.12.47-3.21.5-.22 0-.43-.02-.64-.04-1.33-.09-2.73-.74-3.75-2.26-.01 0-.01 0 0 0-2.1-3.21-.8-7.3 1.5-9.52 1.14-1.08 2.58-1.74 4.12-1.74 1.13 0 2.25.43 3.19.43.9-.01 2.2-.5 3.32-.43.58.02 1.16.14 1.7.35 1.13.43 2.14 1.28 2.14 1.28s-1.14.73-2.2 1.43c-1.12.73-2.3 1.5-2.3 2.65.02 1.34 1.3 1.93 2.45 1.21.22-.15.45-.33.68-.54.2-.18.38-.36.54-.53a.28.28 0 01.3-.1c.07 0 .1.03.1.04.02.03-.04.06-1.1 1.05zM15.58 6.16c.92-.99 1.48-2.28 1.34-3.55-.96.06-2.21.64-3.13 1.63-.82.88-1.5 2.2-1.34 3.42.3.02 1.05-.18 2.05-.62s1.02-.7 1.08-.88z"/>
        </svg>
    )
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signInWithGoogle, signInWithApple } = useAuth(); 
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      router.push("/"); 
    } catch (error) {
      const authError = error as AuthError;
      
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      switch (authError.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          friendlyMessage = "Incorrect email or password. Please try again.";
          break;
        case 'auth/invalid-email':
          friendlyMessage = "The email address is not valid.";
          break;
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // On successful redirect, the user will be brought back and AuthContext will handle it.
    } catch (error) {
      setIsGoogleLoading(false);
      setError("Failed to start Google sign-in. Please try again.");
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    setError(null);
    try {
      await signInWithApple();
    } catch (error) {
      setIsAppleLoading(false);
      setError("Failed to start Apple sign-in. Please try again.");
    }
  };

  const anyLoading = isLoading || isGoogleLoading || isAppleLoading;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 fade-in bg-transparent">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline" style={{ color: 'white' }}>Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your automated finance dashboard.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
             {error && (
              <Alert variant="destructive" className="fade-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full btn-tally-gradient hover-scale" disabled={anyLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Sign In with Email
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>

        <CardContent className="space-y-4">
            <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={anyLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
                Sign in with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={anyLoading}>
                {isAppleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AppleIcon className="mr-2 h-5 w-5" />}
                Sign in with Apple
            </Button>
        </CardContent>

      </Card>
    </div>
  );
}
