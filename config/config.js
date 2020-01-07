
import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyDr7_txGwz2E1OYqbQW52kRstlwAqMgY64",
    authDomain: "photo-feed-8ab19.firebaseapp.com",
    databaseURL: "https://photo-feed-8ab19.firebaseio.com",
    projectId: "photo-feed-8ab19",
    storageBucket: "photo-feed-8ab19.appspot.com",
    messagingSenderId: "751476794875",
    appId: "1:751476794875:web:7749bda4a4fa850411575e",
    measurementId: "G-87SXY39Y3S"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const f = firebase;
  export const database = firebase.database();
  export const auth = firebase.auth();
  export const storage = firebase.storage();