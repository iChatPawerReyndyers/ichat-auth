import React, { createContext, useContext, PropsWithChildren } from "react";
import { colors as baseColors } from "./neumorphic";

interface AuthThemeContextValue {
  primaryColor: string;
}

const AuthThemeContext = createContext<AuthThemeContextValue>({
  primaryColor: baseColors.accent,
});

interface AuthThemeProviderProps {
  /**
   * Brand color for the integrating app. Applied to the primary button,
   * links, and other accent highlights across the Login/Register screens.
   * Everything else (backgrounds, shadows, text colors) stays fixed to our
   * default neumorphic look.
   *
   * Omit this to use our default (#F5A623).
   */
  primaryColor?: string;
}

/**
 * Wrap the Login/Register screens (or your whole app) in this to re-brand
 * the accent color:
 *
 *   <AuthThemeProvider primaryColor="#4C6FFF">
 *     <LoginScreen ... />
 *   </AuthThemeProvider>
 *
 * No primaryColor passed → falls back to our default automatically.
 */
export function AuthThemeProvider({
  primaryColor,
  children,
}: PropsWithChildren<AuthThemeProviderProps>) {
  return (
    <AuthThemeContext.Provider value={{ primaryColor: primaryColor ?? baseColors.accent }}>
      {children}
    </AuthThemeContext.Provider>
  );
}

/** Current primary/accent color — our default unless an AuthThemeProvider above overrides it. */
export function usePrimaryColor(): string {
  return useContext(AuthThemeContext).primaryColor;
}
