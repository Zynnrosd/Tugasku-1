import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import api from "../services/api";
import theme from "../constants/theme";
import Input from "../components/Input"; 

export default function CoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.log("Err load courses:", err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "Nama mata kuliah kosong!");
    setLoading(true);
    Keyboard.dismiss();

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, { name });
        setEditingId(null);
      } else {
        await api.post("/courses", { name });
      }
      setName("");
      fetchCourses();
    } catch (error) {
      console.log(error);
      Alert.alert("Gagal", "Pastikan backend jalan dan koneksi aman.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
  };

  const handleDelete = (id) => {
    Alert.alert("Hapus", "Yakin? Tugas terkait juga akan terhapus.", [
      { text: "Batal" },
      { text: "Hapus", style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/courses/${id}`);
            fetchCourses();
          } catch(e) { Alert.alert("Gagal Hapus"); }
      }}
    ]);
  };

  useEffect(() => { fetchCourses(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={theme.text.header}>Mata Kuliah</Text>
        <Text style={theme.text.body}>Kelola daftar matkul kamu di sini</Text>
      </View>

      {/* Form Input */}
      <View style={styles.formCard}>
        <View style={{flex: 1, marginRight: 10}}>
           <Input 
              placeholder="Nama Matkul (Cth: Pemrograman Web)" 
              value={name} 
              onChangeText={setName}
              style={{marginBottom: 0, borderWidth: 0, backgroundColor: theme.colors.secondary}} 
           />
        </View>
        <TouchableOpacity 
          style={[styles.btnIcon, { backgroundColor: editingId ? theme.colors.warning : theme.colors.primary }]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Ionicons name={editingId ? "save" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: theme.spacing.m }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <Ionicons name="book" size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            
            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={{padding: 8}}>
                <Ionicons name="pencil" size={20} color={theme.colors.warning} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{padding: 8}}>
                <Ionicons name="trash" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.l, backgroundColor: theme.colors.white },
  
  formCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    margin: theme.spacing.m,
    borderRadius: theme.radius.l,
    alignItems: 'center',
    ...theme.shadow
  },
  btnIcon: {
    width: 50, height: 50,
    borderRadius: theme.radius.m,
    justifyContent: "center", alignItems: "center",
    ...theme.shadow
  },
  
  card: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    ...theme.shadow
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    backgroundColor: theme.colors.secondary,
    padding: 8,
    borderRadius: theme.radius.s,
    marginRight: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    maxWidth: 180
  }
});