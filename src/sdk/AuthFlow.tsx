import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/neumorphic";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuthSdkConfig } from "./AuthSdkProvider";
import type { AuthFlowNavigation, AuthScreenName } from "./types";

export interface AuthFlowProps {
  onCancel?: () => void;
}

export default function AuthFlow({ onCancel }: AuthFlowProps) {
  const { onCancel: configuredOnCancel } = useAuthSdkConfig();
  const [screen, setScreen] = useState<AuthScreenName>("Login");
  const navigation: AuthFlowNavigation = { navigate: setScreen };
  const cancel = onCancel ?? configuredOnCancel;

  return (
    <View style={styles.container}>
      {cancel && (
        <TouchableOpacity
          onPress={cancel}
          style={styles.cancelButton}
          accessibilityRole="button"
          accessibilityLabel="Close sign in"
        >
          <Text style={styles.cancelText}>×</Text>
        </TouchableOpacity>
      )}
      {screen === "Login" && <LoginScreen navigation={navigation} />}
      {screen === "Register" && <RegisterScreen navigation={navigation} />}
      {screen === "ForgotPassword" && <ForgotPasswordScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cancelButton: {
    position: "absolute",
    zIndex: 1,
    top: 8,
    right: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 28,
    lineHeight: 32,
  },
});