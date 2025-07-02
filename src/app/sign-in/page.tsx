
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, LogIn, Phone } from "lucide-react";
import type { AuthError, ConfirmationResult } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  const { signIn, signInWithGoogle, setupRecaptcha, signInWithPhone } = useAuth(); 
  const { toast } = useToast();

  useEffect(() => {
    // Ensure the recaptcha container is available before setting up
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (recaptchaContainer) {
      setupRecaptcha("recaptcha-container");
    }
  }, [setupRecaptcha]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      // AppWrapper will handle redirect
    } catch (error) {
      const authError = error as AuthError;
      let friendlyMessage: React.ReactNode = `An unexpected error occurred. (Code: ${authError.code})`;
      switch (authError.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          friendlyMessage = "Invalid email or password. Please try again.";
          break;
        case 'auth/invalid-email':
          friendlyMessage = "The email address you entered is not valid.";
          break;
        case 'auth/user-disabled':
          friendlyMessage = "This user account has been disabled.";
          break;
        case 'auth/unauthorized-domain':
          friendlyMessage = "This domain is not authorized for authentication. Please add it to your Firebase project's allowed domains.";
          break;
        case 'auth/operation-not-allowed':
          friendlyMessage = "Email/Password sign-in is not enabled. Please enable it in your Firebase project settings.";
          break;
        case 'auth/network-request-failed':
          friendlyMessage = "Network error. Please check your internet connection.";
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
      await signInWithGoogle('signin');
      // AppWrapper will handle loading state during redirect
    } catch (error) {
      // Error is now handled by the toast in AuthContext after redirect
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    setError(null);
    if (!phone) {
      setError("Please enter a valid phone number.");
      return;
    }
    setIsPhoneLoading(true);
    try {
      const verifier = window.recaptchaVerifier;
      if (!verifier) {
          // Render the verifier if it's not there.
          const newVerifier = setupRecaptcha('recaptcha-container');
          await newVerifier.render(); // This might be needed if it was cleared
          const result = await signInWithPhone(phone, newVerifier);
          setConfirmationResult(result);
      } else {
          const result = await signInWithPhone(phone, verifier);
          setConfirmationResult(result);
      }
      
      setShowOtpInput(true);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code."});
    } catch (error) {
      console.error(error);
      const authError = error as AuthError;
      let friendlyMessage = "Failed to send OTP. Please try again.";
      if (authError.code === 'auth/invalid-phone-number') {
        friendlyMessage = "The phone number is not valid. Please include the country code (e.g., +91).";
      }
      setError(friendlyMessage);
    } finally {
      setIsPhoneLoading(false);
    }
  }

  const handleVerifyOtp = async () => {
    setError(null);
    if (!otp || !confirmationResult) {
      setError("Please enter the OTP.");
      return;
    }
    setIsPhoneLoading(true);
    try {
      await confirmationResult.confirm(otp);
      // AppWrapper will handle redirect
    } catch (error) {
      const authError = error as AuthError;
      let friendlyMessage = "Failed to verify OTP.";
      if(authError.code === 'auth/invalid-verification-code') {
        friendlyMessage = "The OTP you entered is invalid.";
      }
      setError(friendlyMessage);
    } finally {
      setIsPhoneLoading(false);
    }
  }

  const anyLoading = isLoading || isGoogleLoading || isPhoneLoading;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 fade-in bg-transparent">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground border-border/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showOtpInput ? (
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full hover-scale" disabled={anyLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Sign In with Email
                </Button>
              </form>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR</span>
                  <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Social Logins */}
              <div className="space-y-2">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={anyLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
                    Sign in with Google
                </Button>
              </div>

              {/* Phone Login */}
              <form onSubmit={(e) => {e.preventDefault(); handlePhoneSignIn();}} className="space-y-2">
                  <Label htmlFor="phone" className="text-card-foreground">Sign in with Phone</Label>
                  <div className="flex gap-2">
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                      <Button type="submit" variant="outline" onClick={handlePhoneSignIn} disabled={anyLoading}>
                          {isPhoneLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4"/>}
                      </Button>
                  </div>
              </form>
            </>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp();}} className="space-y-4">
              <Label htmlFor="otp">Enter OTP sent to {phone}</Label>
              <Input id="otp" type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required autoFocus />
              <Button type="submit" className="w-full" disabled={isPhoneLoading}>
                {isPhoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify & Sign In
              </Button>
              <Button variant="link" onClick={() => setShowOtpInput(false)}>Back</Button>
            </form>
          )}
          <div id="recaptcha-container" className="flex justify-center"></div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
