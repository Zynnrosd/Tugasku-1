import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function Card({ children, style, shadow = 'medium' }) {
  return (
    <View style={[styles.card, theme.shadow[shadow], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl, // Sudut lebih membulat
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});