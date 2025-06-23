
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined' || !firebaseAuthInstance) {
        setIsHandlingRedirect(false);
        return;
    }
    
    getRedirectResult(firebaseAuthInstance)
      .then((result) => {
        if (result) {
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
        setIsHandlingRedirect(false);
      });
  }, [toast]);

  useEffect(() => {
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

  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance || !googleProvider) {
      toast({ title: "Initialization Error", description: "Firebase is not ready.", variant: "destructive" });
      return;
    }
    try {
      await signInWithRedirect(firebaseAuthInstance, googleProvider);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error initiating Google Sign-In redirect:", authError.code, authError.message);
      
      let friendlyMessage = `Could not start the Google Sign-In process: ${authError.message}`;
      if (authError.code === 'auth/unauthorized-domain') {
          friendlyMessage = "This domain is not authorized. Please go to your Firebase Console -> Authentication -> Settings -> Authorized domains, and add 'studio.firebase.google.com'. It may take a few minutes for this setting to take effect.";
      }

      toast({
          title: "Google Sign In Failed",
          description: friendlyMessage,
          variant: "destructive",
          duration: 9000,
      });
      // Rethrow the error so the calling page can stop its loading indicator.
      throw error;
    }
  };

  const signOut = async () => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await firebaseSignOut(firebaseAuthInstance);
    setUser(null); 
  };
  
  const value: AuthContextType = {
    user,
    loading: loading || isHandlingRedirect,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

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
