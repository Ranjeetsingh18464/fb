import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDVvuBUWqEHzfFvXWWmr-QttUGgIjpKWgY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "facebooks-1ff62.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ||  "https://facebooks-1ff62-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "facebooks-1ff62",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "facebooks-1ff62.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "849810064653",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:849810064653:web:7624a7d27918e19388dc44",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2KD268221V"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

let analytics = null
let messaging = null
let functions = null
try { analytics = getAnalytics(app) } catch {}
try { messaging = getMessaging(app) } catch {}
try { functions = getFunctions(app) } catch {}

export {
  app,
  analytics,
  auth,
  db,
  storage,
  messaging,
  functions,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  Timestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getToken,
  onMessage,
  httpsCallable
}
