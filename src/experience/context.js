'use client'

import { createContext, useContext, useMemo, useReducer } from "react";
import { initialExperienceState } from "./initialState";
import { experienceActions, experienceReducer } from "./reducer";

const ExperienceContext = createContext(null);

export function ExperienceProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(
    experienceReducer,
    initialState ?? initialExperienceState,
  );

  const value = useMemo(() => ({ state, dispatch, actions: experienceActions }), [state]);

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return ctx;
}

