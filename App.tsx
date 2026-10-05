import React from "react";
import { StatusBar } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import type { RootStackParamList } from "./src/types/auth";
import { colors } from "./src/theme/neumorphic";
import { AuthThemeProvider, usePrimaryColor } from "./src/theme/ThemeContext";
import NeumorphicDialogProvider from "./src/components/NeumorphicDialogProvider";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppProps {
  // Pass your brand color when embedding this app/screens elsewhere.
  // Omit it to use our default (#F5A623).
  primaryColor?: string;
}

export default function App({ primaryColor }: AppProps) {
  return (
    <AuthThemeProvider primaryColor={primaryColor}>
      <NeumorphicDialogProvider>
        <AppNavigator />
      </NeumorphicDialogProvider>
    </AuthThemeProvider>
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
