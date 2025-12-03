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
  // LOGIKA STATISTIK DASHBOARD (Dipertahankan)
  // =================================================================
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done' || t.status === 'Completed').length;
    const pending = total - completed;
    
    const overdue = tasks.filter(t => {
      if (!t.due_date) return false;
      const isDone = t.status === 'Done' || t.status === 'Completed';
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const dueDate = new Date(t.due_date);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate < now && !isDone;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  // =================================================================
  // GENERATE KALENDER & FILTER DATA (Dipertahankan)
  // =================================================================
  const getFilteredTasks = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    return tasks.filter(task => {
      if (!task.due_date) return false;

      const taskDateStr = task.due_date.split('T')[0];
      
      const isSameDate = taskDateStr === selectedDateStr;
      const isNotFinished = task.status !== 'Done' && task.status !== 'Completed';

      return isSameDate && isNotFinished;
    });
  };

  const filteredTasks = getFilteredTasks();
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

  // =================================================================
  // FETCH DATA API (Dipertahankan)
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

  // Menggunakan warna primary baru untuk avatar fallback
  const avatarUri = profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name||'User')}&background=${theme.colors.primary.substring(1)}&color=fff`;

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

        {/* --- KOTAK ANALISIS (Menggunakan warna tema baru) --- */}
        <View style={styles.statsGrid}>
          <StatBox 
            label="Total Tugas" 
            count={stats.total} 
            icon="albums-outline" 
            color={theme.colors.primaryDark} 
            bg={theme.colors.primaryLight} 
          />
          <StatBox 
            label="Selesai" 
            count={stats.completed} 
            icon="checkmark-circle-outline" 
            color={theme.colors.success} 
            bg={theme.colors.success + '10'} 
          />
          <StatBox 
            label="Pending" 
            count={stats.pending} 
            icon="time-outline" 
            color={theme.colors.warning} 
            bg={theme.colors.warning + '10'} 
          />
          <StatBox 
            label="Terlambat" 
            count={stats.overdue} 
            icon="alert-circle-outline" 
            color={theme.colors.danger} 
            bg={theme.colors.danger + '10'} 
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
              <TaskItem // Menggunakan TaskItem yang sudah di-redesign
                key={item.id}
                task={item} 
                onPress={() => navigation.navigate("TaskDetail", { task: item })} 
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* FAB ADD BUTTON - Menggunakan LinearGradient Ungu */}
      <TouchableOpacity 
        style={styles.fabContainer} 
        onPress={() => navigation.navigate("AddTask")}
      >
         <LinearGradient
            colors={theme.gradients.deepPurple} // Gradient Ungu
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Komponen Kecil untuk Kotak Statistik
const StatBox = ({ label, count, icon, color, bg }) => (
  <View style={[styles.statCard, { backgroundColor: bg, borderColor: color + '30', borderWidth: 1 }]}>
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
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: theme.colors.primaryLight },

  // Styles untuk Statistik Grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 20, gap: 10
  },
  statCard: {
    width: '48%', 
    padding: 16, 
    borderRadius: theme.radius.l,
    justifyContent: 'center',
    ...theme.shadow.small 
  },
  statIconRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6
  },
  statCount: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },

  calendarContainer: { paddingLeft: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 5 },
  
  calItem: {
    backgroundColor: theme.colors.card, 
    padding: 10, borderRadius: theme.radius.m, 
    alignItems: 'center',
    minWidth: 55, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    ...theme.shadow.small
  },
  calItemSelected: {
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary
  },
  calDay: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 },
  calDate: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  calTextSelected: { color: 'white' },

  taskListContainer: { paddingHorizontal: 20, flex: 1 },
  
  emptyState: { alignItems: 'center', marginTop: 30, paddingBottom: 50 },
  emptyText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: theme.colors.textMuted },
  emptySubText: { fontSize: 14, color: theme.colors.textMuted },

  fabContainer: {
    position: 'absolute', 
    bottom: 30, 
    right: 30,
    zIndex: 10, // Ditambahkan: Memastikan FAB di layer teratas
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    ...theme.shadow.large, 
    shadowColor: theme.colors.primary, 
  }
});