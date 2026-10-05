import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { colors, radii, raisedShadow } from "../theme/neumorphic";
import { usePrimaryColor } from "../theme/ThemeContext";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}

export default function NeumorphicButton({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
}: Props) {
  const isPrimary = variant === "primary";
  const primaryColor = usePrimaryColor();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        isPrimary ? { backgroundColor: primaryColor } : styles.secondary,
        raisedShadow,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : colors.textPrimary} />
      ) : (
        <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: colors.surfaceRaised },
  disabled: { opacity: 0.5 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryText: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
});
