import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA92A_yMbFDHbX0gSJJvh_If8ugmQaP8zQ",
  authDomain: "native-expense-tracker-bb7b9.firebaseapp.com",
  projectId: "native-expense-tracker-bb7b9",
  storageBucket: "native-expense-tracker-bb7b9.firebasestorage.app",
  messagingSenderId: "1001649039948",
  appId: "1:1001649039948:web:ab74ebda7bb2f74f0b22e9",
  measurementId: "G-BM7VW639C3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);