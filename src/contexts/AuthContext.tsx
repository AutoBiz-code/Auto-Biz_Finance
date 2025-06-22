
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, UserCredential, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider } from '@/lib/firebase/config';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!firebaseAuthInstance) {
      setAuthError("CRITICAL: Firebase is not configured. This usually means your .env file is missing or has incorrect values.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 

  const handleAuthError = (error: any) => {
    console.error("Firebase Auth Error:", error);
    // This is the most critical error. We will halt the app and show a specific message.
    if (error.code === 'auth/invalid-api-key') {
      setAuthError("CRITICAL: Your Firebase API Key is not valid. Please copy the correct value into your .env file and restart your development server.");
    } else {
      // For all other errors (e.g., wrong password, popup blocked), we re-throw them
      // so the individual pages can handle them with a toast notification.
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    try {
      await createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
      setAuthError(null); // Clear config errors on success
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    try {
      await signInWithEmailAndPassword(firebaseAuthInstance, email, password);
      setAuthError(null);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance || !googleProvider) throw new Error("Firebase Auth or Google Provider not initialized.");
    try {
      await signInWithPopup(firebaseAuthInstance, googleProvider);
      setAuthError(null);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signOut = async () => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await firebaseSignOut(firebaseAuthInstance);
    setUser(null); 
  };
  
  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  if (authError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl font-headline font-bold text-destructive mb-4">Firebase Configuration Error</h1>
        <p className="max-w-xl text-muted-foreground mb-4">
          {authError}
        </p>
        <div className="text-left bg-card p-6 rounded-lg border border-border max-w-2xl w-full">
            <h2 className="font-semibold text-lg text-card-foreground mb-3">How to Fix This:</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Locate the `.env` file:</strong> Find this file in the **root directory** of your project (the same level as `package.json`). If it doesn't exist, create it.
                </li>
                <li>
                  <strong>Fill in your Firebase credentials:</strong> Open the `.env` file and ensure all variables starting with `NEXT_PUBLIC_FIREBASE_` are filled in correctly from your Firebase project settings.
                </li>
                <li>
                  <strong>Restart your server:</strong> This is the most critical step. After saving changes to the `.env` file, you **must stop and restart** your development server for the changes to be applied (`Control + C` then `npm run dev`).
                </li>
            </ol>
        </div>
      </div>
    );
  }

  if (loading && isClient) {
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
