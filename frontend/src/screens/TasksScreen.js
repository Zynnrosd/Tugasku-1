import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import theme from "../constants/theme";
import TaskItem from "../components/TaskItem";

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const data = res.data.data || [];
      // Tampilkan SEMUA yang belum selesai
      const activeData = data.filter(t => t.status !== 'Done' && t.status !== 'Completed');
      // Sort Deadline Ascending
      activeData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      
      setTasks(activeData);
      applyFilter(activeData, priorityFilter, search);
    } catch (error) { console.log(error); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const applyFilter = (data, priority, searchText) => {
    let result = data;
    if (priority !== "All") result = result.filter(t => t.priority === priority);
    if (searchText) result = result.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredTasks(result);
  };

  const handleChip = (p) => {
    setPriorityFilter(p);
    applyFilter(tasks, p, search);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={theme.text.header}>Semua Tugas</Text>
        
        {/* Search */}
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.subtext} />
            <TextInput 
                placeholder="Cari tugas..." 
                value={search} onChangeText={(t) => { setSearch(t); applyFilter(tasks, priorityFilter, t); }} 
                style={styles.searchInput}
            />
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
            {['All', 'High', 'Medium', 'Low'].map(p => (
                <TouchableOpacity 
                    key={p} 
                    style={[styles.chip, priorityFilter === p && styles.chipActive]}
                    onPress={() => handleChip(p)}
                >
                    <Text style={[styles.chipText, priorityFilter === p && {color:'white'}]}>{p}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onPress={() => navigation.navigate("TaskDetail", { task: item })} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTasks(); }} />}
          ListEmptyComponent={
             <View style={styles.empty}>
                 <Text style={{color: theme.colors.subtext}}>Tugas tidak ditemukan.</Text>
             </View>
          }
        />
      )}

      {/* FAB (Hanya ada di halaman Tasks & Matkul) */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddTask")}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.background, paddingBottom: 10 },
  searchBar: { 
      flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', 
      paddingHorizontal: 15, height: 48, borderRadius: 12, marginTop: 15, ...theme.shadow 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 15 },
  chip: { 
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
      backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border 
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { fontSize: 12, fontWeight: 'bold', color: theme.colors.subtext },
  
  list: { padding: 20, paddingBottom: 100 },
  empty: { alignItems:'center', marginTop: 50 },
  fab: {
    position: "absolute", bottom: 30, right: 20,
    backgroundColor: theme.colors.primary, width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center", ...theme.shadow, elevation: 6
  },
});