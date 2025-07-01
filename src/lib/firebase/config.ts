
// src/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, OAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { getPerformance, Performance } from "firebase/performance";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let appleProvider: OAuthProvider;
let phoneProvider: PhoneAuthProvider;
let performance: Performance;


// This check is important to avoid server-side initialization
if (typeof window !== "undefined") {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      "Firebase configuration is missing or incomplete. " +
      "Please make sure you have copied .env.example to .env and filled out all the " +
      "NEXT_PUBLIC_FIREBASE_* variables from your Firebase project settings."
    );
  }
  
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  auth.useDeviceLanguage();
  googleProvider = new GoogleAuthProvider();
  appleProvider = new OAuthProvider('apple.com');
  phoneProvider = new PhoneAuthProvider(auth);

  if (process.env.NODE_ENV === 'production' && firebaseConfig.measurementId) {
    performance = getPerformance(app);
  }
}

// @ts-ignore
export { app, auth, googleProvider, appleProvider, phoneProvider, performance };
