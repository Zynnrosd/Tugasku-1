import React, { useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Image, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

import api from "../services/api";
import theme from "../constants/theme";
import TaskItem from "../components/TaskItem";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State untuk tanggal yang dipilih di kalender
  const [selectedDate, setSelectedDate] = useState(new Date());

  // =================================================================
  // 1. LOGIKA STATISTIK DASHBOARD (DIPERBAIKI)
  // =================================================================
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done' || t.status === 'Completed').length;
    const pending = total - completed;
    
    // PERBAIKAN DISINI: Samakan logika tanggal overdue dengan TaskItem
    const overdue = tasks.filter(t => {
      // 1. Cek validasi dasar
      if (!t.due_date) return false;
      const isDone = t.status === 'Done' || t.status === 'Completed';
      
      // 2. Normalisasi tanggal (Set jam ke 00:00:00 untuk perbandingan adil)
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const dueDate = new Date(t.due_date);
      dueDate.setHours(0, 0, 0, 0);

      // 3. Hanya dianggap overdue jika Tanggal Deadline < Hari Ini (Kemarin dst)
      //    DAN statusnya belum selesai
      return dueDate < now && !isDone;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  // =================================================================
  // 2. GENERATE KALENDER & FILTER DATA
  // =================================================================
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  // Filter tugas berdasarkan tanggal yang dipilih di kalender
  const getFilteredTasks = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDateStr = task.due_date.split('T')[0];
      return taskDateStr === selectedDateStr;
    });
  };

  const filteredTasks = getFilteredTasks();

  // =================================================================
  // 3. FETCH DATA API
  // =================================================================
  const fetchData = async () => {
    try {
      const tasksRes = await api.get("/tasks");
      setTasks(tasksRes.data.data || []);

      const profileRes = await api.get("/profiles");
      if (profileRes.data.data) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const avatarUri = profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name||'User')}&background=4A90E2&color=fff`;

  // Render item Kalender
  const renderCalendarItem = ({ item }) => {
    const isSelected = item.toDateString() === selectedDate.toDateString();
    return (
      <TouchableOpacity 
        style={[styles.calItem, isSelected && styles.calItemSelected]} 
        onPress={() => setSelectedDate(item)}
      >
        <Text style={[styles.calDay, isSelected && styles.calTextSelected]}>
          {item.toLocaleDateString('id-ID', { weekday: 'short' })}
        </Text>
        <Text style={[styles.calDate, isSelected && styles.calTextSelected]}>
          {item.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* ScrollView Utama agar Dashboard ikut terscroll jika layar kecil */}
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, {profile?.name || "Mahasiswa"}</Text>
            <Text style={styles.subGreeting}>Semangat kuliahnya hari ini! 🚀</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
             <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* --- KEMBALINYA 4 KOTAK ANALISIS --- */}
        <View style={styles.statsGrid}>
          <StatBox 
            label="Total Tugas" 
            count={stats.total} 
            icon="albums-outline" 
            color="#4F46E5" 
            bg="#EEF2FF" 
          />
          <StatBox 
            label="Selesai" 
            count={stats.completed} 
            icon="checkmark-circle-outline" 
            color="#10B981" 
            bg="#ECFDF5" 
          />
          <StatBox 
            label="Pending" 
            count={stats.pending} 
            icon="time-outline" 
            color="#F59E0B" 
            bg="#FFFBEB" 
          />
          <StatBox 
            label="Terlambat" 
            count={stats.overdue} 
            icon="alert-circle-outline" 
            color="#EF4444" 
            bg="#FEF2F2" 
          />
        </View>

        {/* KALENDER HORIZONTAL */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Jadwal Minggu Ini</Text>
          <FlatList
            data={calendarDays}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={renderCalendarItem}
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
          />
        </View>

        {/* LIST TUGAS HARIAN */}
        <View style={styles.taskListContainer}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
             <Text style={styles.sectionTitle}>
               Tugas Tanggal {selectedDate.getDate()}
             </Text>
             <Text style={{fontSize:12, color:theme.colors.textMuted}}>
               {filteredTasks.length} Tugas
             </Text>
          </View>

          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="beer-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyText}>Tidak ada deadline hari ini.</Text>
              <Text style={styles.emptySubText}>Santai sejenak!</Text>
            </View>
          ) : (
            filteredTasks.map(item => (
              <TaskItem 
                key={item.id}
                task={item} 
                onPress={() => navigation.navigate("TaskDetail", { task: item })} 
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* FAB ADD BUTTON */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate("AddTask")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Komponen Kecil untuk Kotak Statistik
const StatBox = ({ label, count, icon, color, bg }) => (
  <View style={[styles.statCard, { backgroundColor: bg }]}>
    <View style={styles.statIconRow}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statCount, { color: color }]}>{count}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  subGreeting: { fontSize: 14, color: theme.colors.textMuted },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor:'#eee' },

  // Styles untuk Statistik Grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 20, gap: 10
  },
  statCard: {
    width: '48%', // Agar jadi 2 kolom
    padding: 12, borderRadius: 16,
    justifyContent: 'center'
  },
  statIconRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6
  },
  statCount: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  calendarContainer: { paddingLeft: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 5 },
  
  calItem: {
    backgroundColor: 'white', padding: 10, borderRadius: 12, alignItems: 'center',
    minWidth: 50, borderWidth: 1, borderColor: '#EDF2F7'
  },
  calItemSelected: {
    backgroundColor: theme.colors.primary, borderColor: theme.colors.primary
  },
  calDay: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 },
  calDate: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  calTextSelected: { color: 'white' },

  taskListContainer: { paddingHorizontal: 20, flex: 1 },
  
  emptyState: { alignItems: 'center', marginTop: 30, paddingBottom: 50 },
  emptyText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: theme.colors.textMuted },
  emptySubText: { fontSize: 14, color: theme.colors.textMuted },

  fab: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: theme.colors.primary,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  }
});