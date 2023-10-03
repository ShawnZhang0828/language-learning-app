import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import { userPreferenceContext } from "./controllers/PreferenceController";

import SignInForm from "./components/account/SignInForm";
import SignUpForm from "./components/account/SignUpForm";
import PreferencePage from "./components/PreferencePage";
import MainPage from "./components/MainPage";
import VocabularyLibrary from "./components/vocabulary/VocabularyLibrary";
import VocabularyQuiz from "./components/vocabulary/VocabularyQuiz";
import ChatPageParamSetter from "./components/conversation/ChatPageParamSetter";
import ScenarioSelectionPage from "./components/conversation/ScenarioSelectionPage";
import StoryPage from "./components/reading/StoryPage";

function App() {
  // Use local storage to persist user preference context on page refresh
  const [userPreference, setUserPreference] = useState(() => {
    const savedPreference = localStorage.getItem("userPreference");
    return savedPreference ? JSON.parse(savedPreference) : {};
  });

  const theme = createTheme({
    typography: {
      fontFamily: `'Catamaran', sans-serif`,
    },
  });

  // Update local storage when there is a change in user preference context
  useEffect(() => {
    localStorage.setItem("userPreference", JSON.stringify(userPreference));
  }, [userPreference]);

  return (
    <ThemeProvider theme={theme}>
      <userPreferenceContext.Provider
        value={{ userPreference, setUserPreference }}
      >
        <Routes>
          <Route path="/" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route
            path="/target-language-pref"
            element={
              <PreferencePage
                prefName="target language"
                nextPage={"/original-language-pref"}
              ></PreferencePage>
            }
          />
          <Route
            path="/original-language-pref"
            element={
              <PreferencePage
                prefName="original language"
                nextPage={"/reason-pref"}
              ></PreferencePage>
            }
          />
          <Route
            path="/reason-pref"
            element={
              <PreferencePage
                prefName="reason"
                nextPage={"/level-pref"}
              ></PreferencePage>
            }
          />
          <Route
            path="/level-pref"
            element={<PreferencePage prefName="level" nextPage={"/main"} />}
          />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chatbot-chat/:type" element={<ChatPageParamSetter />} />
          <Route path="/role-play" element={<ScenarioSelectionPage />} />
          <Route path="/vocabulary-library" element={<VocabularyLibrary />} />
          <Route path="/vocabulary-quiz" element={<VocabularyQuiz />} />
          <Route path="/story" element={<StoryPage />} />
        </Routes>
      </userPreferenceContext.Provider>
    </ThemeProvider>
  );
}

export default App;
