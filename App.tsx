import React from "react";
import { StatusBar } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import type { RootStackParamList } from "./src/types/auth";
import { colors } from "./src/theme/neumorphic";
import { usePrimaryColor } from "./src/theme/ThemeContext";
import AuthSdkProvider from "./src/sdk/AuthSdkProvider";
import {
  AUTH_API_BASE_URL,
  APP_ID,
  FACEBOOK_APP_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  SOCIAL_LOGIN_ENABLED,
} from "./src/config/appConfig";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppProps {
  // Pass your brand color when embedding this app/screens elsewhere.
  // Omit it to use our default (#F5A623).
  primaryColor?: string;
}

export default function App({ primaryColor }: AppProps) {
  return (
    <AuthSdkProvider
      config={{
        apiBaseUrl: AUTH_API_BASE_URL,
        appId: APP_ID,
        primaryColor,
        socialLoginEnabled: SOCIAL_LOGIN_ENABLED,
        google: {
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID,
          androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        },
        facebook: { appId: FACEBOOK_APP_ID },
      }}
    >
      <AppNavigator />
    </AuthSdkProvider>
  );
}

function AppNavigator() {
  const accent = usePrimaryColor();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: accent,
      background: colors.background,
      card: colors.background,
      text: colors.textPrimary,
      border: colors.divider,
      notification: accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen navigation={{ navigate: (screen) => navigation.navigate(screen) }} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {({ navigation }) => (
            <RegisterScreen navigation={{ navigate: (screen) => navigation.navigate(screen) }} />
          )}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {({ navigation }) => (
            <ForgotPasswordScreen navigation={{ navigate: (screen) => navigation.navigate(screen) }} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
