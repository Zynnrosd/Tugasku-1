import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../constants/theme";
import Card from "./Card";

export default function TaskItem({ task, onPress }) {
  
  // Warna Indikator Kiri (Prioritas)
  const getPriorityColor = (p) => {
    if (p === 'High') return theme.colors.danger;
    if (p === 'Medium') return theme.colors.warning;
    return theme.colors.success;
  };

  // Warna Badge Status (Revisi)
  const getStatusColor = (s) => {
    if (s === 'Done' || s === 'Completed') return theme.colors.success; // Hijau
    if (s === 'On Progress') return theme.colors.warning; // Kuning
    return theme.colors.danger; // Pending -> Merah
  };

  // Format Tanggal agar cantik (DD MMM YYYY)
  const displayDate = task.deadline 
    ? new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) 
    : "-";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.cardContainer}>
        {/* Indikator Prioritas */}
        <View style={[styles.indicator, { backgroundColor: getPriorityColor(task.priority) }]} />
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
          
          <View style={styles.row}>
            <Ionicons name="book-outline" size={14} color={theme.colors.subtext} />
            <Text style={styles.subtitle}> {task.courses?.name || "Umum"}</Text>
            
            <View style={styles.dot} />
            
            <Ionicons name="calendar-outline" size={14} color={theme.colors.subtext} />
            <Text style={styles.subtitle}> {displayDate}</Text>
          </View>
        </View>

        {/* Badge Status */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}> 
           <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status || 'Pending'}
           </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', padding: 0, overflow: 'hidden', alignItems: 'center'
  },
  indicator: { width: 6, height: '100%' },
  content: { flex: 1, padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  subtitle: { fontSize: 12, color: theme.colors.subtext },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ccc', marginHorizontal: 6 },
  
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, marginRight: 12
  },
  statusText: { fontSize: 10, fontWeight: 'bold' }
});