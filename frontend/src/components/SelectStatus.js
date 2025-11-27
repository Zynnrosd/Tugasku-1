import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../constants/theme";

const options = ["Pending", "On Progress", "Done"];

export default function SelectStatus({ value, onChange }) {
  return (
    <View style={{ marginBottom: theme.spacing.m }}>
      <Text style={styles.label}>Status Tugas</Text>
      <View style={styles.container}>
        {options.map((opt) => {
          const isActive = value === opt;
          
          // Logika Warna Sesuai Request
          let activeColor = theme.colors.primary;
          if (opt === "Done") activeColor = theme.colors.success;        // Hijau
          else if (opt === "Pending") activeColor = theme.colors.danger; // Merah
          else if (opt === "On Progress") activeColor = theme.colors.warning; // Kuning

          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.option,
                isActive && { backgroundColor: activeColor, borderColor: activeColor }
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
  label: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: theme.radius.l, backgroundColor: theme.colors.white,
  },
  text: { color: theme.colors.text, fontSize: 12 }
});