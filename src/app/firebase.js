// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWU7_WIHtSx4maUeXtUVyP4uYoynroqlg",
  authDomain: "maven-group-11743.firebaseapp.com",
  projectId: "maven-group-11743",
  storageBucket: "maven-group-11743.appspot.com",
  messagingSenderId: "97963440221",
  appId: "1:97963440221:web:1442ce47ce2ff1f4a1b5b4",
  measurementId: "G-F9G52LRM3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);