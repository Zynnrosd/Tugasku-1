import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, 
  TextInput, KeyboardAvoidingView, Platform, Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker'; 

import api from "../services/api";  
import theme from "../constants/theme";
import Button from "../components/Button";
import SelectPriority from "../components/SelectPriority";
import SelectStatus from "../components/SelectStatus";
import SelectCourseModal from "../components/SelectCourseModal";

// Komponen Input Kustom (Disempurnakan dari FormInput lama)
const FormInput = ({ label, icon, value, onChangeText, placeholder, multiline, keyboardType }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, multiline && styles.textAreaContainer]}>
      <Ionicons name={icon} size={20} color={theme.colors.primaryDark} style={styles.inputIcon} />
      <TextInput 
        style={[styles.input, multiline && styles.textArea]} 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor={theme.colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  </View>
);

// Komponen Card Kustom
const CustomCard = ({ title, children, style }) => (
  <View style={[styles.card, style]}>
     {title && <Text style={styles.cardTitle}>{title}</Text>}
     {children}
  </View>
);

export default function AddTaskScreen({ route, navigation }) {
  const taskToEdit = route.params?.task;
  
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [priority, setPriority] = useState(taskToEdit?.priority || "Medium");
  const [status, setStatus] = useState(taskToEdit?.status || "Pending");
  
  const initialDate = taskToEdit?.due_date ? new Date(taskToEdit.due_date) : new Date();
  const [deadlineDate, setDeadlineDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [courseId, setCourseId] = useState(taskToEdit?.course_id || null);
  const [courseName, setCourseName] = useState(taskToEdit?.courses?.name || "");
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animasi Entrance untuk formulir
  const slideAnim = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    // Memuat data kursus saat komponen dimuat
    const load = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.data || []);
      } catch (e) {}
    };
    load();
    
    // START ANIMATION setelah 50ms
    Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
    }).start();
    
  }, [slideAnim]);

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDeadlineDate(selectedDate);
  };

  const handleSave = async () => {
    // 1. VALIDASI WAJIB DIISI (Judul & Mata Kuliah)
    if (!title.trim()) return Alert.alert("Validasi", "Judul tugas wajib diisi!");
    if (!courseId) return Alert.alert("Validasi", "Mata Kuliah wajib dipilih!");

    setLoading(true);
    
    // 2. Format Tanggal agar aman (payload dipertahankan)
    const payload = { 
      title, 
      description: description.trim(), 
      priority, 
      status, 
      // Menggunakan toISOString() untuk format yang konsisten
      due_date: deadlineDate.toISOString(), 
      course_id: courseId 
    };

    try {
      // PERBAIKAN BUG AXIOS 404: Panggil API langsung dengan path '/tasks'
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      
      Alert.alert("Berhasil", taskToEdit ? "Perubahan tugas berhasil disimpan!" : "Tugas berhasil dibuat!");
      navigation.goBack();
    } catch (error) { 
      
      console.error("[AXIOS ERROR] Save failed:", error.response?.status, error.response?.data || error.message);
      Alert.alert("Gagal", `Terjadi kesalahan saat menyimpan: ${error.message}. Cek log konsol untuk detail.`); 
    } finally { 
      setLoading(false); 
    }
  };

  const formTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  
  const formOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade-in
  });


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        
        {/* HEADER KUSTOM */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>{taskToEdit ? "Edit Tugas" : "Tugas Baru"}</Text>
           <View style={{width: 24}} /> 
        </View>
        
        {/* SCROLLVIEW DENGAN ANIMASI WRAPPER */}
        <Animated.View style={{ flex: 1, opacity: formOpacity, transform: [{ translateY: formTranslateY }] }}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* CARD 1: Detail Utama */}
            <CustomCard title="Detail Utama">
              <FormInput 
                label="JUDUL TUGAS" icon="create-outline" 
                value={title} onChangeText={setTitle} 
                placeholder="Contoh: Laporan Fisika" 
              />
              <FormInput 
                label="DESKRIPSI (OPSIONAL)" icon="document-text-outline" 
                value={description} onChangeText={setDescription} 
                placeholder="Catatan tambahan..." multiline
              />
            </CustomCard>
            
            {/* CARD 2: Pengaturan Tugas */}
            <CustomCard title="Pengaturan Tugas">
              
              {/* Mata Kuliah Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>MATA KULIAH <Text style={{color:'red'}}>*</Text></Text>
                <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)}>
                  <View style={styles.selectorLeft}>
                    <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                      <Ionicons name="book" size={18} color={theme.colors.primaryDark} />
                    </View>
                    <Text style={[styles.selectorText, !courseId && {color: theme.colors.textMuted}]}>
                      {courseName || "Pilih Mata Kuliah"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.divider} />

              {/* Deadline Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DEADLINE</Text>
                <TouchableOpacity style={styles.selectorButton} onPress={() => setShowDatePicker(true)}>
                   <View style={styles.selectorLeft}>
                    <View style={[styles.iconBox, { backgroundColor: theme.colors.warning + '15' }]}>
                      <Ionicons name="calendar" size={18} color={theme.colors.warning} />
                    </View>
                    <Text style={styles.selectorText}>
                      {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </View>
                  <Ionicons name="time-outline" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker 
                    value={deadlineDate} 
                    mode="date" 
                    display="spinner" 
                    onChange={onDateChange} 
                    minimumDate={new Date()}
                    textColor={theme.colors.text}
                  />
                )}
              </View>
            </CustomCard>

            {/* CARD 3: Status & Prioritas */}
            <CustomCard title="Prioritas">
               <SelectPriority value={priority} onChange={setPriority} />
            </CustomCard>
            
            <CustomCard title="Status Pengerjaan" style={styles.lastCard}>
               <SelectStatus value={status} onChange={setStatus} />
            </CustomCard>
            
            {/* Tombol Simpan */}
            <Button 
                title={loading ? "Menyimpan..." : (taskToEdit ? "Simpan Perubahan" : "Buat Tugas Baru")} 
                onPress={handleSave} 
                loading={loading} 
                style={styles.submitBtn} 
            />
            
            <View style={{height: 30}} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      
      {/* Modal untuk Memilih Mata Kuliah */}
      <SelectCourseModal 
        visible={modalVisible} 
        courses={courses} 
        onClose={() => setModalVisible(false)} 
        onSelect={(item) => { 
          setCourseId(item.id); 
          setCourseName(item.name); 
        }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadow.small // Shadow ringan di header
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  backButton: { padding: 4 },
  content: { padding: 20, paddingBottom: 50 },
  
  // Custom Card Style (diambil dari Card.js konsep)
  card: { 
    backgroundColor: theme.colors.card, 
    borderRadius: theme.radius.xl, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.medium
  },
  cardTitle: {
    fontSize: 12, 
    fontWeight: '800', 
    color: theme.colors.primaryDark, 
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  
  // Input Group Styles (diambil dari Input.js konsep)
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: theme.colors.textMuted, 
    marginBottom: 8, 
    textTransform: 'uppercase' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.primaryLight + '55', // Latar belakang input ungu muda transparan
    borderWidth: 1, 
    borderColor: theme.colors.primaryLight, 
    borderRadius: theme.radius.m, 
    paddingHorizontal: 12,
  },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12, height: 100 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: Platform.OS === 'ios' ? 12 : 10, fontSize: 16, color: theme.colors.text },
  textArea: { height: '100%', paddingVertical: 0 },
  
  // Selector Styles (Mata Kuliah & Deadline)
  selectorButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 4 
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { 
    width: 36, height: 36, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    // Background color diatur inline di render
  },
  selectorText: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 16, marginLeft: 48 },
  
  // Tombol Simpan
  submitBtn: { 
    marginTop: 10, 
    marginBottom: 40,
    
    shadowColor: theme.colors.primary, 
    shadowOffset: {width:0, height:4}, 
    shadowOpacity: 0.2, 
    shadowRadius: 8 
  },
  lastCard: {
    marginBottom: 0
  }
});