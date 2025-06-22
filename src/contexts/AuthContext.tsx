
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
      setAuthError("CRITICAL: Firebase is not configured properly. Your .env file is likely missing or has incorrect values.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, 
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setAuthError(null); 
      },
      (error) => {
        console.error("Firebase onAuthStateChanged Error:", error);
        if (error.code === 'auth/invalid-api-key') {
          setAuthError("CRITICAL: Your Firebase API Key is not valid. Please check your .env file and restart your server.");
        } else {
           setAuthError(`An unexpected authentication error occurred: ${error.message}`);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAuthAction = async (action: Promise<any>) => {
    try {
      await action;
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/invalid-api-key') {
        setAuthError("CRITICAL: Your Firebase API Key is not valid. Please check your .env file and restart your server.");
      } else {
        throw error;
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await handleAuthAction(createUserWithEmailAndPassword(firebaseAuthInstance, email, password));
  };

  const signIn = async (email: string, password: string) => {
    if (!firebaseAuthInstance) throw new Error("Firebase Auth not initialized.");
    await handleAuthAction(signInWithEmailAndPassword(firebaseAuthInstance, email, password));
  };

  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance || !googleProvider) throw new Error("Firebase Auth or Google Provider not initialized.");
    await handleAuthAction(signInWithPopup(firebaseAuthInstance, googleProvider));
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
        <h1 className="text-2xl font-headline font-bold text-destructive mb-2">Action Required: Firebase Configuration Error</h1>
        <p className="max-w-xl text-muted-foreground mb-6">
          The application has detected that it cannot connect to Firebase. This is almost always caused by a problem with your `.env` file or the server not being restarted.
        </p>
        <div className="text-left bg-card p-6 rounded-lg border border-border max-w-3xl w-full">
            <h2 className="font-semibold text-lg text-card-foreground mb-3">How to Fix This:</h2>
            <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground">
                <li>
                  <strong>Locate the `.env` file:</strong> Find this file in the **root directory** of your project (the same level as `package.json`). If it doesn't exist, create it.
                </li>
                <li>
                  <strong>Fill in your Firebase credentials:</strong> Open the `.env` file and ensure all variables (like `NEXT_PUBLIC_FIREBASE_API_KEY`) are filled in correctly from your Firebase project settings. **Do not leave placeholder values.**
                </li>
                <li>
                  <strong className="text-lg text-primary">Restart your server:</strong> This is the most important step. After saving changes to the `.env` file, you **MUST stop your development server (press `Control + C` in the terminal) and restart it (`npm run dev`)**.
                </li>
            </ol>
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="font-semibold text-card-foreground mb-2">Important</h3>
              <p className="text-xs text-muted-foreground">As an AI, I cannot perform these steps for you. These actions require access to your local files and terminal, which I do not have. Please follow the steps above carefully.</p>
            </div>
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
