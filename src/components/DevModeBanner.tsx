import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { insetFieldStyle, spacing } from "../theme/neumorphic";
import { usePrimaryColor } from "../theme/ThemeContext";
import { IS_DEV_MODE } from "../config/appConfig";

export default function DevModeBanner() {
  const primaryColor = usePrimaryColor();
  if (!IS_DEV_MODE) return null;

  return (
    <View style={styles.banner}>
      <Text style={[styles.text, { color: primaryColor }]}>
        TESTING MODE — any password is accepted
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    ...insetFieldStyle,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
});
