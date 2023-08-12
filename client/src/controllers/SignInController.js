import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGNjejZKvjoA5Un_5aeYlaImlXvgpRMUk",
    authDomain: "language-learning-app-fb809.firebaseapp.com",
    projectId: "language-learning-app-fb809",
    storageBucket: "language-learning-app-fb809.appspot.com",
    messagingSenderId: "985339726521",
    appId: "1:985339726521:web:e934a36e1f877d1ee02968",
    measurementId: "G-TKB4WCM1Z8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const database = app.firestore();
export default app;