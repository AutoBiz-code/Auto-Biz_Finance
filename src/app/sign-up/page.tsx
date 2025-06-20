
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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth(); 
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

  return (
    <div className="flex items-center justify-center min-h-screen p-4 fade-in bg-transparent">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join AutoBiz Finance to automate your workflows.
          </CardDescription>
        </CardHeader>
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
            <Button type="submit" className="w-full btn-metamask hover-scale" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Sign Up
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
