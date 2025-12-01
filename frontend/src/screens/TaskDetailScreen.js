import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';
import taskService from '../services/taskService';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [loading, setLoading] = useState(false);

  // 1. ANALISIS FIX: Sembunyikan header bawaan agar tidak double
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert("Hapus Tugas", "Yakin ingin menghapus tugas ini?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Hapus", 
        style: "destructive", 
        onPress: async () => {
          try {
            setLoading(true);
            await taskService.remove(task.id);
            navigation.goBack();
          } catch (e) {
            Alert.alert("Gagal", "Tidak bisa menghapus tugas.");
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  // 2. ANALISIS FIX: Fungsi update status ke 'Done'
  const handleComplete = async () => {
    try {
      setLoading(true);
      // Kirim update ke backend
      await taskService.update(task.id, { 
        ...task, 
        status: 'Done' 
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Gagal", "Gagal mengupdate status.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
      }) 
    : "Tidak ada tenggat waktu";

  const isCompleted = task.status === 'Done' || task.status === 'Completed';

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Tugas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddTask", { task })}>
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.badge}>
            <Ionicons name="book-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.badgeText}>{task.courses?.name || "Umum"}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="flag-outline" size={14} color="#D97706" />
            <Text style={[styles.badgeText, { color: '#D97706' }]}>{task.priority}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: isCompleted ? '#D1FAE5' : '#E5E7EB' }]}>
             <Text style={[styles.badgeText, { color: isCompleted ? '#065F46' : '#374151' }]}>
               {task.status}
             </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tenggat Waktu</Text>
          <View style={styles.dateBox}>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        {task.description ? (
          <View style={styles.section}>
            <Text style={styles.label}>Deskripsi</Text>
            <Text style={styles.descText}>{task.description}</Text>
          </View>
        ) : null}

        {/* 3. ANALISIS FIX: Tombol Action dimunculkan kembali */}
        <View style={styles.actionButtons}>
          
          {/* Tombol Selesai (Hanya muncul jika belum selesai) */}
          {!isCompleted && (
            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text style={styles.btnText}>Tandai Selesai</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.btnText, { color: '#EF4444' }]}>Hapus Tugas</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  editBtn: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  backBtn: { padding: 4 },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  metaContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  badgeText: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  section: { marginBottom: 24 },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '600' },
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  dateText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  descText: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  
  actionButtons: { marginTop: 20, gap: 12 },
  completeBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: theme.colors.primary, padding: 16, borderRadius: 16 },
  deleteBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FCA5A5' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});