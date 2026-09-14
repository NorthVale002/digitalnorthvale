import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any)?.env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigData.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigData.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket,
  messagingSenderId:
    metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigData.appId,
};

let app: FirebaseApp | null = null;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase initializeApp error:', e);
}

// Use the provisioned database ID
const dbId =
  metaEnv.VITE_FIREBASE_DATABASE_ID ||
  firebaseConfigData.firestoreDatabaseId;

let db: Firestore | null = null;
try {
  if (app) {
    db = dbId && dbId !== '(default)' ? getFirestore(app, dbId) : getFirestore(app);
  }
} catch (e) {
  console.warn('Firestore initialization error:', e);
}

export {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
};
