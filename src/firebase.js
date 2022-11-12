import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClkD_pHcTSaT-vWNWinMY-bgnCCeZeT8Q",
  authDomain: "transcription-133e5.firebaseapp.com",
  projectId: "transcription-133e5",
  storageBucket: "transcription-133e5.appspot.com",
  messagingSenderId: "574062769733",
  appId: "1:574062769733:web:9e9e6c7d765774f2a3952c",
  measurementId: "G-S98C7H1HPT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
