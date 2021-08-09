import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyClYqEWyIuocIvsQ_PPdVtb_BOhjY0d2G8",
    authDomain: "socialiteapp-66eb5.firebaseapp.com",
    projectId: "socialiteapp-66eb5",
    storageBucket: "socialiteapp-66eb5.appspot.com",
    messagingSenderId: "558156043941",
    appId: "1:558156043941:web:948de7aee7d79aeaa91f4c",
    measurementId: "G-QEZVW9NS5J"
  };


  const app = firebase.initializeApp(firebaseConfig)
  const fstore= app.firestore()
  const auth = app.auth()
  const storage = app.storage()

  export {fstore,auth , storage}