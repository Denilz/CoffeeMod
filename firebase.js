import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJ3A5OvGTWmEEsSJoWyMI1Kk_dyK0ZXSc",
  authDomain: "driving-time-b6590.firebaseapp.com",
  projectId: "driving-time-b6590",
  storageBucket: "driving-time-b6590.appspot.com",
  messagingSenderId: "1029943886620",
  appId: "1:1029943886620:web:3ab6537241d506af1870d9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
