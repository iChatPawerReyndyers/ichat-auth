import React, { createContext, useContext, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import NeumorphicButton from "./NeumorphicButton";
import { colors, radii, raisedShadow, spacing } from "../theme/neumorphic";

interface DialogState {
  title: string;
  message: string;
  onConfirm?: () => void;
}

type ShowDialog = (title: string, message: string, onConfirm?: () => void) => void;

const DialogContext = createContext<ShowDialog | null>(null);

export function useNeumorphicDialog(): ShowDialog {
  const showDialog = useContext(DialogContext);
  if (!showDialog) {
    throw new Error("useNeumorphicDialog must be used inside NeumorphicDialogProvider");
  }
  return showDialog;
}

export default function NeumorphicDialogProvider({ children }: React.PropsWithChildren) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const showDialog: ShowDialog = (title, message, onConfirm) => {
    setDialog({ title, message, onConfirm });
  };

  const dismiss = () => setDialog(null);
  const confirm = () => {
    const onConfirm = dialog?.onConfirm;
    setDialog(null);
    onConfirm?.();
  };

  return (
    <DialogContext.Provider value={showDialog}>
      {children}
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        onRequestClose={dismiss}
      >
        <View style={styles.backdrop}>
          <View style={[styles.card, raisedShadow]}>
            <Text style={styles.title}>{dialog?.title}</Text>
            <Text style={styles.message}>{dialog?.message}</Text>
            <NeumorphicButton title="OK" onPress={confirm} style={styles.button} />
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(58,67,88,0.35)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    padding: spacing.xl,
    borderRadius: radii.card,
    backgroundColor: colors.surfaceRaised,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.sm,
  },
});
