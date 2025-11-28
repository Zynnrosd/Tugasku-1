import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl, 
  StatusBar 
} from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  
  // State Tanggal
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateList, setDateList] = useState([]);
  const [tasksByDate, setTasksByDate] = useState([]);

  // 1. Generate Tanggal
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

  // 2. Load Data dari Backend
  const loadData = async () => {
    try {
      const res = await api.get("/tasks");
      const allTasks = res.data.data || [];
      
      // Hitung Statistik (Client Side)
      const pending = allTasks.filter(t => t.status !== 'Done' && t.status !== 'Completed');
      const todayStr = new Date().toISOString().split('T')[0];
      
      setStats({
        total: allTasks.length,
        pending: pending.length,
        today: pending.filter(t => t.deadline === todayStr).length,
        late: pending.filter(t => t.deadline < todayStr).length
      });

      // Filter Top 3 Prioritas Mendesak
      const top3 = [...pending]
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);
      setUpcoming(top3);

      // Simpan data master & filter default sesuai tanggal terpilih
      setTasks(pending);
      filterByDate(pending, selectedDate);

    } catch (error) {
      console.log("Error loading tasks:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 3. Logika Filter Tanggal
  const filterByDate = (taskList, date) => {
    const filtered = taskList.filter(t => t.deadline === date);
    setTasksByDate(filtered);
  };

  // Handler Tombol Tanggal
  const handleDatePress = (date) => {
    setSelectedDate(date);
    filterByDate(tasks, date);
  };

  // Handler Tombol Tugas (Navigasi ke Detail)
  const handleTaskPress = (item) => {
    navigation.navigate("TaskDetail", { task: item });
  };

  // Refresh saat layar fokus
  useFocusEffect(useCallback(() => { loadData(); }, []));

  // --- Komponen UI Kecil ---
  const StatCard = ({ label, count, color, icon }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View>
        <Text style={styles.statCount}>{count}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={[styles.iconBg, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadData(); }} 
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
            <Text style={theme.text.header}>Halo ! 👋</Text>
            <Text style={theme.text.subtitle}>Siap menyelesaikan tugas hari ini?</Text>
        </View>

        {/* Statistik Grid */}
        <View style={styles.statsContainer}>
            <StatCard label="Sisa Tugas" count={stats.pending} color={theme.colors.primary} icon="layers" />
            <StatCard label="Deadline Hari Ini" count={stats.today} color={theme.colors.warning} icon="calendar" />
            <StatCard label="Terlambat" count={stats.late} color={theme.colors.danger} icon="alert-circle" />
            <StatCard label="Selesai" count={stats.total - stats.pending} color={theme.colors.success} icon="checkbox" />
        </View>

        {/* Date Slider */}
        <View style={styles.sectionHeader}>
          <Text style={theme.text.title}>Jadwal Tugas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Tasks")}> 
             <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateSliderContainer}>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                {dateList.map((item, index) => {
                    const isActive = item.fullDate === selectedDate;
                    return (
                        <TouchableOpacity 
                            key={index} 
                            activeOpacity={0.7}
                            style={[styles.dateItem, isActive && styles.dateItemActive]}
                            onPress={() => handleDatePress(item.fullDate)}
                        >
                            <Text style={[styles.dayName, isActive ? styles.textWhite : styles.textGrey]}>
                              {item.dayName}
                            </Text>
                            <Text style={[styles.dayNumber, isActive ? styles.textWhite : styles.textDark]}>
                              {item.dayNumber}
                            </Text>
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    )
                })}
             </ScrollView>
        </View>

        {/* Task List (By Date) */}
        <View style={styles.taskListContainer}>
          {tasksByDate.length > 0 ? (
              tasksByDate.map(item => (
                  <TaskItem 
                    key={item.id} 
                    task={item} 
                    onPress={() => handleTaskPress(item)} 
                  />
              ))
          ) : (
              <View style={styles.emptyState}>
                  <Ionicons name="leaf-outline" size={40} color={theme.colors.border} />
                  <Text style={styles.emptyText}>Tidak ada deadline tanggal ini.</Text>
              </View>
          )}
        </View>

        {/* Prioritas Mendesak */}
        {upcoming.length > 0 && (
          <>
            <Text style={[theme.text.title, { marginTop: 24, marginBottom: 12 }]}>
              Prioritas Mendesak 🔥
            </Text>
            {upcoming.map(item => (
                <TaskItem 
                  key={'up'+item.id} 
                  task={item} 
                  onPress={() => handleTaskPress(item)} 
                />
            ))}
          </>
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 100 
  },
  headerSection: { 
    marginBottom: 24 
  },
  
  // Statistik
  statsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginBottom: 30 
  },
  statCard: {
      width: '48%', 
      backgroundColor: theme.colors.surface, 
      padding: 16, 
      borderRadius: 16,
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderLeftWidth: 4, 
      // Shadow Styles
      ...theme.shadow
  },
  statCount: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: theme.colors.text 
  },
  statLabel: { 
    fontSize: 12, 
    color: theme.colors.subtext, 
    marginTop: 4, 
    fontWeight: '500' 
  },
  iconBg: { 
    padding: 10, 
    borderRadius: 12 
  },

  // Date Slider Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  seeAllText: {
    color: theme.colors.primary,
    fontWeight: '600'
  },
  dateSliderContainer: { 
    height: 90, 
    marginBottom: 10 
  },
  dateItem: { 
      backgroundColor: theme.colors.surface, 
      width: 60, 
      height: 80, 
      marginRight: 12, 
      borderRadius: 16, 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: theme.colors.border
  },
  dateItemActive: { 
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary,
    transform: [{scale: 1.05}]
  },
  dayName: { fontSize: 12, marginBottom: 4, fontWeight: '600' },
  dayNumber: { fontSize: 20, fontWeight: 'bold' },
  textWhite: { color: 'white' },
  textGrey: { color: theme.colors.subtext },
  textDark: { color: theme.colors.text },
  activeDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: 'white', marginTop: 4
  },
  
  // List & Empty State
  taskListContainer: {
    minHeight: 100
  },
  emptyState: { 
    padding: 30, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: theme.colors.border, 
    borderRadius: 16, 
    borderStyle: 'dashed',
    backgroundColor: theme.colors.surface + '80'
  },
  emptyText: {
    color: theme.colors.subtext,
    marginTop: 8,
    fontStyle: 'italic'
  }
});