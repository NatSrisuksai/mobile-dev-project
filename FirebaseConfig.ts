// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";  // Import Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0S849Q4xLe1Q4KWJO1Xt1dA_nfktVyJI",
    authDomain: "mobiledev-7ec2f.firebaseapp.com",
    projectId: "mobiledev-7ec2f",
    storageBucket: "mobiledev-7ec2f.appspot.com",
    messagingSenderId: "601997625903",
    appId: "1:601997625903:web:b5e5dd23d77a192eff54da",
    measurementId: "G-NDM6YM4MKY"
  };
  

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
