import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import theme from "../constants/theme";
import TaskItem from "../components/TaskItem";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, today: 0, late: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Date Slider State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateList, setDateList] = useState([]);
  const [tasksByDate, setTasksByDate] = useState([]);

  // Generate Tanggal
  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        dayNumber: d.getDate(),
      });
    }
    setDateList(dates);
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/tasks");
      const allTasks = res.data.data || [];
      
      // 1. Statistik
      const pending = allTasks.filter(t => t.status !== 'Done' && t.status !== 'Completed');
      const todayStr = new Date().toISOString().split('T')[0];
      
      setStats({
        total: allTasks.length,
        pending: pending.length,
        today: pending.filter(t => t.deadline === todayStr).length,
        late: pending.filter(t => t.deadline < todayStr).length
      });

      // 2. Top 3 Terdekat
      const top3 = [...pending]
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);
      setUpcoming(top3);

      // 3. Filter by Date (Slider)
      filterByDate(pending, selectedDate);
      setTasks(pending); // Simpan master data pending

    } catch (error) {
      console.log("Err Home:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterByDate = (taskList, date) => {
    const filtered = taskList.filter(t => t.deadline === date);
    setTasksByDate(filtered);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);
    filterByDate(tasks, date);
  };

  useFocusEffect(useCallback(() => { loadData(); }, [selectedDate]));

  // Komponen Card Statistik
  const StatCard = ({ label, count, color, icon, fullWidth }) => (
    <View style={[styles.statCard, { borderLeftColor: color }, fullWidth && { width: '100%' }]}>
      <View>
        <Text style={styles.statCount}>{count}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
      >
        {/* Header */}
        <View style={styles.header}>
            <Text style={theme.text.header}>Dashboard Tugasku</Text>
            <Text style={theme.text.subtitle}>Ringkasan performa belajarmu.</Text>
        </View>

        {/* Statistik Grid */}
        <View style={styles.statsGrid}>
            <StatCard label="Sisa Tugas" count={stats.pending} color={theme.colors.primary} icon="layers" />
            <StatCard label="Deadline Hari Ini" count={stats.today} color={theme.colors.warning} icon="calendar" />
            <StatCard label="Terlambat" count={stats.late} color={theme.colors.danger} icon="alert-circle" />
            <StatCard label="Total Semua" count={stats.total} color={theme.colors.success} icon="stats-chart" />
        </View>

        {/* Section: Date Slider */}
        <Text style={[theme.text.title, { marginBottom: 12, marginLeft: 4 }]}>Jadwal Tugas</Text>
        <View style={{ height: 85, marginBottom: 20 }}>
             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dateList.map((item, index) => {
                    const isActive = item.fullDate === selectedDate;
                    return (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.dateItem, isActive && styles.dateItemActive]}
                            onPress={() => handleDatePress(item.fullDate)}
                        >
                            <Text style={[styles.dayName, isActive && {color:'white'}]}>{item.dayName}</Text>
                            <Text style={[styles.dayNumber, isActive && {color:'white'}]}>{item.dayNumber}</Text>
                        </TouchableOpacity>
                    )
                })}
             </ScrollView>
        </View>

        {/* List Berdasarkan Tanggal */}
        {tasksByDate.length > 0 ? (
            tasksByDate.map(item => (
                <TaskItem key={item.id} task={item} onPress={() => navigation.navigate("TaskDetail", { task: item })} />
            ))
        ) : (
            <View style={styles.emptyBox}>
                <Text style={{color: theme.colors.subtext}}>Tidak ada tugas pada tanggal ini.</Text>
            </View>
        )}

        {/* Section: 3 Tugas Terdekat (Prioritas) */}
        <Text style={[theme.text.title, { marginTop: 24, marginBottom: 12, marginLeft: 4 }]}>Prioritas Mendesak 🔥</Text>
        {upcoming.map(item => (
            <TaskItem key={'up'+item.id} task={item} onPress={() => navigation.navigate("TaskDetail", { task: item })} />
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 24 },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: {
      width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 16,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      borderLeftWidth: 4, ...theme.shadow
  },
  statCount: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
  statLabel: { fontSize: 12, color: theme.colors.subtext, marginTop: 2 },
  iconBg: { padding: 8, borderRadius: 12 },

  dateItem: { 
      backgroundColor: 'white', width: 56, height: 76, marginRight: 10, borderRadius: 14, 
      justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border
  },
  dateItemActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  dayName: { fontSize: 11, color: theme.colors.subtext, marginBottom: 4, fontWeight: '600' },
  dayNumber: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  
  emptyBox: { padding: 20, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, borderStyle: 'dashed' }
});