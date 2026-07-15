import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxig_gZ-HPfhBKluvP-ASS1ky8Usjz6fA",
  authDomain: "old-bikes-hub.firebaseapp.com",
  projectId: "old-bikes-hub",
  storageBucket: "old-bikes-hub.firebasestorage.app",
  messagingSenderId: "535786675048",
  appId: "1:535786675048:web:e4439395ffb0a4e04054dd",
  measurementId: "G-M2PF0CLMXE",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;