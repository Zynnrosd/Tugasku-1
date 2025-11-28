import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import theme from "../constants/theme";

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;

  // 1. FIX DOUBLE HEADER: Sembunyikan header bawaan Stack Navigator
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Logika Tombol Selesai
  const handleComplete = () => {
    Alert.alert("Konfirmasi", "Tandai tugas ini sebagai selesai?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Ya, Selesai", 
        onPress: async () => {
          try {
            await api.put(`/tasks/${task.id}`, { status: 'Done' }); 
            Alert.alert("Hebat!", "Tugas berhasil diselesaikan.");
            navigation.goBack(); 
          } catch (e) {
            Alert.alert("Error", "Gagal mengupdate status.");
          }
        }
      }
    ]);
  };

  // Logika Hapus
  const handleDelete = () => {
    Alert.alert("Hapus", "Yakin ingin menghapus tugas ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
          try { await api.delete(`/tasks/${task.id}`); navigation.goBack(); } 
          catch (e) { Alert.alert("Gagal menghapus"); }
        }
      }
    ]);
  };

  const getStatusColor = (s) => s === 'Done' ? theme.colors.success : (s === 'Pending' ? theme.colors.danger : theme.colors.warning);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* HEADER CUSTOM (Sekarang satu-satunya header) */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detail Tugas</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddTask", { task })} style={styles.navBtn}>
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.card}>
             <Text style={styles.title}>{task.title}</Text>
             
             <View style={styles.badges}>
               <View style={[styles.badge, {backgroundColor: getStatusColor(task.status) + '20'}]}>
                 <Text style={[styles.badgeText, {color: getStatusColor(task.status)}]}>{task.status}</Text>
               </View>
               <View style={[styles.badge, {backgroundColor: '#EDF2F7'}]}>
                 <Text style={{color: '#4A5568', fontSize: 12, fontWeight:'bold'}}>{task.priority}</Text>
               </View>
             </View>
             
             <View style={styles.divider} />
             
             <View style={styles.row}>
               <Ionicons name="book" size={20} color={theme.colors.primary} />
               <View style={styles.rowText}>
                 <Text style={styles.label}>Mata Kuliah</Text>
                 <Text style={styles.value}>{task.courses?.name || task.course_name || "Umum"}</Text>
               </View>
             </View>

             <View style={styles.row}>
               <Ionicons name="calendar" size={20} color={theme.colors.danger} />
               <View style={styles.rowText}>
                 <Text style={styles.label}>Deadline</Text>
                 <Text style={styles.value}>
                    {new Date(task.deadline).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                 </Text>
               </View>
             </View>

             <View style={styles.divider} />

             <Text style={styles.label}>Deskripsi</Text>
             <Text style={styles.desc}>
               {task.description || "Tidak ada deskripsi tambahan."}
             </Text>
          </View>

        </ScrollView>

        {/* FOOTER DENGAN 2 TOMBOL (SELESAI & HAPUS) */}
        <View style={styles.footer}>
           {/* Tombol Selesai (Hanya muncul jika belum Done) */}
           {task.status !== 'Done' && (
             <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.btnText}>Tandai Selesai</Text>
             </TouchableOpacity>
           )}

           {/* Tombol Hapus */}
           <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#E53E3E" />
              <Text style={[styles.btnText, {color: '#E53E3E'}]}>Hapus</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { paddingBottom: 20, backgroundColor: theme.colors.primary },
  safeHeader: { paddingHorizontal: 16 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  navBtn: { padding: 8 },
  
  contentContainer: { 
    flex: 1, 
    backgroundColor: '#F7FAFC', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    overflow: 'hidden' 
  },
  scrollContent: { padding: 20 },
  
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, ...theme.shadow.medium },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  rowText: { flex: 1 },
  label: { fontSize: 12, color: '#718096', marginBottom: 2 },
  value: { fontSize: 16, color: '#2D3748', fontWeight: '600' },
  desc: { fontSize: 15, color: '#4A5568', lineHeight: 24 },

  footer: { 
    padding: 20, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#EDF2F7',
    gap: 12 
  },
  completeBtn: { 
    backgroundColor: theme.colors.success, 
    padding: 16, borderRadius: 12, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    ...theme.shadow.small
  },
  deleteBtn: { 
    backgroundColor: '#FFF5F5', 
    padding: 16, borderRadius: 12, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#FED7D7'
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});