import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../controllers/FirebaseController';
import { signInWithEmailAndPassword } from '../controllers/SignInController';
import { userPreferenceContext } from '../controllers/PreferenceController';

import GoogleSignIn from './GoogleSignIn';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { userPreference, setUserPreference } = useContext(userPreferenceContext);

    const navigate = useNavigate();

    const signInWithEmailAndPasswordHandler = async (event, email, password) => {
        event.preventDefault();
        var preferences = await signInWithEmailAndPassword(email, password);

        // Set preference context
        if (preferences) {
            setUserPreference(preferences);

            // Navigate to different pages if missing preferences
            if (!preferences["target language"]) {
                navigate("/target-language-pref");
            } else if (!preferences["original language"]) {
                navigate("/original-language-pref");
            } else if (!preferences["reason"]) {
                navigate("/reason-pref");
            } else if (!preferences["level"]) {
                navigate("/level-pref");
            } else {
                navigate("/main");
            } 
        }
     };

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;
        
        if (name === 'userEmail') {
            setEmail(value);
        }
        else if (name === 'userPassword'){
            setPassword(value);
        }
    };

    return (
        <div>
            {error !== null && <div>{error}</div>}
            <form>
                <label htmlFor="userEmail">
                    Email:
                </label>
                <input
                    type="email"
                    name="userEmail"
                    value = {email}
                    placeholder="Enter your email"
                    id="userEmail"
                    onChange = {(event) => onChangeHandler(event)}
                />
                <label htmlFor="userPassword">
                    Password:
                </label>
                <input
                    type="password"
                    name="userPassword"
                    value = {password}
                    placeholder="Enter your password"
                    id="userPassword"
                    onChange = {(event) => onChangeHandler(event)}
                />
                <button onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
                    Sign in
                </button>
                <GoogleSignIn></GoogleSignIn>
            </form>
        </div>
    );
};

export default SignInForm;
