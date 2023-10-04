import React, { useState, useContext } from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { signUpWithEmailAndPassword } from "../../controllers/SignInController";

import User from "../../models/user";
import BackButton from "../common/BackButton";
import { userPreferenceContext } from "../../controllers/PreferenceController";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [firstPwd, setFirstPwd] = useState("");
  const [secondPwd, setSecondPwd] = useState("");
  const [userName, setUserName] = useState("");
  const [level, setLevel] = useState("");
  const [originalLang, setOriginalLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [reason, setReason] = useState("");
  const [showFirstPwd, setShowFirstPwd] = useState(false);
  const [showSecondPwd, setShowSecondPwd] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const navigate = useNavigate();

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const onTextChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case "userEmail":
        setSignUpError("");
        setEmail(value);
        break;
      case "firstPwd":
        setFirstPwd(value);
        break;
      case "secondPwd":
        setSecondPwd(value);
        break;
      case "userName":
        setUserName(value);
        break;
    }
  };

  const onShowPwdClick = (firstPwd) => {
    if (firstPwd) {
      setShowFirstPwd(!showFirstPwd);
    } else {
      setShowSecondPwd(!showSecondPwd);
    }
  };

  const onSelectChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "level":
        setLevel(value);
        break;
      case "original-language":
        setOriginalLang(value);
        break;
      case "target-language":
        setTargetLang(value);
        break;
      case "reason":
        setReason(value);
        break;
    }
  };

  const onSignUpClick = async (event) => {
    event.preventDefault();
    if (
      email &&
      firstPwd &&
      secondPwd &&
      firstPwd === secondPwd &&
      firstPwd.length >= 6 &&
      userName &&
      level &&
      originalLang &&
      targetLang &&
      reason
    ) {
      var user = new User(
        email,
        userName,
        firstPwd,
        level,
        originalLang,
        targetLang,
        reason
      );
      const signUpResponse = await signUpWithEmailAndPassword(user);

      if (signUpResponse.status === 1) {
        const newPreference = {
          "dark mode": "false",
          level: level,
          "original language": originalLang,
          reason: reason,
          "target language": targetLang,
        };
        setUserPreference(newPreference);

        navigate("/main");
      } else {
        setSignUpError(signUpResponse.message);
      }
    }
  };

  return (
    <div id="signup-form-container" className="medium-container">
      <BackButton />
      <form id="signup-form" className="medium-form">
        <div id="signup-header" className="medium-header">
          Sign Up
        </div>
        {signUpError && (
          <Alert severity="error" sx={{ marginBottom: "10px" }}>
            {signUpError}
          </Alert>
        )}
        <FormControl
          variant="standard"
          sx={{ marginBottom: "25px", width: "90%" }}
          required
        >
          <InputLabel htmlFor="userEmail">Email</InputLabel>
          <Input
            id="user-email"
            name="userEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => onTextChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ marginBottom: "25px", width: "90%" }}
          required
        >
          <InputLabel htmlFor="text">User Name</InputLabel>
          <Input
            id="user-name"
            name="userName"
            type="text"
            placeholder="Enter your user name"
            value={userName}
            onChange={(event) => onTextChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            marginBottom: "25px",
            width: "90%",
          }}
          required
        >
          <InputLabel htmlFor="userPassword">Password</InputLabel>
          <Input
            id="first-password"
            name="firstPwd"
            type={`${showFirstPwd ? "text" : "password"}`}
            placeholder="Enter your password"
            value={firstPwd}
            onChange={(event) => onTextChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                onClick={() => {
                  onShowPwdClick(true);
                }}
              >
                {showFirstPwd ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ marginBottom: "25px", width: "90%" }}
          required
        >
          <InputLabel htmlFor="userPassword">Confirm Password</InputLabel>
          <Input
            id="second-password"
            name="secondPwd"
            type={`${showSecondPwd ? "text" : "password"}`}
            placeholder="Confirm your password"
            value={secondPwd}
            onChange={(event) => onTextChangeHandler(event)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                onClick={() => {
                  onShowPwdClick(false);
                }}
              >
                {showSecondPwd ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </InputAdornment>
            }
          />
          {firstPwd !== secondPwd && firstPwd.length > 0 && (
            <Alert severity="error">Passwords do not match.</Alert>
          )}
          {firstPwd.length > 0 && firstPwd.length < 6 && (
            <Alert severity="error">
              Your password needs at least 6 characters.
            </Alert>
          )}
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            marginBottom: "25px",
            width: "90%",
          }}
          required
        >
          <InputLabel>Current Proficiency</InputLabel>
          <Select
            value={level}
            name="level"
            onChange={(event) => {
              onSelectChange(event);
            }}
            label="level"
          >
            <MenuItem value={"Beginner"}>Beginner</MenuItem>
            <MenuItem value={"Elementary"}>Elementary</MenuItem>
            <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
            <MenuItem value={"Upper-Intermediate"}>Upper-Intermediate</MenuItem>
            <MenuItem value={"Advanced"}>Advanced</MenuItem>
            <MenuItem value={"Proficient User"}>Proficient User</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            marginBottom: "25px",
            width: "90%",
          }}
          required
        >
          <InputLabel>Original Language</InputLabel>
          <Select
            value={originalLang}
            name="original-language"
            onChange={(event) => {
              onSelectChange(event);
            }}
            label="original-language"
          >
            <MenuItem value={"Chinese"}>Chinese</MenuItem>
            <MenuItem value={"English"}>English</MenuItem>
            <MenuItem value={"Spanish"}>Spanish</MenuItem>
            <MenuItem value={"Japanese"}>Japanese</MenuItem>
            <MenuItem value={"Korean"}>Korean</MenuItem>
            <MenuItem value={"Franch"}>Franch</MenuItem>
            <MenuItem value={"German"}>German</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            marginBottom: "25px",
            width: "90%",
          }}
          required
        >
          <InputLabel>Target Language</InputLabel>
          <Select
            value={targetLang}
            name="target-language"
            onChange={(event) => {
              onSelectChange(event);
            }}
            label="target-language"
          >
            <MenuItem value={"Chinese"}>Chinese</MenuItem>
            <MenuItem value={"English"}>English</MenuItem>
            <MenuItem value={"Spanish"}>Spanish</MenuItem>
            <MenuItem value={"Japanese"}>Japanese</MenuItem>
            <MenuItem value={"Korean"}>Korean</MenuItem>
            <MenuItem value={"Franch"}>Franch</MenuItem>
            <MenuItem value={"German"}>German</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            marginBottom: "25px",
            width: "90%",
          }}
          required
        >
          <InputLabel>Reason to Learn</InputLabel>
          <Select
            value={reason}
            name="reason"
            onChange={(event) => {
              onSelectChange(event);
            }}
            label="reason"
          >
            <MenuItem value={"Travel"}>Travel</MenuItem>
            <MenuItem value={"Study"}>Study</MenuItem>
            <MenuItem value={"Work"}>Work</MenuItem>
            <MenuItem value={"Professional"}>Professional</MenuItem>
            <MenuItem value={"Interest"}>Interest</MenuItem>
          </Select>
        </FormControl>
        <button
          className="login-page-button"
          onClick={(event) => {
            onSignUpClick(event);
          }}
        >
          SIGN UP
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
