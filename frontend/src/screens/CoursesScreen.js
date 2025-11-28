import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import theme from "../constants/theme";

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

  useEffect(() => { loadCourses(); }, []);

  const handleAdd = async () => {
    if (!newCourse.trim()) return;
    setAdding(true);
    try {
      await api.post("/courses", { name: newCourse });
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
            await api.delete(`/courses/${id}`);
            loadCourses();
          } catch (e) { Alert.alert("Gagal menghapus"); }
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Mata Kuliah</Text>
          <Text style={styles.subtitle}>Kelola daftar pelajaranmu</Text>
        </View>

        {/* FORM INPUT - DIPERBAIKI AGAR LURUS */}
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Tambah mata kuliah baru..." 
            value={newCourse}
            onChangeText={setNewCourse}
            placeholderTextColor="#A0AEC0"
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAdd}
            disabled={adding}
          >
            {adding ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="add" size={24} color="white" />}
          </TouchableOpacity>
        </View>

        <FlatList 
          data={courses}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Text style={styles.itemInitial}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{color: '#A0AEC0'}}>Belum ada mata kuliah.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  safeArea: { flex: 1, backgroundColor: 'white' },
  
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2D3748' },
  subtitle: { fontSize: 14, color: '#718096' },

  // FIX INPUT AGAR SEJAJAR
  formContainer: {
    flexDirection: 'row', 
    alignItems: 'center', // KUNCI AGAR SEJAJAR VERTIKAL
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    gap: 12 // Jarak antar input dan tombol
  },
  input: {
    flex: 1,
    height: 50, // Tinggi eksplisit
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#2D3748'
  },
  addButton: {
    width: 50, // Lebar sama dengan tinggi
    height: 50, // Tinggi sama dengan input
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: {width:0,height:2}, shadowRadius: 4, elevation: 2
  },
  itemIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  itemInitial: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },
  itemName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#2D3748' },
  deleteBtn: { padding: 8 },
  empty: { alignItems: 'center', marginTop: 50 }
});