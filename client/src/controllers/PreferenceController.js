import { createContext } from "react";

// Controls preference context throughout user usage
const userPreferenceContext = createContext({
  userPreference: {},
  setUserPreference: () => {},
});

export { userPreferenceContext };
