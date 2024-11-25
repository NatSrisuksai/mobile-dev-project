## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd project-v1
   ```
2. **Install dependencies:**
   ```bash
   npm install
   
   ```
3. **Create FirebaseConfig.ts in root directory**
   ```bash
   import { initializeApp } from "firebase/app";
   import { getStorage } from "firebase/storage";
   import { getDatabase } from "firebase/database";
   import { initializeAuth, getReactNativePersistence } from "firebase/auth";
   import AsyncStorage from "@react-native-async-storage/async-storage";
   const firebaseConfig = {
   apiKey: "",
   authDomain: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: "",
   appId: "",
   measurementId: "",
   databaseURL: ""
   };

   // Initialize Firebase
   export const FIREBASE_APP = initializeApp(firebaseConfig);
   export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
   persistence: getReactNativePersistence(AsyncStorage),
   });
   export const FIREBASE_DB = getDatabase(FIREBASE_APP);
   export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
   ```
4. **Start the project:**
   ```bash
   npx expo start
   ````

## Let's Try

\*\*\* You need to have Expo Go first

![App Screenshot](./assets/eas-qr.svg)
