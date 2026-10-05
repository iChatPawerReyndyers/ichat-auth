import React, { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";
import type { AuthResponse } from "../types/auth";
import NeumorphicDialogProvider from "../components/NeumorphicDialogProvider";
import { AuthThemeProvider } from "../theme/ThemeContext";

export interface AuthSdkConfig {
  apiBaseUrl: string;
  appId: string;
  primaryColor?: string;
  socialLoginEnabled?: boolean;
  google?: {
    webClientId?: string;
    iosClientId?: string;
    androidClientId?: string;
  };
  facebook?: {
    appId?: string;
  };
  onAuthenticated?: (response: AuthResponse) => void;
  onCancel?: () => void;
}

const AuthSdkConfigContext = createContext<AuthSdkConfig | null>(null);

interface AuthSdkProviderProps extends PropsWithChildren {
  config: AuthSdkConfig;
}

export default function AuthSdkProvider({ config, children }: AuthSdkProviderProps) {
  return (
    <AuthSdkConfigContext.Provider value={config}>
      <AuthThemeProvider primaryColor={config.primaryColor}>
        <NeumorphicDialogProvider>{children}</NeumorphicDialogProvider>
      </AuthThemeProvider>
    </AuthSdkConfigContext.Provider>
  );
}

export function useAuthSdkConfig(): AuthSdkConfig {
  const config = useContext(AuthSdkConfigContext);
  if (!config) {
    throw new Error("Auth SDK components must be rendered inside AuthSdkProvider");
  }
  return config;
}
