import { Routes, Route } from 'react-router-dom'

import './App.css';

import SignInForm from './components/SignInForm';
import PreferencePage from './components/PreferencePage';
import MainPage from './components/MainPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={ <SignInForm /> }/>
        <Route path="/LanguagePref" element={ <PreferencePage prefName="target language" nextPage={"/ReasonPref"}></PreferencePage> }/>
        <Route path="/ReasonPref" element={ <PreferencePage prefName="reason" nextPage={"/LevelPref"}></PreferencePage> }/>
        <Route path="/LevelPref" element={ <PreferencePage prefName="level" nextPage={"/main"} /> }/>
        <Route path="/main" element={ <MainPage /> }/>
    </Routes>
  );
}

export default App;
