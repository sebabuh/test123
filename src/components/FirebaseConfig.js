import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/firebase-functions";

const config = {
    apiKey: "AIzaSyBco9vbfC0fCY8vbPJntWzkRKzvD25koh0",
    authDomain: "webapplicationbuhnici.firebaseapp.com",
    databaseURL: "https://webapplicationbuhnici.firebaseio.com",
    projectId: "webapplicationbuhnici",
    storageBucket: "webapplicationbuhnici.appspot.com",
    messagingSenderId: "538407242284",
    appId: "1:538407242284:web:9229c795a828a3078a9f89",
    measurementId: "G-KSG0FG02TT"
  };
  export const fire = firebase.initializeApp(config);
  export const create = firebase.initializeApp(config, "Secondary");
  export const db = firebase.firestore();