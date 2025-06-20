
// src/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// import { getFirestore, Firestore } from "firebase/firestore"; // Uncomment if you need Firestore client-side

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log if critical keys are missing (for debugging in the browser)
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) {
    console.error(
      "CRITICAL: Firebase config key NEXT_PUBLIC_FIREBASE_API_KEY is missing or undefined. " +
      "Please check your .env file at the ROOT of your project and ensure it's correctly formatted and this variable is defined with your actual Firebase API Key. " +
      "After updating .env, YOU MUST RESTART your Next.js development server."
    );
  }
  if (!firebaseConfig.authDomain) {
    console.warn("Firebase config key NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing. Authentication might not work as expected. Check your .env file at the project root.");
  }
  if (!firebaseConfig.projectId) {
    console.warn("Firebase config key NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing. Firestore and other project-specific services might not work. Check your .env file at the project root.");
  }
}

let app: FirebaseApp | undefined = undefined; // Initialize as undefined
let auth: Auth | undefined = undefined; // Initialize as undefined
// let db: Firestore; // Uncomment if you need Firestore client-side

try {
  if (typeof window !== 'undefined') { // Ensure this only runs on the client
    if (getApps().length === 0) {
      if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("Firebase app initialized successfully with Project ID:", firebaseConfig.projectId);
      } else {
        console.error("Firebase initialization SKIPPED due to missing critical config values (API Key, Auth Domain, or Project ID). Check your .env file at the project root and browser console for details. Remember to restart your Next.js server after .env changes.");
        // Error details are logged by the checks above.
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      console.log("Firebase app already initialized.");
    }
  }
} catch (error) {
  console.error("CRITICAL: Firebase initialization failed with an error:", error, "This often means there is an issue with the values provided in your .env file at the project root or with your Firebase project setup itself. Please verify your credentials and restart your Next.js server.");
  // app and auth will remain undefined if an error occurs
}

export { app, auth /*, db */ };

