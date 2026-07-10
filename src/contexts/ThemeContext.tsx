'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'cocheria-theme';
const DEFAULT_THEME: Theme = 'light';

const readStoredTheme = (): Theme | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Start from the default so the first client render matches the server and
  // there is no hydration mismatch. The persisted value is adopted after mount.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // Adopt the persisted theme once mounted. useLayoutEffect keeps this ahead of
  // paint, which also covers client-side navigation.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    // Intentional post-mount setState: we must start from DEFAULT_THEME to match
    // the server render and only adopt the persisted value once localStorage is
    // available on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setTheme(stored);
  }, []);

  // Reflect the theme on <html> so the CSS variables key off it.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () =>
      setTheme(t => {
        const next = t === 'light' ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEY, next);
        return next;
      }),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
};
