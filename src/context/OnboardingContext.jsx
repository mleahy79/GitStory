import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [answers, setAnswers] = useState({
    step1: null,
    step2: null,
    step3: [],
    step4: null,
  });

  const setAnswer = (step, value) =>
    setAnswers((prev) => ({ ...prev, [step]: value }));

  return (
    <OnboardingContext.Provider value={{ answers, setAnswer }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
