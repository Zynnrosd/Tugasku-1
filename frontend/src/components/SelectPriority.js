import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../constants/theme";

const options = ["High", "Medium", "Low"];

export default function SelectPriority({ value, onChange }) {
  return (
    <View style={{ marginBottom: theme.spacing.m }}>
      <Text style={styles.label}>Prioritas</Text>
      <View style={styles.container}>
        {options.map((opt) => {
          const isActive = value?.toLowerCase() === opt.toLowerCase();
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.option,
                isActive && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
              ]}
              onPress={() => onChange(opt)}
            >
              <Text style={[
                styles.text, 
                isActive && { color: theme.colors.white, fontWeight: 'bold' }
              ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  text: {
    color: theme.colors.text,
    fontSize: 14,
  }
});