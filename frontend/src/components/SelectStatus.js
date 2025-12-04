import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: theme.colors.textMuted, icon: 'radio-button-off' },
  { value: 'In Progress', label: 'Proses', color: theme.colors.info, icon: 'reload-circle' },
  { value: 'Done', label: 'Selesai', color: theme.colors.success, icon: 'checkmark-circle' },
];

const StatusChip = ({ item, isSelected, onPress }) => (
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
      numberOfLines={1} // <-- PERBAIKAN: Mencegah teks bertumpuk
      ellipsizeMode="tail" // <-- PERBAIKAN: Memotong teks jika terlalu panjang
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

export default function SelectStatus({ value, onChange }) {
  return (
    <View style={styles.container}>
      {STATUS_OPTIONS.map((item) => (
        <StatusChip 
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
    flex: 1, // <-- PERBAIKAN: Paksa chip berbagi ruang secara merata
    minWidth: 0, // <-- PERBAIKAN: Izinkan chip menyusut dari lebar defaultnya
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