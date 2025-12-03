import React, { useState, useCallback, useRef, useEffect } from "react";
import { 
  View, Text, FlatList, StyleSheet, RefreshControl, 
  TouchableOpacity, ActivityIndicator, StatusBar, Animated, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import api from "../services/api";
import theme from "../constants/theme";
import TaskItem from "../components/TaskItem"; 
import taskService from "../services/taskService"; 

export default function HistoryScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadCompletedTasks = async () => {
    fadeAnim.setValue(0);
    setRefreshing(true);
    
    try {
      const res = await api.get("/tasks");
      const allTasks = res.data?.data || [];
      
      const completedTasks = allTasks
        .filter(t => t.status === 'Done' || t.status === 'Completed')
        .sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
      
      setTasks(completedTasks);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

    } catch (error) { 
      console.log("Error loading history:", error); 
    } finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { 
    loadCompletedTasks();
  }, []));

  const onRefresh = () => {
    loadCompletedTasks();
  };
  
  // LOGIKA HAPUS RIWAYAT (Menggunakan removeMultiple yang baru)
  const handleClearHistory = () => {
    if (tasks.length === 0) return;
    
    Alert.alert(
      "Hapus Riwayat Tugas", 
      `Anda yakin ingin menghapus ${tasks.length} tugas yang sudah selesai ini?`, 
      [
        { text: "Batal", style: 'cancel' },
        { 
          text: "Hapus Semua", 
          style: 'destructive', 
          onPress: async () => {
            setDeleting(true);
            try {
              const completedIds = tasks.map(t => t.id);
              await taskService.removeMultiple(completedIds); 
              
              Alert.alert("Berhasil", "Riwayat tugas berhasil dibersihkan!");
              setTasks([]); // Update UI segera
            } catch (e) {
              // Menangkap error dari removeMultiple jika ada yang gagal
              Alert.alert("Gagal", e.message || "Gagal membersihkan riwayat. Pastikan API berjalan.");
            } finally {
              setDeleting(false);
            }
          } 
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        {/* HEADER DENGAN TOMBOL HAPUS RIWAYAT (Dipindahkan ke kanan) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Riwayat Tugas</Text>
            <Text style={styles.subtitle}>{tasks.length} tugas yang telah selesai</Text>
          </View>
          
          {/* Tombol Hapus Riwayat sebagai Icon Button */}
          {tasks.length > 0 && (
             <TouchableOpacity 
                onPress={handleClearHistory} 
                style={styles.clearButton}
                disabled={deleting}
             >
                {deleting ? (
                   <ActivityIndicator color={theme.colors.danger} size="small" />
                ) : (
                   <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                )}
             </TouchableOpacity>
          )}
        </View>

        {/* LIST DENGAN ANIMASI FADE-IN */}
        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                // Menggunakan TaskItem untuk konsistensi visual
                <TaskItem 
                  task={item} 
                  onPress={() => navigation.navigate("TaskDetail", { task: item })} 
                />
              )}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={[theme.colors.primary]}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="archive-outline" size={60} color={theme.colors.border} />
                  <Text style={styles.emptyTitle}>Kotak arsip masih kosong.</Text>
                  <Text style={styles.emptySubtitle}>Selesaikan tugas pertamamu!</Text>
                </View>
              }
            />
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  safeArea: { flex: 1, backgroundColor: theme.colors.card },
  
  // HEADER BAR DENGAN TOMBOL AKSI DI KANAN
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    backgroundColor: theme.colors.card, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border,
    ...theme.shadow.small 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textMuted },
  
  // Gaya Tombol Hapus Riwayat (Icon Button)
  clearButton: {
    padding: 8,
    borderRadius: theme.radius.m,
    backgroundColor: theme.colors.background, // Background ringan
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, // Lebar fixed untuk icon button
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.medium
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 8,
  }
});