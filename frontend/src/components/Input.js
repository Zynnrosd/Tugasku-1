import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

export default function Input({ label, icon, value, onChangeText, placeholder, multiline, keyboardType, style }) {
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, multiline && styles.textAreaContainer, style]}>
        {icon && <Ionicons name={icon} size={20} color={theme.colors.primary} style={styles.inputIcon} />}
        <TextInput 
          style={[styles.input, multiline && styles.textArea]} 
          value={value} 
          onChangeText={onChangeText} 
          placeholder={placeholder} 
          placeholderTextColor={theme.colors.textMuted}
          multiline={multiline}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 16 },
  label: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: theme.colors.textMuted, 
    marginBottom: 8, 
    textTransform: 'uppercase' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.card, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    borderRadius: theme.radius.m, 
    paddingHorizontal: 12,
    ...theme.shadow.small 
  },
  textAreaContainer: { 
    alignItems: 'flex-start', 
    paddingVertical: 12,
    height: 100, // Tinggi tetap untuk textarea
  },
  inputIcon: { marginRight: 10 },
  input: { 
    flex: 1, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 10, 
    fontSize: 16, 
    color: theme.colors.text 
  },
  textArea: { paddingVertical: 0 },
});