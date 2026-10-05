import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
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

export default function RegisterScreen({ navigation }: Props) {
  const showDialog = useNeumorphicDialog();
  const { onAuthenticated } = useAuthSdkConfig();
  const { register } = useAuthApi();
  const primaryColor = usePrimaryColor();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [incompleteUsername, setIncompleteUsername] = useState<string | null>(null);

  // Only reachable via the social buttons here — the form above always
  // collects birthYear/phoneNumber itself, so a password registration's
  // response is always profileComplete: true.
  const handleSocialSuccess = (res: AuthResponse) => {
    if (res.profileComplete === false && res.username) {
      setIncompleteUsername(res.username);
      return;
    }
    showDialog("Welcome", res.message, () => {
      onAuthenticated?.(res);
      navigation.navigate("Login");
    });
  };

  const handleRegister = async () => {
    if (
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !birthYear ||
      !phoneNumber
    ) {
      showDialog("Missing info", "Please fill in every field.");
      return;
    }
    if (password !== confirmPassword) {
      showDialog("Password mismatch", "Password and confirm password must match.");
      return;
    }
    const yearNum = parseInt(birthYear, 10);
    if (Number.isNaN(yearNum)) {
      showDialog("Invalid birth year", "Please enter a valid year, e.g. 1995.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        username,
        email: email.trim() || undefined,
        firstName,
        lastName,
        password,
        confirmPassword,
        birthYear: yearNum,
        phoneNumber,
      });
      showDialog("Success", res.message, () => navigation.navigate("Login"));
    } catch (err: any) {
      showDialog("Registration failed", err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NeumorphicCard>
        <Text style={styles.title}>Create account</Text>

        <DevModeBanner />

        <View style={styles.row}>
          <NeumorphicInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            containerStyle={styles.halfInput}
          />
          <View style={styles.columnGap} />
          <NeumorphicInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            containerStyle={styles.halfInput}
          />
        </View>

        <NeumorphicInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <NeumorphicInput
          label="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <View style={styles.row}>
          <NeumorphicInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            containerStyle={styles.halfInput}
          />
          <View style={styles.columnGap} />
          <NeumorphicInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            containerStyle={styles.halfInput}
          />
        </View>

        <View style={styles.row}>
          <NeumorphicInput
            label="Birth year"
            value={birthYear}
            onChangeText={setBirthYear}
            keyboardType="number-pad"
            placeholder="e.g. 1998"
            containerStyle={styles.halfInput}
          />
          <View style={styles.columnGap} />
          <NeumorphicInput
            label="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="e.g. +15551234567"
            containerStyle={styles.halfInput}
          />
        </View>

        <NeumorphicButton
          title="Register"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: spacing.sm }}
        />

        <SocialLoginButtons onSuccess={handleSocialSuccess} />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.link, { color: primaryColor }]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </NeumorphicCard>

      <CompleteProfileModal
        visible={incompleteUsername !== null}
        username={incompleteUsername ?? ""}
        onComplete={(response) => {
          setIncompleteUsername(null);
          showDialog("Welcome", response.message, () => {
            onAuthenticated?.(response);
            navigation.navigate("Login");
          });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  row: { flexDirection: "row", alignItems: "flex-start" },
  halfInput: { flex: 1 },
  columnGap: { width: spacing.md },
  link: {
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: 13,
  },
});
