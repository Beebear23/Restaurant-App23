// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCg7ZaXlXIguhrsIwSYpSSR2YC2spzqSxY",
  authDomain: "restaurant-f4581.firebaseapp.com",
  projectId: "restaurant-f4581",
  storageBucket: "restaurant-f4581.firebasestorage.app",
  messagingSenderId: "553928918041",
  appId: "1:553928918041:web:6ebffd9334b9025a2d9688",
  measurementId: "G-JRFSPN9LFZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);