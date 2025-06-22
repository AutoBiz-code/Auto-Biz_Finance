
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, UserCredential, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth as firebaseAuthInstance, googleProvider, appleProvider } from '@/lib/firebase/config'; // aliased import
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithApple: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext useEffect: firebaseAuthInstance is", firebaseAuthInstance);

    if (!firebaseAuthInstance) {
      console.error("AuthContext: Firebase auth instance is NOT available. Authentication features will not work. This usually means Firebase initialization failed, likely due to missing .env configuration or an error during initialization. Check browser console and src/lib/firebase/config.ts logs.");
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
