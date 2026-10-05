import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { colors, radii, raisedShadow, spacing } from "../theme/neumorphic";
import NeumorphicInput from "./NeumorphicInput";
import NeumorphicButton from "./NeumorphicButton";
import { useAuthApi } from "../api/authApi";
import { useNeumorphicDialog } from "./NeumorphicDialogProvider";
import type { AuthResponse } from "../types/auth";

interface Props {
  visible: boolean;
  username: string;
  // Called once the profile has been successfully completed.
  onComplete: (response: AuthResponse) => void;
}

/**
 * Blocking — no close button, backdrop press does nothing, and Android's
 * hardware back button is swallowed (onRequestClose is a no-op). This is
 * intentional: birthYear/phoneNumber are required fields that a
 * Google/Facebook sign-up doesn't provide, so the user can't proceed into
 * the app without filling them in here. Re-shown on every login where the
 * backend's profileComplete comes back false — see authApi.ts and
 * LoginScreen/RegisterScreen's handleAuthSuccess.
 */
export default function CompleteProfileModal({ visible, username, onComplete }: Props) {
  const showDialog = useNeumorphicDialog();
  const { completeProfile } = useAuthApi();
  const [birthYear, setBirthYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!birthYear || !phoneNumber) {
      showDialog("Missing info", "Please fill in both fields.");
      return;
    }
    const yearNum = parseInt(birthYear, 10);
    if (Number.isNaN(yearNum)) {
      showDialog("Invalid birth year", "Please enter a valid year, e.g. 1995.");
      return;
    }

    setLoading(true);
    try {
      const response = await completeProfile({ username, birthYear: yearNum, phoneNumber });
      onComplete(response);
    } catch (err: any) {
      showDialog("Couldn't save", err.message ?? "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        /* no-op: blocks Android's hardware back button from dismissing this */
      }}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, raisedShadow]}>
          <Text style={styles.title}>Just a few more details</Text>
          <Text style={styles.subtitle}>
            Google/Facebook didn't share these, but we need them to finish
            setting up your account
          </Text>

          <NeumorphicInput
            label="Birth year"
            value={birthYear}
            onChangeText={setBirthYear}
            keyboardType="number-pad"
            placeholder="e.g. 1998"
          />
          <NeumorphicInput
            label="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="e.g. +15551234567"
          />

          <NeumorphicButton
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(58,67,88,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.background,
    borderRadius: radii.card,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
