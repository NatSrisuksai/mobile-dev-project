// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";  
import { getDatabase } from "firebase/database"; 

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0S849Q4xLe1Q4KWJO1Xt1dA_nfktVyJI",
    authDomain: "mobiledev-7ec2f.firebaseapp.com",
    projectId: "mobiledev-7ec2f",
    storageBucket: "mobiledev-7ec2f.appspot.com",
    messagingSenderId: "601997625903",
    appId: "1:601997625903:web:b5e5dd23d77a192eff54da",
    measurementId: "G-NDM6YM4MKY",
    databaseURL: "https://mobiledev-7ec2f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);  // Add this line
