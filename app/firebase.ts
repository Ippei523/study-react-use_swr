// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKn7Ctb2LcZiXsYt_ftxtM6xTDSw2IaAA",
  authDomain: "study-create-useswr.firebaseapp.com",
  databaseURL: "https://study-create-useswr-default-rtdb.firebaseio.com",
  projectId: "study-create-useswr",
  storageBucket: "study-create-useswr.appspot.com",
  messagingSenderId: "770988997639",
  appId: "1:770988997639:web:3b2fa68e7efca739befea2",
  measurementId: "G-6B6R6ENNQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);