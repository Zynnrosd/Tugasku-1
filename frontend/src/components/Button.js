import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme';

export default function Button({ title, onPress, style, textStyle, loading, variant = 'primary' }) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={loading ? null : onPress} 
        style={[styles.container, style]}
        activeOpacity={0.7}
        disabled={loading}
      >
        <LinearGradient
          colors={theme.gradients.deepPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles.primaryButton]}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={[styles.text, styles.primaryText, textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // Contoh tombol sekunder
  return (
    <TouchableOpacity 
      onPress={loading ? null : onPress} 
      style={[styles.container, styles.secondaryButton, style]}
      activeOpacity={0.7}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <Text style={[styles.text, styles.secondaryText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    borderRadius: theme.radius.l, 
    overflow: 'hidden',
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    ...theme.shadow.medium,
    shadowColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.small
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.text,
  }
});