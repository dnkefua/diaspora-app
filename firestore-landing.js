// Lightweight, read-only Firestore client for the public SEO landing pages.
// Uses Firestore Lite — no realtime listeners, no Firebase Auth, no Analytics —
// so these pages don't load Google Sign-In (apis.google.com / gapi). That avoids
// third-party cookies flagged by Lighthouse and keeps the pages fast (less JS).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore-lite.js';

const app = initializeApp({
  apiKey: "AIzaSyAYzO3ZByiY_H2jkY6nKbaGfFWID7Woe-Y",
  authDomain: "the-diaspora-app.firebaseapp.com",
  projectId: "the-diaspora-app",
  storageBucket: "the-diaspora-app.appspot.com",
  messagingSenderId: "530318956241",
  appId: "1:530318956241:web:9eec93a0bd2f73356717f0"
}, 'landing');

const db = getFirestore(app);
export { db, collection, getDocs, query, where, orderBy, limit };
