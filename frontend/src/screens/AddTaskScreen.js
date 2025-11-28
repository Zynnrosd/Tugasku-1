import React, { useState, useEffect, useLayoutEffect } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, 
  TextInput, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker'; 

import api from "../services/api";
import taskService from "../services/taskService";
import theme from "../constants/theme";
import Button from "../components/Button";
import SelectPriority from "../components/SelectPriority";
import SelectStatus from "../components/SelectStatus";
import SelectCourseModal from "../components/SelectCourseModal";

// Komponen Input (Di luar fungsi utama agar keyboard aman)
const FormInput = ({ label, icon, value, onChangeText, placeholder, multiline }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, multiline && styles.textAreaContainer]}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} style={styles.inputIcon} />
      <TextInput 
        style={[styles.input, multiline && styles.textArea]} 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor={theme.colors.textMuted || "#A0AEC0"}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  </View>
);

export default function AddTaskScreen({ route, navigation }) {
  const taskToEdit = route.params?.task;
  
  // State
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [priority, setPriority] = useState(taskToEdit?.priority || "Medium");
  const [status, setStatus] = useState(taskToEdit?.status || "Pending");
  
  const initialDate = taskToEdit?.deadline ? new Date(taskToEdit.deadline) : new Date();
  const [deadlineDate, setDeadlineDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [courseId, setCourseId] = useState(taskToEdit?.course_id || null);
  const [courseName, setCourseName] = useState(taskToEdit?.courses?.name || "");
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. SOLUSI DOUBLE HEADER: Sembunyikan header native saat halaman ini dimuat
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.data || []);
      } catch (e) {}
    };
    load();
  }, []);

  const onDateChange = (event, selectedDate) => {
    // Tutup picker jika di Android (iOS butuh logika beda jika inline)
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDeadlineDate(selectedDate);
    }
  };

  // Toggle khusus untuk iOS agar tombol bisa menutup/buka picker
  const toggleDatePicker = () => {
      setShowDatePicker(!showDatePicker);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Validasi", "Judul tugas wajib diisi!");
    setLoading(true);
    const payload = { 
      title, description, priority, status, 
      deadline: deadlineDate.toISOString().split('T')[0], 
      course_id: courseId 
    };

    try {
      if (taskToEdit) await taskService.update(taskToEdit.id, payload);
      else await taskService.create(payload);
      Alert.alert("Berhasil", "Tugas berhasil disimpan!");
      navigation.goBack();
    } catch (error) { 
      Alert.alert("Gagal", "Terjadi kesalahan."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        
        {/* Header Custom (Satu-satunya yang akan tampil) */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>{taskToEdit ? "Edit Tugas" : "Tugas Baru"}</Text>
           <View style={{width: 24}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Input Judul & Deskripsi */}
          <View style={styles.card}>
            <FormInput 
              label="JUDUL TUGAS" 
              icon="create-outline" 
              value={title} 
              onChangeText={setTitle} 
              placeholder="Contoh: Laporan Fisika" 
            />
            <FormInput 
              label="DESKRIPSI (OPSIONAL)" 
              icon="document-text-outline" 
              value={description} 
              onChangeText={setDescription} 
              placeholder="Catatan tambahan..." 
              multiline
            />
          </View>

          <Text style={styles.sectionHeader}>PENGATURAN TUGAS</Text>
          <View style={styles.card}>
            
            {/* Mata Kuliah */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MATA KULIAH</Text>
              <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)}>
                <View style={styles.selectorLeft}>
                  <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Ionicons name="book" size={18} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.selectorText, !courseId && {color: theme.colors.textMuted}]}>
                    {courseName || "Pilih Mata Kuliah"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />

            {/* Deadline Picker - Scroll Style */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DEADLINE</Text>
              <TouchableOpacity style={styles.selectorButton} onPress={Platform.OS === 'ios' ? toggleDatePicker : () => setShowDatePicker(true)}>
                 <View style={styles.selectorLeft}>
                  <View style={[styles.iconBox, { backgroundColor: theme.colors.danger + '20' }]}>
                    <Ionicons name="calendar" size={18} color={theme.colors.danger} />
                  </View>
                  <Text style={styles.selectorText}>
                    {deadlineDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
                <Ionicons name="time-outline" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
              
              {/* 2. SOLUSI DATE PICKER SCROLL (display="spinner") */}
              {showDatePicker && (
                <DateTimePicker 
                  value={deadlineDate} 
                  mode="date" 
                  display="spinner" // <--- Ini membuat tampilan scroll
                  onChange={onDateChange} 
                  minimumDate={new Date()}
                  textColor="black" // Penting untuk iOS dark mode
                />
              )}
            </View>
          </View>

          <SelectCourseModal visible={modalVisible} courses={courses} onClose={() => setModalVisible(false)} onSelect={(item) => { setCourseId(item.id); setCourseName(item.name); }} />

          <Text style={styles.sectionHeader}>STATUS PENGERJAAN</Text>
          <View style={{ marginBottom: 16 }}>
             <SelectPriority value={priority} onChange={setPriority} />
          </View>
          <View style={{ marginBottom: 30 }}>
             <SelectStatus value={status} onChange={setStatus} />
          </View>

          <Button title={loading ? "Menyimpan..." : "Simpan Tugas"} onPress={handleSave} loading={loading} style={styles.submitBtn} />
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FC" },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: 20, backgroundColor: '#F8F9FC', 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  backButton: { padding: 4 },
  content: { padding: 24, paddingBottom: 50 },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 8
  },
  sectionHeader: {
    fontSize: 12, fontWeight: 'bold', color: theme.colors.textMuted,
    marginTop: 24, marginBottom: 12, marginLeft: 4, letterSpacing: 1
  },
  inputGroup: { marginBottom: 16 },
  label: { 
    fontSize: 11, fontWeight: '700', color: theme.colors.textMuted, 
    marginBottom: 8, textTransform: 'uppercase' 
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA',
    borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, paddingHorizontal: 12,
  },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: theme.colors.text },
  textArea: { height: 80, paddingVertical: 0 },
  selectorButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  selectorText: { fontSize: 16, color: theme.colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F3F5', marginVertical: 16, marginLeft: 48 },
  submitBtn: { marginTop: 10, shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.2, shadowRadius: 8 }
});