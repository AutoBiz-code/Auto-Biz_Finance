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

// This function now centralizes initialization and logging for client-side execution.
function initializeFirebaseOnClient() {
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    // Log detailed warnings for each missing key to help with debugging.
    if (!firebaseConfig.apiKey) {
      console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing from your .env file.");
    }
    if (!firebaseConfig.authDomain) {
      console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing from your .env file.");
    }
    if (!firebaseConfig.projectId) {
      console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from your .env file.");
    }

    // Only attempt to initialize if the critical keys are present.
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
      try {
        app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized successfully on the client with Project ID:", firebaseConfig.projectId);
      } catch (error) {
        console.error("CRITICAL: Firebase initialization failed with an error:", error);
        // If initialization fails, 'app' remains undefined, and the AuthContext will show the error screen.
        return; // Exit early if initialization fails.
      }
    } else {
      console.error("Firebase initialization SKIPPED due to missing critical config values. Please check your .env file and restart your server.");
      return; // Exit early if config is missing.
    }
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
