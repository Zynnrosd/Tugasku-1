import React, { useState, useCallback } from "react";
import { 
  View, Text, FlatList, StyleSheet, RefreshControl, 
  TouchableOpacity, TextInput, Animated, StatusBar,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

import api from "../services/api";
import theme from "../constants/theme"; 
import TaskItem from "../components/TaskItem"; 

// =================================================================
const FAB_BOTTOM_OFFSET = Platform.select({
  ios: 120,    
  android: 95, 
  default: 95,
});
// =================================================================

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All"); 
  const [refreshing, setRefreshing] = useState(false);
  
  // Animasi FAB dan Filter Chips
  const [fabScale] = useState(new Animated.Value(1));
  const [filterAnimation] = useState(new Animated.Value(0)); 

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const data = res.data?.data || [];
      
      const activeData = data.filter(t => t.status !== 'Done' && t.status !== 'Completed');
      activeData.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      
      setTasks(activeData);
      applyFilter(activeData, priorityFilter, search);
    } catch (error) { 
      console.log("Error loading tasks:", error); 
    } finally { 
      setRefreshing(false); 
    }
  };

  useFocusEffect(useCallback(() => { 
    loadTasks();
    // Animasi muncul filter saat layar fokus (UX Modern)
    Animated.spring(filterAnimation, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []));

  const applyFilter = (data, priority, searchText) => {
    let result = data;
    
    // 1. Filter Priority
    if (priority !== "All") {
      result = result.filter(t => t.priority === priority);
    }
    
    // 2. Filter Search
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(lowerSearch));
    }
    
    setFilteredTasks(result);
  };

  const handleChip = (p) => {
    setPriorityFilter(p);
    applyFilter(tasks, p, search);
  };

  const handleFABPress = () => {
    // Animasi tombol tekan (UX halus)
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
    
    navigation.navigate("AddTask");
  };

  // Komponen Chip Filter Internal (Disesuaikan dengan tema Ungu dan status colors)
  const FilterChip = ({ label, value, gradient, color }) => {
    const isActive = priorityFilter === value;
    
    return (
      <TouchableOpacity 
        onPress={() => handleChip(value)}
        activeOpacity={0.7}
        style={{ marginRight: 10 }}
      >
        {isActive ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.chipActive, { borderColor: color + '50' }]} 
          >
            <Text style={styles.chipTextActive}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* HEADER SECTION - Menggunakan Gradasi Ungu */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={theme.gradients.deepPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        >
          <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
            {/* Title Row */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.headerTitle}>Daftar Tugas</Text>
                <Text style={styles.headerSubtitle}>
                  {filteredTasks.length} tugas aktif tersisa
                </Text>
              </View>
            </View>

            {/* Search Bar - Modern Card Style */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={theme.colors.primary} />
              <TextInput 
                placeholder="Cari tugas kuliah..." 
                value={search} 
                onChangeText={(t) => { 
                  setSearch(t); 
                  applyFilter(tasks, priorityFilter, t); 
                }} 
                style={styles.searchInput}
                placeholderTextColor={theme.colors.textMuted}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => { 
                  setSearch(""); 
                  applyFilter(tasks, priorityFilter, ""); 
                }}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Filter Chips (Animasi + Warna Baru) */}
        <Animated.View style={[styles.filtersWrapper, { transform: [{ scale: filterAnimation }] }]}>
           <FlatList 
             horizontal 
             showsHorizontalScrollIndicator={false}
             data={[
               { label: 'Semua', value: 'All', grad: theme.gradients.deepPurple, color: theme.colors.primary },
               { label: '🔥 Mendesak', value: 'High', grad: theme.gradients.danger, color: theme.colors.danger },
               { label: '⚠️ Menengah', value: 'Medium', grad: theme.gradients.warm, color: theme.colors.warning },
               { label: '🌱 Santai', value: 'Low', grad: theme.gradients.success, color: theme.colors.success },
             ]}
             keyExtractor={item => item.value}
             contentContainerStyle={{ paddingHorizontal: 20 }}
             renderItem={({item}) => (
               <FilterChip label={item.label} value={item.value} gradient={item.grad} color={item.color} />
             )}
           />
        </Animated.View>
      </View>

      {/* TASKS LIST */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            onPress={() => navigation.navigate("TaskDetail", { task: item })} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadTasks(); }}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={60} color={theme.colors.border} />
            <Text style={styles.emptyTitle}>
              {search ? "Tidak ditemukan" : "Semua beres!"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search ? "Coba kata kunci lain" : "Tekan + untuk menambah tugas baru"}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button - Animasi dan Gradient Ungu */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={handleFABPress} activeOpacity={0.9}>
          <LinearGradient
            colors={theme.gradients.deepPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Ionicons name="add" size={32} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  headerContainer: {
    marginBottom: 10,
    ...theme.shadow.medium,
    shadowColor: theme.colors.primaryDark
  },
  headerBackground: {
    paddingBottom: 40, 
    borderBottomLeftRadius: theme.radius.xl, 
    borderBottomRightRadius: theme.radius.xl,
  },
  safeAreaHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titleRow: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card, 
    paddingHorizontal: 16,
    height: 50,
    borderRadius: theme.radius.l,
    ...theme.shadow.small, 
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: theme.colors.text,
  },
  filtersWrapper: {
    marginTop: -24, 
    height: 48,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: theme.colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.small,
  },
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.l,
    borderWidth: 2, 
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute', 
    bottom: 20, 
    right: 30,
    zIndex: 10, 
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.large, 
    shadowColor: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 8,
  }
});