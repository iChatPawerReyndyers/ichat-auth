import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { AuthFlowNavigation } from "../sdk/types";
import { useAuthApi } from "../api/authApi";
import { colors, spacing } from "../theme/neumorphic";
import NeumorphicCard from "../components/NeumorphicCard";
import NeumorphicInput from "../components/NeumorphicInput";
import NeumorphicButton from "../components/NeumorphicButton";
import DevModeBanner from "../components/DevModeBanner";
import SocialLoginButtons from "../components/SocialLoginButtons";
import CompleteProfileModal from "../components/CompleteProfileModal";
import type { AuthResponse } from "../types/auth";
import { usePrimaryColor } from "../theme/ThemeContext";
import { useNeumorphicDialog } from "../components/NeumorphicDialogProvider";
import { useAuthSdkConfig } from "../sdk/AuthSdkProvider";

interface Props {
  navigation: AuthFlowNavigation;
}

export default function LoginScreen({ navigation }: Props) {
  const showDialog = useNeumorphicDialog();
  const { onAuthenticated } = useAuthSdkConfig();
  const { login } = useAuthApi();
  const primaryColor = usePrimaryColor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [incompleteUsername, setIncompleteUsername] = useState<string | null>(null);

  // Shared by password login and social login: a profileComplete: false
  // response blocks on the modal instead of letting the user proceed —
  // re-checked live by the backend on every login, so this isn't skippable
  // by closing the app and trying again.
  const handleAuthSuccess = (res: AuthResponse) => {
    if (res.profileComplete === false && res.username) {
      setIncompleteUsername(res.username);
      return;
    }
    showDialog("Welcome", res.message, () => onAuthenticated?.(res));
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showDialog("Missing info", "Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ username, password });
      handleAuthSuccess(res);
    } catch (err: any) {
      showDialog("Login failed", err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NeumorphicCard>
        <Text style={styles.title}>Log in</Text>

        <DevModeBanner />

        <NeumorphicInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="e.g. jane_doe"
        />
        <NeumorphicInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          placeholder="Enter your password"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotPasswordRow}
        >
          <Text style={[styles.forgotPasswordText, { color: primaryColor }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <NeumorphicButton
          title="Log in"
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: spacing.sm }}
        />

        <SocialLoginButtons onSuccess={handleAuthSuccess} />

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.link, { color: primaryColor }]}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </NeumorphicCard>

      <CompleteProfileModal
        visible={incompleteUsername !== null}
        username={incompleteUsername ?? ""}
        onComplete={(response) => {
          setIncompleteUsername(null);
          showDialog("Welcome", response.message, () => onAuthenticated?.(response));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 18,
    textAlign: "center",
  },
  link: {
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: 13,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginBottom: spacing.sm,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
