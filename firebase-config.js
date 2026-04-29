/**
 * Diaspora App — Firebase Configuration
 * Project: the-diaspora-app
 */

// Import Firebase modules via CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, updateProfile as updateAuthProfile } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, limit, startAfter, addDoc, arrayUnion, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYzO3ZByiY_H2jkY6nKbaGfFWID7Woe-Y",
  authDomain: "the-diaspora-app.firebaseapp.com",
  projectId: "the-diaspora-app",
  storageBucket: "the-diaspora-app.appspot.com",
  messagingSenderId: "530318956241",
  appId: "1:530318956241:web:9eec93a0bd2f73356717f0",
  measurementId: "G-KLK9TQV19S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase Analytics unavailable in this browser context:', error);
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, auth, db, storage, analytics };
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
