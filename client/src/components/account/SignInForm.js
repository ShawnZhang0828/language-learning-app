import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { auth } from "../../controllers/FirebaseController";
import { signInWithEmailAndPassword } from "../../controllers/SignInController";
import { userPreferenceContext } from "../../controllers/PreferenceController";

import "../../styles/SigninPage.css";
import GoogleSignIn from "../GoogleSignIn";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const navigate = useNavigate();

  const signInWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    var preferences = await signInWithEmailAndPassword(email, password);

    // Set preference context
    if (preferences) {
      setUserPreference(preferences);

      navigate("/main");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    }
  };

  const onSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div id="login-form-container" className="medium-container">
      {error !== null && <div>{error}</div>}

      <form id="login-form" className="medium-form">
        <div id="login-header" className="medium-header">
          Login
        </div>
        <FormControl
          variant="standard"
          sx={{ marginBottom: "25px", width: "90%" }}
        >
          <InputLabel htmlFor="user-email">Email</InputLabel>
          <Input
            id="user-email"
            name="userEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => onChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ marginBottom: "45px", width: "90%" }}
        >
          <InputLabel htmlFor="user-password">Password</InputLabel>
          <Input
            id="user-password"
            name="userPassword"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => onChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <button
          className="login-page-button"
          onClick={(event) => {
            signInWithEmailAndPasswordHandler(event, email, password);
          }}
        >
          LOGIN
        </button>
        <GoogleSignIn></GoogleSignIn>
        <div id="register-container">
          <div id="register-text">Don't have an account? Register now!</div>
          <button className="login-page-button" onClick={onSignUpClick}>
            SIGN UP
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
