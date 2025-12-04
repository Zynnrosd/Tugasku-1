import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator, StatusBar, Animated 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import api from "../services/api";
import theme from "../constants/theme";

// Componente CourseItem Card yang diperbarui dengan Animasi
const CourseItem = ({ item, onDelete, index }) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        
        Animated.timing(animValue, {
            toValue: 1,
            duration: 300,
            delay: index * 50, 
            useNativeDriver: true,
        }).start();
    }, [animValue]);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0], 
    });
    
    return (
        <Animated.View style={{ 
            opacity: animValue, 
            transform: [{ translateY }],
            marginBottom: 12
        }}>
            <View style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <Text style={styles.itemInitial}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
        </Animated.View>
    );
};


export default function CoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState("");
  const [adding, setAdding] = useState(false);

  const loadCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Memuat ulang data setiap kali layar fokus (efek refresh)
  useFocusEffect(useCallback(() => { 
    loadCourses(); 
  }, []));

  const handleAdd = async () => {
    if (!newCourse.trim()) return;
    setAdding(true);
    try {
      await api.post("/courses", { name: newCourse.trim() });
      setNewCourse("");
      loadCourses();
    } catch (error) {
      Alert.alert("Gagal", "Gagal menambah mata kuliah");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Hapus", "Yakin hapus mata kuliah ini? Tugas terkait mungkin ikut terhapus.", [
      { text: "Batal" },
      { text: "Hapus", style: 'destructive', onPress: async () => {
          try {
            // Optimistic update
            const oldCourses = courses;
            setCourses(courses.filter(c => c.id !== id));
            
            await api.delete(`/courses/${id}`);
          } catch (e) { 
             Alert.alert("Gagal menghapus", "Gagal menghapus mata kuliah dari server.");
             setCourses(oldCourses); // Rollback jika gagal
          }
        } 
      }
    ]);
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
        
        {/* HEADER MODERN */}
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Mata Kuliah</Text>
          <Text style={styles.subtitle}>Kelola daftar pelajaranmu untuk tugas</Text>
        </View>

        {/* FORM INPUT BARU (Modern & Ungu) */}
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Tambah mata kuliah baru..." 
            value={newCourse}
            onChangeText={setNewCourse}
            placeholderTextColor={theme.colors.textMuted}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAdd}
            disabled={adding || !newCourse.trim()}
          >
            {adding ? 
              <ActivityIndicator color={theme.colors.white} size="small" /> : 
              <Ionicons name="add" size={24} color={theme.colors.white} />
            }
          </TouchableOpacity>
        </View>

        {/* LIST DENGAN ANIMASI */}
        <FlatList 
          data={courses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item, index }) => (
            <CourseItem item={item} onDelete={handleDelete} index={index} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={60} color={theme.colors.border} style={{marginBottom: 10}} />
              <Text style={{color: theme.colors.textMuted}}>Belum ada mata kuliah yang didaftarkan.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  safeArea: { flex: 1, backgroundColor: theme.colors.card },
  
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    backgroundColor: theme.colors.card, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textMuted },

  // FORM INPUT BARU
  formContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12
  },
  input: {
    flex: 1,
    height: 50, 
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.l, 
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
    color: theme.colors.text
  },
  addButton: {
    width: 50, 
    height: 50, 
    backgroundColor: theme.colors.primary, 
    borderRadius: theme.radius.l,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small, 
  },

  // ITEM CARD BARU
  itemCard: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: theme.colors.card, 
    padding: 16, 
    borderRadius: theme.radius.l, 
    ...theme.shadow.small, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    
  },
  itemIcon: {
    width: 40, height: 40, borderRadius: 10, 
    backgroundColor: theme.colors.primaryLight, 
    justifyContent: 'center', alignItems: 'center', 
    marginRight: 15
  },
  itemInitial: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: theme.colors.primaryDark 
  },
  itemName: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600', 
    color: theme.colors.text 
  },
  deleteBtn: { padding: 8 },
  empty: { 
    alignItems: 'center', 
    marginTop: 50, 
    paddingVertical: 30,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }
});