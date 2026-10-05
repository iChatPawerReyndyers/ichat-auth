import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/auth";
import { forgotPassword, resetPassword } from "../api/authApi";
import { colors, spacing } from "../theme/neumorphic";
import { usePrimaryColor } from "../theme/ThemeContext";
import NeumorphicCard from "../components/NeumorphicCard";
import NeumorphicInput from "../components/NeumorphicInput";
import NeumorphicButton from "../components/NeumorphicButton";
import { useNeumorphicDialog } from "../components/NeumorphicDialogProvider";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

type Step = "request" | "verify";

export default function ForgotPasswordScreen({ navigation }: Props) {
  const showDialog = useNeumorphicDialog();
  const primaryColor = usePrimaryColor();
  const [step, setStep] = useState<Step>("request");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async () => {
    if (!username) {
      showDialog("Missing info", "Please enter your username.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword({ username });
      showDialog("Check your phone", res.message);
      setStep("verify");
    } catch (err: any) {
      showDialog("Something went wrong", err.message ?? "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmNewPassword) {
      showDialog("Missing info", "Please fill in every field.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showDialog("Password mismatch", "New password and confirm password must match.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({ username, otp, newPassword, confirmNewPassword });
      showDialog("Success", res.message, () => navigation.navigate("Login"));
    } catch (err: any) {
      showDialog("Reset failed", err.message ?? "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NeumorphicCard>
        {step === "request" ? (
          <>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              We'll text a code to the mobile number on your account
            </Text>

            <NeumorphicInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <NeumorphicButton
              title="Send code"
              onPress={handleRequestCode}
              loading={loading}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter code & new password</Text>
            <Text style={styles.subtitle}>Check your phone for the 6-digit code</Text>

            <NeumorphicInput
              label="6-digit code"
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, "").slice(0, 6))}
              keyboardType="number-pad"
              placeholder="123456"
            />
            <NeumorphicInput
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              isPassword
            />
            <NeumorphicInput
              label="Confirm new password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              isPassword
            />

            <NeumorphicButton
              title="Reset password"
              onPress={handleResetPassword}
              loading={loading}
              style={{ marginTop: spacing.sm }}
            />

            <TouchableOpacity onPress={() => setStep("request")}>
              <Text style={[styles.link, { color: primaryColor }]}>Resend code</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.link, { color: primaryColor }]}>← Back to login</Text>
        </TouchableOpacity>
      </NeumorphicCard>
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
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  link: {
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: 13,
  },
});
