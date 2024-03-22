import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZuLxxtIRgoMd70trqb6uhcUMb-Zovg4E",
  authDomain: "connecthub-88e58.firebaseapp.com",
  projectId: "connecthub-88e58",
  storageBucket: "connecthub-88e58.appspot.com",
  messagingSenderId: "193205893959",
  appId: "1:193205893959:web:4ab9112ee5525209ba2a62",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
