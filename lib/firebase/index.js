// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqPXFUcB-ndLf3EF7zRQHTc9mFV96jHwg",
  authDomain: "finance-tracker-5cfcd.firebaseapp.com",
  projectId: "finance-tracker-5cfcd",
  storageBucket: "finance-tracker-5cfcd.firebasestorage.app",
  messagingSenderId: "782216709532",
  appId: "1:782216709532:web:d8d73dabe785b3e455f459"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {app, db}