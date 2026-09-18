import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export default function CategoryChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  text: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  textSelected: {
    color: colors.primary,
    fontWeight: "700",
  }
});
