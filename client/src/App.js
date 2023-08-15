import { Routes, Route } from 'react-router-dom'

import './App.css';

import SignInForm from './components/SignInForm';
import PreferencePage from './components/PreferencePage';
import MainPage from './components/MainPage';
import VocabularyLibrary from './components/VocabularyLibrary';

function App() {
  return (
    <Routes>
        <Route path="/" element={ <SignInForm /> }/>
        <Route path="/language-pref" element={ <PreferencePage prefName="target language" nextPage={"/reason-pref"}></PreferencePage> }/>
        <Route path="/reason-pref" element={ <PreferencePage prefName="reason" nextPage={"/level-pref"}></PreferencePage> }/>
        <Route path="/level-pref" element={ <PreferencePage prefName="level" nextPage={"/main"} /> }/>
        <Route path="/main" element={ <MainPage /> }/>
        <Route path="/vocabulary-library" element={ <VocabularyLibrary /> }/>
    </Routes>
  );
}

export default App;
