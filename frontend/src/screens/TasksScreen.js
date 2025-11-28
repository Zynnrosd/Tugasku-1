import React, { useState, useCallback } from "react";
import { 
  View, Text, FlatList, StyleSheet, RefreshControl, 
  TouchableOpacity, TextInput, Animated, StatusBar 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import api from "../services/api";
import theme from "../constants/theme";
import TaskItem from "../components/TaskItem";

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  
  // Animasi
  const [fabScale] = useState(new Animated.Value(1));
  const [filterAnimation] = useState(new Animated.Value(0)); // 0 ke 1

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      // Tangani jika res.data.data undefined
      const data = res.data?.data || [];
      
      // Filter: Hanya tampilkan yang belum selesai di tab utama
      const activeData = data.filter(t => t.status !== 'Done' && t.status !== 'Completed');
      
      // Sort by deadline (terdekat dulu)
      activeData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      
      setTasks(activeData);
      // Terapkan filter yang sedang aktif (search/priority)
      applyFilter(activeData, priorityFilter, search);
    } catch (error) { 
      console.log("Error loading tasks:", error); 
    } finally { 
      setRefreshing(false); 
    }
  };

  useFocusEffect(useCallback(() => { 
    loadTasks();
    // Animasi muncul filter saat layar fokus
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
    // Animasi tombol tekan
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
    
    navigation.navigate("AddTask");
  };

  // Komponen Chip Filter Internal
  const FilterChip = ({ label, value, gradient }) => {
    const isActive = priorityFilter === value;
    
    return (
      <TouchableOpacity 
        onPress={() => handleChip(value)}
        activeOpacity={0.7}
        style={{ marginRight: 8 }}
      >
        {isActive ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chipActive}
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
      
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={theme.gradients.cool}
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
              {/* Profile/Settings Icon could go here */}
            </View>

            {/* Search Bar */}
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

        {/* Filter Chips (Overlapping Header) */}
        <Animated.View style={[styles.filtersWrapper, { transform: [{ scale: filterAnimation }] }]}>
           <FlatList 
             horizontal 
             showsHorizontalScrollIndicator={false}
             data={[
               { label: 'Semua', value: 'All', grad: theme.gradients.primary },
               { label: '🔥 Mendesak', value: 'High', grad: theme.gradients.danger },
               { label: '⚠️ Menengah', value: 'Medium', grad: theme.gradients.warm },
               { label: '🌱 Santai', value: 'Low', grad: theme.gradients.success },
             ]}
             keyExtractor={item => item.value}
             contentContainerStyle={{ paddingHorizontal: 20 }}
             renderItem={({item}) => (
               <FilterChip label={item.label} value={item.value} gradient={item.grad} />
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
            <Ionicons name="documents-outline" size={60} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>
              {search ? "Tidak ditemukan" : "Semua beres!"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search ? "Coba kata kunci lain" : "Tekan + untuk menambah tugas baru"}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={handleFABPress} activeOpacity={0.9}>
          <LinearGradient
            colors={theme.gradients.primary}
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
  },
  headerBackground: {
    paddingBottom: 40, // Space for overlapping chips
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    ...theme.shadow.medium,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: theme.colors.text,
  },
  filtersWrapper: {
    marginTop: -24, // Overlap effect
    height: 44,
  },
  chip: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadow.small,
  },
  chipActive: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    ...theme.shadow.medium,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Space for FAB
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90, // Naik sedikit agar tidak tertutup TabBar
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.large,
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