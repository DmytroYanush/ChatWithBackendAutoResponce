// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAizIRivcT8gvJWVPZfiSR0kuAeQzX3Jpg",
    authDomain: "chat-quotable-8e3f4.firebaseapp.com",
    projectId: "chat-quotable-8e3f4",
    storageBucket: "chat-quotable-8e3f4.firebasestorage.app",
    messagingSenderId: "600045485435",
    appId: "1:600045485435:web:2fffca88fe647fa324d1de"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
