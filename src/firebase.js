import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB6jClptnuaVf6RTqe1JMMCw-02Peg0Z8M",
  authDomain: "mytems-cf236.firebaseapp.com",
  projectId: "mytems-cf236",
  storageBucket: "mytems-cf236.firebasestorage.app",
  messagingSenderId: "593871039658",
  appId: "1:593871039658:web:d16972e70cb27cf7df34d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firestore initialized:", db);

export { auth, db };