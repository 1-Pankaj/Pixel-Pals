import React, { createContext, useContext, useEffect, useState } from 'react';
import { PET_SFX } from './sounds';

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
  soundMuted: false,
  toggleSound: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('pixel_pals_theme');
    if (saved) return saved === 'dark';
    return true; // default dark/rich cocoa
  });

  const [soundMuted, setSoundMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('pixel_pals_mute') === 'true';
  });

  useEffect(() => {
    PET_SFX.setEnabled(!soundMuted);
    localStorage.setItem('pixel_pals_mute', soundMuted ? 'true' : 'false');
  }, [soundMuted]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('pixel_pals_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pixel_pals_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    PET_SFX.unlock();
    PET_SFX.chime();
    setIsDark(prev => !prev);
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    if (!next) {
      PET_SFX.setEnabled(true);
      PET_SFX.unlock();
      PET_SFX.boop();
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, soundMuted, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
