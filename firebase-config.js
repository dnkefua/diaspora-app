/**
 * Diaspora App — Firebase Configuration
 * Project: the-diaspora-app
 *
 * IMPORTANT: Replace the config values below with your actual Firebase project credentials.
 * Get these from: Firebase Console → Project Settings → General → Your apps → Firebase SDK snippet
 */

// Firebase configuration — REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "the-diaspora-app.firebaseapp.com",
  projectId: "the-diaspora-app",
  storageBucket: "the-diaspora-app.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (CDN modules for vanilla HTML/JS)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, updateProfile as updateAuthProfile } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, limit, startAfter, addDoc, arrayUnion, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, auth, db, storage };
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateAuthProfile as updateProfile
};
export {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  addDoc,
  arrayUnion,
  deleteDoc
};
export { ref, uploadBytes, getDownloadURL, deleteObject };

// Helper: Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Helper: Wait for auth to be ready
export function onAuthReady(callback) {
  onAuthStateChanged(auth, callback);
}

// Helper: Generate OTP (6 digits)
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
