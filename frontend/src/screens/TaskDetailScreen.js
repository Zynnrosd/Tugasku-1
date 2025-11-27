import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../constants/theme";
import taskService from "../services/taskService";

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status); // Local state untuk update instan

  const handleStatusToggle = async () => {
     setLoading(true);
     // Tentukan status baru
     const newStatus = currentStatus === 'Done' ? 'Pending' : 'Done';
     
     try {
        // Kirim hanya field status ke backend
        const response = await taskService.update(task.id, { status: newStatus });
        
        // Update state lokal agar UI berubah
        setCurrentStatus(newStatus);
        Alert.alert("Sukses", `Status berhasil diubah menjadi ${newStatus}`);
        
        // Opsional: Kembali ke layar sebelumnya agar list ter-refresh
        navigation.goBack();
     } catch(e) { 
        console.error("Gagal Update Status:", e);
        Alert.alert("Gagal", "Gagal update status. Cek koneksi internet."); 
     } finally {
        setLoading(false);
     }
  };

  const handleDelete = () => {
    Alert.alert("Hapus", "Yakin ingin menghapus tugas ini?", [
      { text: "Batal" },
      { text: "Hapus", style: 'destructive', onPress: async () => {
          try {
            await taskService.remove(task.id);
            navigation.goBack();
          } catch(e) {
            Alert.alert("Gagal", "Gagal menghapus tugas.");
          }
      }}
    ]);
  };

  const getStatusColor = (s) => {
      if (s === 'Done') return theme.colors.success;
      return theme.colors.warning; // Pending/In Progress
  };

  return (
    <ScrollView style={styles.container}>
       <View style={styles.card}>
          <View style={[styles.headerRow, {borderLeftColor: getStatusColor(currentStatus)}]}>
              <Text style={styles.title}>{task.title}</Text>
              <View style={[styles.badge, {backgroundColor: getStatusColor(currentStatus) + '20'}]}>
                  <Text style={{color: getStatusColor(currentStatus), fontWeight:'bold', fontSize:12}}>
                      {currentStatus}
                  </Text>
              </View>
          </View>

          <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                  <Ionicons name="book" size={18} color={theme.colors.primary} />
                  <Text style={styles.infoLabel}>Mata Kuliah</Text>
                  <Text style={styles.infoValue}>{task.courses?.name || "Umum"}</Text>
              </View>
              <View style={styles.infoItem}>
                  <Ionicons name="calendar" size={18} color={theme.colors.danger} />
                  <Text style={styles.infoLabel}>Deadline</Text>
                  <Text style={styles.infoValue}>{task.deadline}</Text>
              </View>
              <View style={styles.infoItem}>
                  <Ionicons name="flag" size={18} color={theme.colors.warning} />
                  <Text style={styles.infoLabel}>Prioritas</Text>
                  <Text style={styles.infoValue}>{task.priority}</Text>
              </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.desc}>{task.description || "Tidak ada deskripsi tambahan."}</Text>
       </View>

       {/* TOMBOL AKSI */}
       <TouchableOpacity 
            style={[styles.btnMain, {backgroundColor: currentStatus==='Done'? theme.colors.warning : theme.colors.success}]} 
            onPress={handleStatusToggle}
            disabled={loading}
       >
           {loading ? <ActivityIndicator color="white"/> : (
               <>
                   <Ionicons name={currentStatus==='Done' ? "refresh" : "checkmark-circle"} size={24} color="white" style={{marginRight:10}} />
                   <Text style={styles.btnText}>{currentStatus==='Done' ? "Tandai Belum Selesai" : "Tandai Selesai"}</Text>
               </>
           )}
       </TouchableOpacity>
       
       <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btnSmall, {backgroundColor: theme.colors.primary}]} onPress={() => navigation.navigate('AddTask', {task})}>
                <Ionicons name="create-outline" size={20} color="white" />
                <Text style={styles.btnTextSmall}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnSmall, {backgroundColor: theme.colors.danger}]} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={styles.btnTextSmall}>Hapus</Text>
            </TouchableOpacity>
       </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.secondary, padding: 20 },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 20, marginBottom: 24, ...theme.shadow },
  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', paddingLeft: 12, borderLeftWidth: 4, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, flex: 1, marginRight: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  
  infoGrid: { flexDirection: 'row', justifyContent:'space-between', marginBottom: 10 },
  infoItem: { width:'30%', backgroundColor: theme.colors.secondary, padding: 10, borderRadius: 12, alignItems:'center' },
  infoLabel: { fontSize: 10, color: theme.colors.subtext, marginTop: 5, marginBottom: 2 },
  infoValue: { fontSize: 12, fontWeight: 'bold', color: theme.colors.text, textAlign:'center' },

  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.subtext, marginBottom: 8, textTransform:'uppercase' },
  desc: { lineHeight: 24, color: theme.colors.text, fontSize: 16 },

  btnMain: { 
      flexDirection: 'row', justifyContent:'center', alignItems:'center',
      padding: 16, borderRadius: 16, marginBottom: 15, ...theme.shadow 
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  actionRow: { flexDirection:'row', gap: 15 },
  btnSmall: { 
      flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center',
      padding: 14, borderRadius: 14, ...theme.shadow 
  },
  btnTextSmall: { color: 'white', fontWeight: 'bold', marginLeft: 5 }
});