import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import theme from "../constants/theme";

export default function TaskItem({ task, onPress }) {
  
  const getPriorityConfig = (p) => {
    const priority = p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : 'Low';
    // Menggunakan skema warna yang diperbarui: Danger/Warning/Success
    if (priority === 'High') return { color: theme.colors.danger, gradient: theme.gradients.danger, icon: 'alert-circle' };
    if (priority === 'Medium') return { color: theme.colors.warning, gradient: theme.gradients.warm, icon: 'time' };
    return { color: theme.colors.success, gradient: theme.gradients.success, icon: 'leaf' };
  };

  const getStatusConfig = (s) => {
    // Menggunakan skema warna yang diperbarui: Success/Info/TextMuted
    if (s === 'Done' || s === 'Completed') return { color: theme.colors.success, label: 'Selesai', bg: theme.colors.success + '15' };
    if (s === 'In Progress' || s === 'On Progress') return { color: theme.colors.info, label: 'Proses', bg: theme.colors.info + '15' };
    return { color: theme.colors.textMuted, label: 'Pending', bg: theme.colors.textMuted + '15' };
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  // LOGIKA TANGGAL & OVERDUE (dipertahankan)
  const displayDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "Tanpa Batas";

  const checkOverdue = () => {
    if (!task.due_date) return false;
    if (task.status === 'Done' || task.status === 'Completed') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0); 

    return dueDate < today;
  };

  const isOverdue = checkOverdue();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
      <View style={[styles.card, isOverdue && styles.cardOverdue]}>
        {/* Border Gradient Priority */}
        <LinearGradient 
          colors={priorityConfig.gradient} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 0, y: 1 }} 
          style={styles.borderGradient} 
        />
        <View style={styles.content}>
          <View style={styles.header}>
            {/* Category Badge menggunakan warna Primary Ungu */}
            <View style={styles.categoryBadge}>
              <Ionicons name="book" size={12} color={theme.colors.primary} />
              <Text style={styles.categoryText} numberOfLines={1}>
                {task.courses?.name || task.course_name || "Umum"}
              </Text>
            </View>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>{task.title}</Text>

          <View style={styles.footer}>
            <View style={styles.dateRow}>
              <Ionicons 
                name={isOverdue ? "alert-circle" : "calendar-outline"} 
                size={16} 
                color={isOverdue ? theme.colors.danger : theme.colors.textMuted} 
              />
              <Text style={[styles.dateText, isOverdue && { color: theme.colors.danger, fontWeight: 'bold' }]}>
                {isOverdue ? "Terlambat!" : displayDate}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
               <Text style={{ fontSize: 10, color: theme.colors.textMuted, fontWeight:'600'}}>{task.priority || 'Low'}</Text>
               <Ionicons name={priorityConfig.icon} size={18} color={priorityConfig.color} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12, marginHorizontal: 4 },
  card: { 
    backgroundColor: theme.colors.card, 
    borderRadius: theme.radius.l, 
    flexDirection: 'row', 
    overflow: 'hidden', 
    ...theme.shadow.small, 
    borderWidth: 1, 
    borderColor: theme.colors.border + '40',
  },
  cardOverdue: { 
    borderColor: theme.colors.danger + '40'
  },
  borderGradient: { 
    width: 6, 
  },
  content: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, maxWidth: '60%' 
  },
  categoryText: { 
    fontSize: 11, 
    color: theme.colors.primaryDark, 
    fontWeight: '700' 
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
});