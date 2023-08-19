import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'

import './App.css';
import { userPreferenceContext } from './controllers/PreferenceController';

import SignInForm from './components/SignInForm';
import PreferencePage from './components/PreferencePage';
import MainPage from './components/MainPage';
import VocabularyLibrary from './components/VocabularyLibrary';

function App() {

    // Use local storage to persist user preference context on page refresh
    const [userPreference, setUserPreference] = useState(() => {
        const savedPreference = localStorage.getItem('userPreference');
        return savedPreference ? JSON.parse(savedPreference) : {};
    });

    // Update local storage when there is a change in user preference context
    useEffect(() => {
        localStorage.setItem('userPreference', JSON.stringify(userPreference));
    }, [userPreference]);

    return (
      <userPreferenceContext.Provider value={{ userPreference, setUserPreference }}>
          <Routes>
              <Route path="/" element={ <SignInForm /> }/>
              <Route path="/language-pref" element={ <PreferencePage prefName="target language" nextPage={"/reason-pref"}></PreferencePage> }/>
              <Route path="/reason-pref" element={ <PreferencePage prefName="reason" nextPage={"/level-pref"}></PreferencePage> }/>
              <Route path="/level-pref" element={ <PreferencePage prefName="level" nextPage={"/main"} /> }/>
              <Route path="/main" element={ <MainPage /> }/>
              <Route path="/vocabulary-library" element={ <VocabularyLibrary /> }/>
          </Routes>
      </userPreferenceContext.Provider>
    );
}

export default App;
