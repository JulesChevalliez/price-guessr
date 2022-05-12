import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const {FIREBASE_API_KEY} = process.env;

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "juste-prix-aee42.firebaseapp.com",
    projectId: "juste-prix-aee42",
    storageBucket: "juste-prix-aee42.appspot.com",
    messagingSenderId: "618470891146",
    appId: "1:618470891146:web:8342718fe5e4fa52d2d773"
  };

  
// Initialize firebase instance
const FbApp = initializeApp(firebaseConfig);

export const FBDB = getFirestore(FbApp);
export const FbStorage = getStorage(FbApp);