
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, UserCredential, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider } from '@/lib/firebase/config'; // aliased import
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password:string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
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
    
    // The check for firebaseAuthInstance happens here, only on the client
    if (!firebaseAuthInstance) {
      setIsConfigValid(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []); 

  const handleSignUp = async (email: string, password: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
      throw new Error("Firebase Auth not initialized for signUp. Check Firebase configuration.");
    }
    return createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
  };

  const handleSignIn = async (email: string, password: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
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

  const handleSignOut = async () => {
    if (!firebaseAuthInstance) {
      throw new Error("Firebase Auth not initialized for signOut.");
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null); 
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
    signOut: handleSignOut,
  };

  // This check now only runs on the client after hydration, preventing mismatches.
  if (isClient && !isConfigValid) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl font-headline font-bold text-destructive mb-4">Firebase Configuration Error</h1>
        <p className="max-w-xl text-muted-foreground mb-4">
          The application failed to connect to Firebase, most likely due to missing or incorrect credentials. This must be fixed to enable sign-in and sign-up.
        </p>
        <div className="text-left bg-card p-6 rounded-lg border border-border max-w-2xl w-full">
            <h2 className="font-semibold text-lg text-card-foreground mb-3">How to Fix This:</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Locate the `.env` file:</strong> Find this file in the **root directory** of your project (the same level as `package.json`). If it doesn't exist, create it.
                </li>
                <li>
                  <strong>Fill in your Firebase credentials:</strong> Open the `.env` file and ensure all variables starting with `NEXT_PUBLIC_FIREBASE_` are filled in correctly from your Firebase project settings. Pay close attention to `NEXT_PUBLIC_FIREBASE_API_KEY`.
                </li>
                <li>
                  <strong>Restart your server:</strong> This is a critical step. After saving changes to the `.env` file, you **must stop and restart** your Next.js development server for the changes to be applied.
                </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              Check your browser's developer console for more specific logs about which variables might be missing.
            </p>
        </div>
      </div>
    );
  }

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
