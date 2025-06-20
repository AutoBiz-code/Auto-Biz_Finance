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

let app: FirebaseApp;
let auth: Auth;
// let db: Firestore; // Uncomment if you need Firestore client-side

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // db = getFirestore(app); // Uncomment if you need Firestore client-side
} else if (typeof window !== 'undefined') {
  app = getApps()[0];
  auth = getAuth(app);
  // db = getFirestore(app); // Uncomment if you need Firestore client-side
} else {
  // Handle server-side where window is not defined, if necessary
  // For now, client-side initialization is prioritized
}

// @ts-ignore
export { app, auth /*, db */ };
