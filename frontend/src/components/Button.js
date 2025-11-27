import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function Button({ title, onPress, loading, variant = 'primary', style }) {
  const backgroundColor = variant === 'danger' ? theme.colors.danger : theme.colors.primary;
  
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow, // Pakai shadow standar
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});