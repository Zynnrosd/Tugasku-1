import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'Mendesak', color: theme.colors.danger, icon: 'flash' },
  { value: 'Medium', label: 'Menengah', color: theme.colors.warning, icon: 'time' },
  { value: 'Low', label: 'Santai', color: theme.colors.success, icon: 'leaf' },
];

const PriorityChip = ({ item, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.chip,
      isSelected ? { backgroundColor: item.color + '15', borderColor: item.color } : styles.chipDefault
    ]} 
    onPress={onPress}
  >
    <Ionicons name={item.icon} size={16} color={isSelected ? item.color : theme.colors.textMuted} />
    <Text 
      style={[styles.chipText, isSelected && { color: item.color }]}
      numberOfLines={1} 
      ellipsizeMode="tail"
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

export default function SelectPriority({ value, onChange }) {
  return (
    <View style={styles.container}>
      {PRIORITY_OPTIONS.map((item) => (
        <PriorityChip 
          key={item.value} 
          item={item} 
          isSelected={value === item.value} 
          onPress={() => onChange(item.value)} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 4,
  },
  chip: {
    flex: 1, 
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.l,
    borderWidth: 1,
    ...theme.shadow.small,
  },
  chipDefault: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  chipText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});