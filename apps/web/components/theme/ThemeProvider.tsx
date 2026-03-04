/**
 * Theme Provider
 * 
 * Wraps app with next-themes for dark/light mode support.
 * Persists theme in localStorage.
 * Falls back to system preference.
 * Prevents flash-of-unstyled-theme.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
