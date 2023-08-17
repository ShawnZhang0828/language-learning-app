import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../controllers/FirebaseController';

import GoogleSignIn from './GoogleSignIn';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const signInWithEmailAndPasswordHandler = 
        (event, email, password) => {
            event.preventDefault();
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigate("/language-pref");
                })
                .catch(error => {
                setError("Error signing in with password and email!");
                console.error("Error signing in with password and email", error);
            });
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
