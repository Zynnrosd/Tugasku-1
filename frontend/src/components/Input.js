import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function Input({ label, style, ...props }) {
  return (
    <View style={{ marginBottom: theme.spacing.m }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.subtext}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
    // Hapus shadow di input agar tidak terlalu ramai, ganti border halus
  },
});