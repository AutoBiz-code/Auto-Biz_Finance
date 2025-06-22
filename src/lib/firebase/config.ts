
// src/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let googleProvider: GoogleAuthProvider | undefined = undefined;

// This function centralizes initialization for client-side execution.
function initializeFirebaseOnClient() {
  if (getApps().length === 0) {
    // Only attempt to initialize if the critical key seems present.
    // This avoids a hard crash if the .env file is totally missing and allows AuthContext to show a friendly error.
    if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('your-api-key-here')) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (error) {
        console.error("CRITICAL: Firebase initialization failed with an error:", error);
        // app will be undefined, and the AuthContext will handle this state.
      }
    }
  } else {
    app = getApps()[0];
  }
  
  // If app was successfully initialized or already exists, set up Auth and providers.
  if (app) {
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
}

// Ensure Firebase is only initialized on the client-side.
if (typeof window !== 'undefined') {
  initializeFirebaseOnClient();
}

export { app, auth, googleProvider };
