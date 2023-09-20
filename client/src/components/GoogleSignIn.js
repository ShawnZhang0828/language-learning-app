import React from "react";
import firebase from "firebase/compat/app";

import { auth } from "../controllers/FirebaseController";

const GoogleSignIn = () => {
  const signInWithGoogleHandler = () => {
    auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error) => {
        console.error("Error signing in with Google", error);
      });
  };

  return (
    <button onClick={signInWithGoogleHandler} className="login-page-button">
      LOGIN WITH GOOGLE
    </button>
  );
};

export default GoogleSignIn;
