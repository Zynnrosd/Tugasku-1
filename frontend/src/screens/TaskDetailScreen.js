import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import theme from '../constants/theme';
import taskService from '../services/taskService';

// Komponen Card Detail Kustom untuk konsistensi
const DetailCard = ({ children, style }) => (
    <View style={[styles.detailCard, style]}>
        {children}
    </View>
);

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Animasi Entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
     // Start animasi saat komponen terpasang
     Animated.timing(fadeAnim, {
       toValue: 1,
       duration: 350,
       useNativeDriver: true,
     }).start();
  }, [fadeAnim]);


  const handleDelete = () => {
    Alert.alert("Hapus Tugas", "Yakin ingin menghapus tugas ini? Aksi ini tidak dapat dibatalkan.", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Hapus", 
        style: "destructive", 
        onPress: async () => {
          try {
            setLoading(true);
            await taskService.remove(task.id);
            // Kembali ke layar sebelumnya (Home/Tasks)
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

  const handleComplete = async () => {
    try {
      setLoading(true);
       
      // Kirim payload hanya status
      await taskService.update(task.id, { 
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
        day: 'numeric', month: 'long', year: 'numeric' 
      }) 
    : "Tidak ada tenggat waktu";

  const formattedDay = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('id-ID', { weekday: 'long' }) 
    : "";


  const isCompleted = task.status === 'Done' || task.status === 'Completed';

  // Logic untuk Overdue (Menggunakan logika TaskItem)
  const isOverdue = (() => {
    if (!task.due_date || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  })();

  const priorityColor = task.priority === 'High' ? theme.colors.danger : 
                        task.priority === 'Medium' ? theme.colors.warning : theme.colors.success;

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

      {/* Konten Detail dengan Animasi */}
      <Animated.ScrollView 
        contentContainerStyle={styles.content}
        style={{opacity: fadeAnim}} // Menggunakan opacity animasi
      >
        {/* JUDUL */}
        <Text style={styles.title}>{task.title}</Text>
        
        {/* BADGES METADATA */}
        <View style={styles.metaContainer}>
          {/* Badge Mata Kuliah (Ungu) */}
          <View style={[styles.badge, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="book-outline" size={14} color={theme.colors.primaryDark} />
            <Text style={[styles.badgeText, { color: theme.colors.primaryDark }]}>
              {task.courses?.name || "Umum"}
            </Text>
          </View>
          {/* Badge Prioritas */}
          <View style={[styles.badge, { backgroundColor: priorityColor + '15' }]}>
            <Ionicons name="flag-outline" size={14} color={priorityColor} />
            <Text style={[styles.badgeText, { color: priorityColor }]}>{task.priority}</Text>
          </View>
          {/* Badge Status */}
          <View style={[styles.badge, { 
              backgroundColor: isCompleted ? theme.colors.success + '15' : theme.colors.info + '15' 
            }]}>
             <Text style={[styles.badgeText, { 
               color: isCompleted ? theme.colors.success : theme.colors.info 
             }]}>
               {task.status}
             </Text>
          </View>
        </View>

        {/* CARD DEADLINE */}
        <DetailCard style={isOverdue && styles.overdueCard}>
          <Text style={styles.label}>Tenggat Waktu</Text>
          <View style={styles.dateBox}>
            <Ionicons 
              name={isOverdue ? "alert-circle" : "calendar-outline"} 
              size={24} 
              color={isOverdue ? theme.colors.danger : theme.colors.primary} 
            />
            <View>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={[styles.dayText, isOverdue && { color: theme.colors.danger, fontWeight: 'bold' }]}>
                 {isOverdue ? "TERLAMBAT!" : formattedDay}
              </Text>
            </View>
          </View>
        </DetailCard>

        {/* CARD DESKRIPSI */}
        {task.description ? (
          <DetailCard>
            <Text style={styles.label}>Deskripsi</Text>
            <Text style={styles.descText}>{task.description}</Text>
          </DetailCard>
        ) : null}

        {/* ACTION BUTTONS (Dibuat lebih besar dan menonjol) */}
        <View style={styles.actionButtons}>
          
          {/* Tombol Selesai (Hanya muncul jika belum selesai) */}
          {!isCompleted && (
            <TouchableOpacity style={styles.completeBtnContainer} onPress={handleComplete}>
              <LinearGradient
                colors={theme.gradients.success} // Gradient Hijau untuk Selesai
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionBtnContent}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                <Text style={styles.btnText}>Tandai Selesai</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Tombol Hapus */}
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
            <Text style={[styles.btnText, { color: theme.colors.danger }]}>Hapus Tugas</Text>
          </TouchableOpacity>
        </View>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15, 
    backgroundColor: theme.colors.card, 
    borderBottomWidth:1, borderBottomColor:theme.colors.border,
    ...theme.shadow.small
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  editBtn: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  backBtn: { padding: 4 },
  content: { padding: 20 },
  
  title: { fontSize: 26, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
  
  metaContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  badge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    paddingVertical: 6, paddingHorizontal: 12, 
    borderRadius: 20,
  },
  badgeText: { fontWeight: '600', fontSize: 13 },
  
  // Custom Detail Card Style
  detailCard: { 
    backgroundColor: theme.colors.card, 
    padding: 20, 
    borderRadius: theme.radius.xl, 
    marginBottom: 20, 
    ...theme.shadow.medium,
    borderColor: theme.colors.border,
    borderWidth: 1
  },
  overdueCard: {
     borderColor: theme.colors.danger,
     backgroundColor: theme.colors.danger + '10',
  },
  
  section: { marginBottom: 24 },
  label: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 8, fontWeight: '600' },
  
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  dateText: { fontSize: 17, color: theme.colors.text, fontWeight: '600' },
  dayText: { fontSize: 13, color: theme.colors.textMuted },

  descText: { fontSize: 16, color: theme.colors.text, lineHeight: 24 },
  
  actionButtons: { marginTop: 20, gap: 12 },
  
  completeBtnContainer: { 
    borderRadius: theme.radius.l, 
    overflow: 'hidden', 
    ...theme.shadow.large,
    shadowColor: theme.colors.success
  },
  actionBtnContent: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    padding: 16, 
    borderRadius: theme.radius.l, 
  },
  
  deleteBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    backgroundColor: theme.colors.danger + '10', 
    padding: 16, 
    borderRadius: theme.radius.l, 
    borderWidth: 1, 
    borderColor: theme.colors.danger,
    ...theme.shadow.small 
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});