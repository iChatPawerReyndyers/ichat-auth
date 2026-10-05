import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors, raisedShadow, spacing } from "../theme/neumorphic";

interface Props extends TextInputProps {
  label: string;
  // When true, renders a right-aligned eye icon that toggles showing the
  // password in plain text — overrides any secureTextEntry passed in,
  // since visibility is then controlled by the toggle instead.
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function NeumorphicInput({
  label,
  isPassword,
  secureTextEntry,
  style,
  containerStyle,
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);

  if (!isPassword) {
    return (
      <View style={[styles.wrapper, containerStyle]}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputShell}>
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={secureTextEntry}
            underlineColorAndroid="transparent"
            {...rest}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!visible}
          underlineColorAndroid="transparent"
          {...rest}
        />
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.eyeButton}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Hide password" : "Show password"}
        >
          <View style={styles.eyeIcon}>
            <View style={styles.eyeShape}>
              <View style={styles.eyePupil}>
                <View style={styles.eyePupilCore} />
              </View>
            </View>
            <View style={styles.eyeShape}>
              <View style={styles.eyePupil}>
                <View style={styles.eyePupilCore} />
              </View>
            </View>
            {visible && <View style={styles.eyeSlash} />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexShrink: 1, marginBottom: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputShell: {
    backgroundColor: colors.surfaceRaised,
    ...raisedShadow,
    height: 39,
    borderRadius: 16,
  },
  passwordContainer: {
    backgroundColor: colors.surfaceRaised,
    ...raisedShadow,
    height: 39,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 11,
    paddingRight: 6,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  eyeButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  eyeIcon: {
    width: 30,
    height: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  eyeShape: {
    width: 13,
    height: 23,
    borderWidth: 1.7,
    borderColor: colors.textPrimary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eyePupil: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: 2 }],
  },
  eyePupilCore: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.surfaceRaised,
  },
  eyeSlash: {
    position: "absolute",
    width: 23,
    height: 1.5,
    backgroundColor: colors.textSecondary,
    transform: [{ rotate: "-38deg" }],
  },
});
