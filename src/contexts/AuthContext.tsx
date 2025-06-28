
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithRedirect, getRedirectResult, GoogleAuthProvider, AuthError, OAuthProvider } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider, appleProvider } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
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
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = result.providerId === 'google.com' 
          //   ? GoogleAuthProvider.credentialFromResult(result) 
          //   : AppleAuthProvider.credentialFromResult(result);
          setUser(result.user);
          toast({ title: "Success", description: "Signed in successfully." });
        }
      })
      .catch((error: AuthError) => {
        console.error("Sign-In Redirect Error:", error.code, error.message);
        
        let friendlyMessage = `An error occurred: ${error.message || 'Please try again.'}`;
        
        if (error.code === 'auth/account-exists-with-different-credential') {
          friendlyMessage = "An account already exists with this email. Try signing in with the original method.";
        }
        
        toast({
          title: "Sign In Failed",
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

  const signInWithProvider = async (provider: GoogleAuthProvider | OAuthProvider) => {
    if (!firebaseAuthInstance) {
        toast({ title: "Initialization Error", description: "Firebase is not ready.", variant: "destructive" });
        throw new Error("Firebase not initialized");
    }
    try {
        await signInWithRedirect(firebaseAuthInstance, provider);
    } catch (error) {
        const authError = error as AuthError;
        let friendlyMessage = `Could not start the sign-in process: ${authError.message}`;
        if (authError.code === 'auth/unauthorized-domain') {
            friendlyMessage = "This domain is not authorized. If you've already added it to your Firebase project, please wait a few minutes and perform a hard refresh (Cmd+Shift+R or Ctrl+F5).";
        }
        toast({
            title: "Sign In Failed",
            description: friendlyMessage,
            variant: "destructive",
            duration: 15000,
        });
        throw error;
    }
  };

  const signInWithGoogle = () => signInWithProvider(googleProvider);
  const signInWithApple = () => signInWithProvider(appleProvider);

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
    signInWithApple,
    signOut,
  };

  if (loading || isHandlingRedirect) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
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
