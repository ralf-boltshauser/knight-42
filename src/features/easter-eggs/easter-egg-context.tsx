"use client";

import { Sound } from "@/types/sounds";
import { createContext, useContext, useState } from "react";

type EasterEggContextType = {
  memeSoundsAllowed: boolean;
  setMemeSoundsAllowed: (allowed: boolean) => void;
  getSound: (sound: Sound) => string;
};

const EasterEggContext = createContext<EasterEggContextType | undefined>(
  undefined
);

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [memeSoundsAllowed, setMemeSoundsAllowed] = useState(false);

  const getSound = (sound: Sound) => {
    if (memeSoundsAllowed) {
      switch (sound) {
        case Sound.NOTIFICATION_1:
          return "/sounds/ahh.mp3";
      }
    }
    return sound;
  };

  return (
    <EasterEggContext.Provider
      value={{ memeSoundsAllowed, setMemeSoundsAllowed, getSound }}
    >
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext);
  if (context === undefined) {
    throw new Error("useEasterEgg must be used within an EasterEggProvider");
  }
  return context;
}
