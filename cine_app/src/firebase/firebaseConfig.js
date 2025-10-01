import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBqxaNMPg1XAHwM8aS2wbFnRHpOdNZPqY",
  authDomain: "movieticketbookingapp-743f6.firebaseapp.com",
  projectId: "movieticketbookingapp-743f6",
  storageBucket: "movieticketbookingapp-743f6.appspot.com",
  messagingSenderId: "6476211596",
  appId: "1:6476211596:web:67dc74af695fe7d7c6a2a9",
  measurementId: "G-TQ5PHH58Z5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export { auth, googleProvider };



