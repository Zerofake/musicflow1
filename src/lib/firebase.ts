// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-4604443745-d44ed",
  appId: "1:837646894277:web:78a458c76217cd203a1cac",
  storageBucket: "studio-4604443745-d44ed.firebasestorage.app",
  apiKey: "AIzaSyDX7Xmq1Y3Ib_Xpkf_BA1_VgBBx2wTZJ60",
  authDomain: "studio-4604443745-d44ed.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "837646894277"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
