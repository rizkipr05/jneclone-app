import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.l,
    alignItems: "center"
  },
  pressed: {
    backgroundColor: COLORS.primaryDark
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600"
  }
});
