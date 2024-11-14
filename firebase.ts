// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASvCDHwA1byh8FtwXdmsk6EEH5IpLUuv0",
    authDomain: "ai-bot-50cca.firebaseapp.com",
    projectId: "ai-bot-50cca",
    storageBucket: "ai-bot-50cca.firebasestorage.app",
    messagingSenderId: "684025592328",
    appId: "1:684025592328:web:f7d2481636336c2022afbd"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
