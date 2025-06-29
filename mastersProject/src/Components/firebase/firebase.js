// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkZnqqtdDuFeF-mtCFDNAPx6EVQkrb0RQ",
  authDomain: "mentalhealthwebapp-13a55.firebaseapp.com",
  projectId: "mentalhealthwebapp-13a55",
  storageBucket: "mentalhealthwebapp-13a55.appspot.com",
  messagingSenderId: "624094797198",
  appId: "1:624094797198:web:fefc23d4672d3ce35058df",
  measurementId: "G-JWQ47F0FM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {app,auth};