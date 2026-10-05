import { ViewStyle } from "react-native";

// Palette lifted directly from the uploaded neumorphic reference files.
export const colors = {
  background: "#E6EBF2",
  surfaceRaised: "#E6EBF2",
  surfaceInset: "#DEE4ED",
  shadowDark: "#A6B0C3",
  shadowLight: "#FFFFFF",
  accent: "#F5A623",
  danger: "#E06B6B",
  textPrimary: "#3A4358",
  textSecondary: "#8891A5",
  textMuted: "#B4BBCB",
  divider: "#D5DCE7",
};

// Dual soft shadows require React Native's New Architecture, enabled for both
// native targets in this app.
export const raisedShadow = {
  boxShadow: `4px 4px 8px ${colors.shadowDark}, -4px -4px 8px ${colors.shadowLight}`,
} as ViewStyle;

export const insetBorderHighlight: ViewStyle = {
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderTopColor: "#FFFFFF",
  borderLeftColor: "#FFFFFF",
};

// "Inset" fields (text inputs) can't truly inset-shadow in RN, so we fake the
// pressed-in look with a slightly darker fill + a subtle inner-edge border.
export const insetFieldStyle: ViewStyle = {
  backgroundColor: colors.surfaceInset,
  borderRadius: 16,
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderTopColor: colors.shadowDark,
  borderLeftColor: colors.shadowDark,
  borderBottomColor: colors.shadowLight,
  borderRightColor: colors.shadowLight,
};

export const radii = {
  card: 20,
  control: 12,
  pill: 24,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};
