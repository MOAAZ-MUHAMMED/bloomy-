// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4yCFigmU3PXLdrtWCQrck1Gt-jzR5_9I",
  authDomain: "blomy-kids.firebaseapp.com",
  projectId: "blomy-kids",
  storageBucket: "blomy-kids.firebasestorage.app",
  messagingSenderId: "425953742300",
  appId: "1:425953742300:web:f2f511351fafffd72c1319",
  measurementId: "G-TTQ68YF1XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
