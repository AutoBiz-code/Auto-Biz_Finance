
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
import { Loader2, UserPlus } from "lucide-react";
import type { AuthError } from "firebase/auth";
import { Separator } from "@/components/ui/separator";

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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M19.334 14.398c-.546.966-1.144 1.89-2.025 2.525-.865.626-1.855.966-2.91.933-.993.024-2.01-.303-2.83-.805-1.22-.733-2.06-1.95-2.8-3.237-.463-.805-.85-1.633-1.12-2.525C7.324 11.2 7.3 10.9 7.3 10.65c0-.25.024-.5.07-.75.047-.25.118-.502.21-.752.28-.733.644-1.442 1.12-2.06.888-1.214 2.13-1.94 3.49-2.037.97-.07 1.94.212 2.76.708.41.25.78.577 1.1 1-.41-.277-.843-.48-1.29-.602-.448-.12-1.01-.167-1.44.024-.96.408-1.734 1.213-2.25 2.107-.46.805-.84 1.7-.84 2.812s.28 2.083.81 2.885c.38.577.81.955 1.33 1.144.52.19.96.213 1.4.19.07 0 .14-.002.21-.005.353-.01.7-.12 1.05-.287.41-.19.78-.455 1.1-.78-.02.012-.04.024-.06.036-.61.432-1.34.65-2.13.65-.54 0-1.08-.12-1.57-.355-.49-.234-.92-.577-1.27-1.022-.28-.38-.51-.83-.65-1.33-.14-.5-.21-1.04-.21-1.59s.07-1.09.21-1.59c.14-.5.37-1 .68-1.38.31-.38.7-.68 1.12-.91.42-.23.9-.355 1.4-.355.61 0 1.2.167 1.76.48.56.313 1.05.752 1.44 1.285.38.532.61 1.163.61 1.83 0 .19-.01.38-.04.577-.03.19-.07.38-.14.553-.07.17-.16.33-.28.48a.85.85 0 0 1-.26.284c-.11.083-.24.12-.38.12-.14 0-.28-.05-.38-.144-.1-.095-.19-.214-.24-.356-.1-.307-.15-.615-.15-.925s.05-.615.15-.924c.05-.142.14-.26.24-.356.2-.19.48-.285.78-.285.28 0 .54.07.75.21.21.144.38.335.5.577.33.733.49 1.54.49 2.41 0 .78-.17 1.54-.52 2.21zm-1.12-5.467c.36-.21.72-.357 1.08-.43.05-.01.09-.02.14-.03-.1-.144-.21-.287-.33-.408-.36-.356-.77-.615-1.22-.78-.5-.166-1.01-.19-1.52-.095-.92.19-1.74.755-2.3 1.52-.28.38-.51.81-.63 1.285-.12.47-.19.96-.19 1.47s.07.97.19 1.44c.12.47.35.91.66 1.28.31.37.7.66 1.12.86.42.2.89.308 1.38.308.33 0 .66-.05.97-.144.31-.095.61-.237.88-.43-.38.21-.78.357-1.2.43-.33.05-.66.07-.97.07-.63 0-1.27-.19-1.83-.553-.56-.363-1.03-.87-1.38-1.49-.35-.61-.53-1.3-.53-2.03s.18-1.42.53-2.03c.35-.62.82-1.13 1.38-1.5.56-.36 1.2-.54 1.84-.54.38 0 .77.05 1.14.144z"/>
        </svg>
    );
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { signUp, signInWithGoogle, signInWithApple } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password should be at least 6 characters.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password); 
      toast({ title: "Success", description: "Account created successfully! Redirecting..." });
      router.push("/"); 
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign up error:", authError);
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      if (authError.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email address is already in use.";
      } else if (authError.code === 'auth/invalid-email') {
        friendlyMessage = "The email address is not valid.";
      } else if (authError.code === 'auth/weak-password') {
        friendlyMessage = "The password is too weak.";
      } else if (authError.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        friendlyMessage = "API Key not valid. Please ensure Firebase is configured correctly by the administrator.";
      }
      toast({
        title: "Sign Up Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
    } else {
      setIsAppleLoading(true);
    }
    
    try {
      const signInMethod = provider === 'google' ? signInWithGoogle : signInWithApple;
      await signInMethod();
      toast({ title: "Success", description: "Signed up and logged in successfully." });
      router.push("/");
    } catch (error) {
      const authError = error as AuthError;
      console.error(`Sign in with ${provider} error:`, authError);
      let friendlyMessage = `An error occurred while signing up with ${provider}. Please try again.`;
       if (authError.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "Sign-up cancelled. The sign-in window was closed before completion.";
      } else if (authError.code === 'auth/account-exists-with-different-credential') {
        friendlyMessage = "An account already exists with the same email address but different sign-in credentials. Try signing in with the original method."
      }
      toast({
        title: "Sign Up Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
      setIsAppleLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 fade-in bg-transparent">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join AutoBiz Finance to automate your workflows.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('google')} disabled={isGoogleLoading || isAppleLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
                    Google
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('apple')} disabled={isGoogleLoading || isAppleLoading}>
                    {isAppleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AppleIcon className="mr-2 h-5 w-5" />}
                    Apple
                </Button>
            </div>

            <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
        </CardContent>

        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-6">
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
            <Button type="submit" className="w-full btn-metamask hover-scale" disabled={isLoading || isGoogleLoading || isAppleLoading}>
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
      </Card>
    </div>
  );
}
