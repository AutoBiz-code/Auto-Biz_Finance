
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, UserCredential } from 'firebase/auth';
import { auth as firebaseAuthInstance } from '@/lib/firebase/config'; // aliased import
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth | null; // Make Auth instance available, can be null if not initialized
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log the state of firebaseAuthInstance when the component mounts
    console.log("AuthContext useEffect: firebaseAuthInstance is", firebaseAuthInstance);

    if (!firebaseAuthInstance) {
      console.error("AuthContext: Firebase auth instance is NOT available. Authentication features will not work. This usually means Firebase initialization failed, likely due to missing .env configuration.");
      setLoading(false); // Stop loading, but auth is broken
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
  }, []); // Empty dependency array means this runs once on mount

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

  const handleSignOut = async () => {
    if (!firebaseAuthInstance) {
      console.error("Attempted to call signOut but Firebase Auth is not initialized.");
      throw new Error("Firebase Auth not initialized for signOut.");
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null); // Clear user state locally
      console.log("AuthContext: User signed out.");
    } catch (error) {
      console.error("AuthContext: Error signing out: ", error);
      // Potentially show a toast to the user
    }
  };
  
  const value: AuthContextType = {
    user,
    loading,
    auth: firebaseAuthInstance || null, // Provide the auth instance, can be null
    signUp: handleSignUp,
    signIn: handleSignIn,
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
