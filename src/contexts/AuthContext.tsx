
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithRedirect, getRedirectResult, GoogleAuthProvider, AuthError, OAuthProvider, RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
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
  signInWithGoogle: (flow?: 'signin' | 'signup') => Promise<void>;
  signOut: () => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  signInWithPhone: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !firebaseAuthInstance) {
        setIsHandlingRedirect(false);
        setLoading(false);
        return;
    }
    
    getRedirectResult(firebaseAuthInstance)
      .then((result) => {
        if (result) {
          setUser(result.user);
          toast({ title: "Success", description: "Signed in successfully." });
          router.push('/dashboard');
        }
      })
      .catch((error: AuthError) => {
        const flow = sessionStorage.getItem('firebase_auth_flow') || 'signin';
        sessionStorage.removeItem('firebase_auth_flow');
        const title = flow === 'signup' ? "Sign Up Failed" : "Sign In Failed";

        let friendlyMessage = `An error occurred: ${error.message || 'Please try again.'}`;
        
        if (error.code === 'auth/account-exists-with-different-credential') {
          friendlyMessage = "An account already exists with this email. Try signing in with the original method.";
        } else if (error.code === 'auth/unauthorized-domain') {
           friendlyMessage = "This domain is not authorized for sign-in. Please add it to your Firebase project's Authentication > Settings > Authorized domains list, then wait a few minutes and refresh.";
        }
        
        toast({
          title: title,
          description: friendlyMessage,
          variant: "destructive",
          duration: 15000,
        });
      })
      .finally(() => {
        setIsHandlingRedirect(false);
      });
  }, [toast, router]);

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

  const signInWithProvider = async (provider: GoogleAuthProvider, flow: 'signin' | 'signup' = 'signin') => {
    if (!firebaseAuthInstance) {
        toast({ title: "Initialization Error", description: "Firebase is not ready.", variant: "destructive" });
        throw new Error("Firebase not initialized");
    }
    try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('firebase_auth_flow', flow);
        }
        await signInWithRedirect(firebaseAuthInstance, provider);
    } catch (error) {
        const authError = error as AuthError;
        const title = flow === 'signup' ? "Sign Up Failed" : "Sign In Failed";
        let friendlyMessage = `Could not start the process: ${authError.message}`;

        if (authError.code === 'auth/unauthorized-domain') {
            friendlyMessage = "This domain is not authorized for sign-in. Please add it to your Firebase project's Authentication > Settings > Authorized domains list, then wait a few minutes and refresh.";
        }

        toast({
            title: title,
            description: friendlyMessage,
            variant: "destructive",
            duration: 15000,
        });
        throw error;
    }
  };

  const signInWithGoogle = (flow: 'signin' | 'signup' = 'signin') => signInWithProvider(googleProvider, flow);

  const signOut = async () => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await firebaseSignOut(firebaseAuthInstance);
    setUser(null); 
  };
  
  const setupRecaptcha = (containerId: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    // This check prevents re-creating the verifier on re-renders
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }
    const verifier = new RecaptchaVerifier(firebaseAuthInstance, containerId, {
      'size': 'invisible',
      'callback': (response: any) => {
        console.log("reCAPTCHA solved, ready to send OTP.");
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log("reCAPTCHA expired.");
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
    loading: loading || isHandlingRedirect,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    setupRecaptcha,
    signInWithPhone,
  };

  if (loading || isHandlingRedirect) {
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
