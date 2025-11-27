import React from "react";
import { View, StyleSheet } from "react-native";
import theme from "../constants/theme";

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
    // Menggunakan shadow dari theme
    ...theme.shadow,
  },
});