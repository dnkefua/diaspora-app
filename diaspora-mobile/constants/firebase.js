// Firebase configuration for Diaspora App
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;