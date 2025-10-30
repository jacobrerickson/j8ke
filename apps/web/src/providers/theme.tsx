'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);

    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setThemeState(storedTheme);
      } else {
        // If no stored theme, use the default
        setThemeState(defaultTheme);
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      setThemeState(defaultTheme);
    }
  }, [storageKey, defaultTheme]);

  // Handle theme resolution and system theme changes
  useEffect(() => {
    if (!isHydrated) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveTheme = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
        updateDocumentClass(systemTheme);
      } else {
        setResolvedTheme(theme as 'light' | 'dark');
        updateDocumentClass(theme as 'light' | 'dark');
      }
    };

    const handleChange = () => {
      if (theme === 'system') {
        resolveTheme();
      }
    };

    // Set initial resolved theme
    resolveTheme();

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isHydrated]);

  const updateDocumentClass = (resolvedTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;

    // Add a brief transition class to make the switch smoother
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    root.classList.remove('tw-light', 'tw-dark');
    root.classList.add(`tw-${resolvedTheme}`);

    // Remove the inline transition after it completes to avoid interfering with other transitions
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  };

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    setThemeState(newTheme);

    if (isHydrated) {
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
        updateDocumentClass(systemTheme);
      } else {
        setResolvedTheme(newTheme as 'light' | 'dark');
        updateDocumentClass(newTheme as 'light' | 'dark');
      }
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    isHydrated,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
