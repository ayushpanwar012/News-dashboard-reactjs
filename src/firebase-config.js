// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQPKXHfP6ukPRcYqvQJoibIDtNzRbIHZg",
  authDomain: "news-dashboard-loginpage.firebaseapp.com",
  projectId: "news-dashboard-loginpage",
  storageBucket: "news-dashboard-loginpage.firebasestorage.app",
  messagingSenderId: "370909457358",
  appId: "1:370909457358:web:2a94dd3d8e8e5edbc2599f",
  measurementId: "G-RLZVX8JKH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);