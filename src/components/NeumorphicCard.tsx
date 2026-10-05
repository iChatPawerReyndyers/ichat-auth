import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radii, raisedShadow } from "../theme/neumorphic";

interface Props {
  style?: ViewStyle;
}

export default function NeumorphicCard({ children, style }: PropsWithChildren<Props>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.card,
    padding: 24,
    ...raisedShadow,
  },
});
