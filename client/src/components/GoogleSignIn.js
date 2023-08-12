import React from 'react';
import { auth } from '../controllers/SignInController';
import firebase from 'firebase/compat/app';

const GoogleSignIn = () => {
    const signInWithGoogleHandler = () => {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .catch((error) => {
                console.error("Error signing in with Google", error);
            });
    };

    return (
        <button onClick={signInWithGoogleHandler}>
            Sign in with Google
        </button>
    );
};

export default GoogleSignIn;
