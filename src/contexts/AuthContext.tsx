
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, UserCredential, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider, appleProvider } from '@/lib/firebase/config'; // aliased import
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password:string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithApple: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigValid, setIsConfigValid] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial render.
    setIsClient(true);
    
    console.log("AuthContext useEffect: firebaseAuthInstance is", firebaseAuthInstance);

    if (!firebaseAuthInstance) {
      console.error("AuthContext: Firebase auth instance is NOT available. This usually means Firebase initialization failed, likely due to missing .env configuration or an error during initialization. Check browser console and src/lib/firebase/config.ts logs.");
      setIsConfigValid(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      console.log("AuthContext onAuthStateChanged: currentUser is", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      console.log("AuthContext: Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); 

  const handleSignUp = async (email: string, password: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
      console.error("Attempted to call signUp but Firebase Auth is not initialized.");
      throw new Error("Firebase Auth not initialized for signUp. Check Firebase configuration.");
    }
    return createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
  };

  const handleSignIn = async (email: string, password: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
      console.error("Attempted to call signIn but Firebase Auth is not initialized.");
      throw new Error("Firebase Auth not initialized for signIn. Check Firebase configuration.");
    }
    return signInWithEmailAndPassword(firebaseAuthInstance, email, password);
  };

  const handleSignInWithGoogle = async (): Promise<UserCredential> => {
    if (!firebaseAuthInstance || !googleProvider) {
        throw new Error("Firebase Auth or Google Provider not initialized.");
    }
    return signInWithPopup(firebaseAuthInstance, googleProvider);
  }

  const handleSignInWithApple = async (): Promise<UserCredential> => {
    if (!firebaseAuthInstance || !appleProvider) {
        throw new Error("Firebase Auth or Apple Provider not initialized.");
    }
    return signInWithPopup(firebaseAuthInstance, appleProvider);
  }

  const handleSignOut = async () => {
    if (!firebaseAuthInstance) {
      console.error("Attempted to call signOut but Firebase Auth is not initialized.");
      throw new Error("Firebase Auth not initialized for signOut.");
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null); 
      console.log("AuthContext: User signed out.");
    } catch (error) {
      console.error("AuthContext: Error signing out: ", error);
    }
  };
  
  const value: AuthContextType = {
    user,
    loading,
    auth: firebaseAuthInstance || null, 
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithApple: handleSignInWithApple,
    signOut: handleSignOut,
  };

  // On the server and first client render, `isClient` is false, so this block is skipped.
  // After hydration, `isClient` becomes true, and this block can safely run on the client only.
  if (isClient && !isConfigValid) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl font-headline font-bold text-destructive mb-4">Firebase Configuration Error</h1>
        <p className="max-w-xl text-muted-foreground mb-4">
          The application failed to connect to Firebase. This is almost always caused by missing or incorrect Firebase credentials, which results in the `auth/api-key-not-valid` error.
        </p>
        <div className="text-left bg-card p-4 rounded-md border border-border max-w-xl w-full">
            <h2 className="font-semibold text-lg text-card-foreground mb-2">How to Fix:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Locate the <code className="bg-input px-1 py-0.5 rounded-sm">.env</code> file in the **root directory** of your project (the same level as <code className="bg-input px-1 py-0.5 rounded-sm">package.json</code>).</li>
                <li>Ensure all <code className="bg-input px-1 py-0.5 rounded-sm">NEXT_PUBLIC_FIREBASE_...</code> variables are filled in with the correct credentials from your Firebase project console.</li>
                <li>Pay close attention to <code className="bg-input px-1 py-0.5 rounded-sm">NEXT_PUBLIC_FIREBASE_API_KEY</code>. It must be exact.</li>
                <li>After saving the <code className="bg-input px-1 py-0.5 rounded-sm">.env</code> file, you **must restart** your Next.js development server for the changes to take effect.</li>
            </ol>
        </div>
      </div>
    );
  }

  // The loading screen is rendered on the server and on the initial client render.
  if (loading) {
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
