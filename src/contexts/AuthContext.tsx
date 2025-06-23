
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithRedirect, getRedirectResult, GoogleAuthProvider, AuthError } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>; // No longer returns UserCredential directly
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true); // Start true to handle initial load
  const { toast } = useToast();

  // Handles redirect result from Google Sign-In on page load
  useEffect(() => {
    // This check prevents Firebase from being initialized on the server.
    if (typeof window === 'undefined' || !firebaseAuthInstance) {
        setIsHandlingRedirect(false);
        return;
    }
    
    getRedirectResult(firebaseAuthInstance)
      .then((result) => {
        if (result) {
          // This is the successfully signed-in user
          setUser(result.user);
          toast({ title: "Success", description: "Signed in successfully." });
        }
      })
      .catch((error: AuthError) => {
        console.error("Google Sign-In Redirect Error:", error.code, error.message);
        
        let friendlyMessage = `An error occurred: ${error.message || 'Please try again.'}`;
        
        if (error.code === 'auth/unauthorized-domain') {
          friendlyMessage = "Authorization Error: This domain is not authorized. Please double-check that 'studio.firebase.google.com' is in your Firebase project's list of authorized domains. It can take a few minutes for this setting to take effect.";
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          friendlyMessage = "An account already exists with this email. Try signing in with the original method.";
        }
        
        toast({
          title: "Google Sign In Failed",
          description: friendlyMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsHandlingRedirect(false); // Finished processing redirect
      });
  }, [toast]);


  // Listens for general auth state changes (e.g., email sign-in, sign-out, session restore)
  useEffect(() => {
    // This check prevents Firebase from being initialized on the server.
    if (typeof window === 'undefined' || !firebaseAuthInstance) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Firebase onAuthStateChanged Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    return createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
  };

  const signIn = (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    return signInWithEmailAndPassword(firebaseAuthInstance, email, password);
  };

  // Changed to use signInWithRedirect
  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance || !googleProvider) throw new Error("Firebase Auth or Google Provider not initialized.");
    // This will navigate the user away and they will come back to the page
    // The result is handled by the getRedirectResult useEffect
    await signInWithRedirect(firebaseAuthInstance, googleProvider);
  };

  const signOut = async () => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await firebaseSignOut(firebaseAuthInstance);
    setUser(null); 
  };
  
  const value: AuthContextType = {
    user,
    loading: loading || isHandlingRedirect, // App is loading if either auth state or redirect is being processed
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  // The global loading screen
  if (loading || isHandlingRedirect) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-foreground">Initializing Authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
