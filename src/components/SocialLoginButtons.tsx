import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { colors, radii, raisedShadow, spacing } from "../theme/neumorphic";
import { useGoogleAuth } from "../auth/useGoogleAuth";
import { useFacebookAuth } from "../auth/useFacebookAuth";
import { useAuthApi } from "../api/authApi";
import type { AuthResponse } from "../types/auth";
import { useNeumorphicDialog } from "./NeumorphicDialogProvider";
import { useAuthSdkConfig } from "../sdk/AuthSdkProvider";

interface Props {
  onSuccess: (res: AuthResponse) => void;
}

export default function SocialLoginButtons({ onSuccess }: Props) {
  const showDialog = useNeumorphicDialog();
  const { loginWithGoogle, loginWithFacebook } = useAuthApi();
  const { socialLoginEnabled = false, google, facebook } = useAuthSdkConfig();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);
  const googleDisabled = !socialLoginEnabled || !google?.webClientId;
  const facebookDisabled = !socialLoginEnabled || !facebook?.appId;

  const handleAuthResult = async (
    provider: "google" | "facebook",
    call: () => Promise<AuthResponse>
  ) => {
    setLoadingProvider(provider);
    try {
      const res = await call();
      onSuccess(res);
    } catch (err: any) {
      showDialog("Sign-in failed", err.message ?? "Something went wrong");
    } finally {
      setLoadingProvider(null);
    }
  };

  const { signIn: signInWithGoogle } = useGoogleAuth((idToken) => {
    handleAuthResult("google", () => loginWithGoogle({ idToken }));
  });

  const { signIn: signInWithFacebook } = useFacebookAuth((accessToken) => {
    handleAuthResult("facebook", () => loginWithFacebook({ accessToken }));
  });

  const handleGooglePress = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      showDialog("Sign-in failed", err.message ?? "Something went wrong");
    }
  };

  const handleFacebookPress = async () => {
    try {
      await signInWithFacebook();
    } catch (err: any) {
      showDialog("Sign-in failed", err.message ?? "Something went wrong");
    }
  };

  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={[styles.buttonShadow, styles.googleButton, raisedShadow]}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton, googleDisabled && styles.disabledButton]}
          onPress={handleGooglePress}
          disabled={googleDisabled || loadingProvider !== null}
          accessibilityState={{ disabled: googleDisabled || loadingProvider !== null }}
          activeOpacity={0.85}
        >
          {loadingProvider === "google" ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <>
              <View style={styles.googleDot} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
          {googleDisabled && <BlurView pointerEvents="none" style={StyleSheet.absoluteFill} blurType="light" blurAmount={1} reducedTransparencyFallbackColor={colors.background} />}
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonShadow, styles.facebookButton, raisedShadow]}>
        <TouchableOpacity
          style={[styles.button, styles.facebookButton, facebookDisabled && styles.disabledButton]}
          onPress={handleFacebookPress}
          disabled={facebookDisabled || loadingProvider !== null}
          accessibilityState={{ disabled: facebookDisabled || loadingProvider !== null }}
          activeOpacity={0.85}
        >
          {loadingProvider === "facebook" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <View style={styles.facebookIcon}>
                <Text style={styles.facebookIconText}>f</Text>
              </View>
              <Text style={styles.facebookText}>Continue with Facebook</Text>
            </>
          )}
          {facebookDisabled && <BlurView pointerEvents="none" style={StyleSheet.absoluteFill} blurType="light" blurAmount={1} reducedTransparencyFallbackColor={colors.background} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  button: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: radii.control,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  buttonShadow: {
    borderRadius: radii.control,
    marginBottom: spacing.sm,
  },
  disabledButton: { opacity: 0.62 },
  googleButton: { backgroundColor: colors.surfaceRaised },
  googleDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#4285F4",
    marginRight: spacing.sm,
  },
  googleText: { color: colors.textPrimary, fontSize: 14, fontWeight: "600" },
  facebookButton: { backgroundColor: "#3B5998" },
  facebookIcon: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  facebookIconText: { color: "#3B5998", fontWeight: "800", fontSize: 11 },
  facebookText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
