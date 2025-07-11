
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithPopup, GoogleAuthProvider, AuthError, RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: (flow?: 'signin' | 'signup') => Promise<UserCredential>;
  signOut: () => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  signInWithPhone: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const signInWithGoogle = async (flow: 'signin' | 'signup' = 'signin') => {
    if (!firebaseAuthInstance) {
      toast({ title: "Initialization Error", description: "Firebase is not ready.", variant: "destructive" });
      throw new Error("Firebase not initialized");
    }

    if (!googleProvider) {
      toast({ title: "Configuration Error", description: "Google provider not configured.", variant: "destructive" });
      throw new Error("Google provider not configured");
    }

    try {
      const result = await signInWithPopup(firebaseAuthInstance, googleProvider);
      const title = flow === 'signup' ? "Account Created" : "Signed In";
      const description = flow === 'signup' ? "Account created successfully with Google." : "Signed in successfully with Google.";

      toast({
        title,
        description,
        duration: 3000
      });

      return result;
    } catch (error) {
      const authError = error as AuthError;
      const title = flow === 'signup' ? "Sign Up Failed" : "Sign In Failed";
      let friendlyMessage = `Could not complete Google sign-in: ${authError.message}`;

      if (authError.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "Sign-in was cancelled. Please try again.";
      } else if (authError.code === 'auth/popup-blocked') {
        friendlyMessage = "Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.";
      } else if (authError.code === 'auth/unauthorized-domain') {
        friendlyMessage = "This domain is not authorized for sign-in. Please add it to your Firebase project's Authentication > Settings > Authorized domains list.";
      } else if (authError.code === 'auth/operation-not-allowed') {
        friendlyMessage = "Google Sign-In is not enabled. Please enable it in your Firebase project's authentication settings.";
      } else if (authError.code === 'auth/account-exists-with-different-credential') {
        friendlyMessage = "An account already exists with this email. Try signing in with the original method.";
      }

      toast({
        title: title,
        description: friendlyMessage,
        variant: "destructive",
        duration: 10000,
      });

      throw error;
    }
  };

  const signOut = async () => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await firebaseSignOut(firebaseAuthInstance);
    setUser(null);
  };

  const setupRecaptcha = (containerId: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    // Clear any existing verifier
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    const verifier = new RecaptchaVerifier(firebaseAuthInstance, containerId, {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    });
    window.recaptchaVerifier = verifier;
    return verifier;
  };

  const signInWithPhone = (phoneNumber: string, verifier: RecaptchaVerifier) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    return signInWithPhoneNumber(firebaseAuthInstance, phoneNumber, verifier);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    setupRecaptcha,
    signInWithPhone,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
