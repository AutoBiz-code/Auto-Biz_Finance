
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
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error(
      "CRITICAL: Firebase config keys (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID) are missing or undefined. " +
      "Please check your .env file at the root of your project and ensure it's correctly formatted and these variables are defined."
    );
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
      } else {
        // Error already logged above, app and auth will remain undefined
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
    }
  }
} catch (error) {
  console.error("CRITICAL: Firebase initialization failed:", error);
  // app and auth will remain undefined if an error occurs
}

export { app, auth /*, db */ };
