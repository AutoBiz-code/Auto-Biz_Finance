
"use client";

// This page was previously for Clerk User Profile.
// With Firebase Auth, user profile management would be custom.
// For now, this page can be removed or repurposed.
// We are redirecting to home/dashboard after login.

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle } from 'lucide-react';

export default function UserProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out from profile:", error);
      // Handle toast or other error display if necessary
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Or a message prompting to sign in, though redirect should handle this
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fade-in">
      <Card className="w-full max-w-lg shadow-2xl bg-card text-card-foreground">
        <CardHeader className="text-center">
          <UserCircle className="h-20 w-20 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-headline text-primary">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">
            <span className="font-medium text-card-foreground">Email:</span>{" "}
            <span className="text-muted-foreground">{user.email}</span>
          </p>
          <p className="text-lg">
            <span className="font-medium text-card-foreground">User ID:</span>{" "}
            <span className="text-muted-foreground text-xs">{user.uid}</span>
          </p>
          {/* Add more user details here as needed */}
          <Button onClick={handleSignOut} className="mt-6 btn-metamask hover-scale">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
