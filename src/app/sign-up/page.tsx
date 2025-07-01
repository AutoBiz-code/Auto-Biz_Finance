
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import type { AuthError } from "firebase/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      let friendlyMessage: React.ReactNode = "A sign-up error occurred. Please try again.";

      switch (authError.code) {
        case 'auth/email-already-in-use':
          setTimeout(() => router.push('/sign-in'), 3000);
          friendlyMessage = (
            <span>
              An account with this email already exists. Redirecting you to{" "}
              <Link href="/sign-in" className="font-bold text-primary hover:underline">
                Sign In
              </Link>...
            </span>
          );
          break;
        case 'auth/invalid-email':
          friendlyMessage = "The email address is not valid.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "The password is too weak. It must be at least 6 characters long.";
          break;
        case 'auth/operation-not-allowed':
          friendlyMessage = "Email sign-up is currently disabled. Please enable it in your Firebase project's authentication settings.";
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
    } catch (error) {
      setIsGoogleLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 fade-in bg-transparent">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground border-border/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage accounts, track inventory, and comply with GST effortlessly with AutoBiz Finance.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignUp}>
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
                placeholder="•••••••• (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full hover-scale" disabled={anyLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Sign Up with Email
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign In
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
                Sign up with Google
            </Button>
        </CardContent>
        
      </Card>
    </div>
  );
}
