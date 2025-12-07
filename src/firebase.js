import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCINXHLt7WqoMz21ec2MT6xEnvKCEZkIZc",
  authDomain: "miras-perfume-dab31.firebaseapp.com",
  projectId: "miras-perfume-dab31",
  storageBucket: "miras-perfume-dab31.firebasestorage.app",
  messagingSenderId: "598997335720",
  appId: "1:598997335720:web:2dd0f276e752930dc4cc9d"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

