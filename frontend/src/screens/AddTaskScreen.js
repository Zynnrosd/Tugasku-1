import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform, TextInput } from "react-native";
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

export default function AddTaskScreen({ route, navigation }) {
  const taskToEdit = route.params?.task;
  
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [priority, setPriority] = useState(taskToEdit?.priority || "Medium");
  const [status, setStatus] = useState(taskToEdit?.status || "Pending");
  const [deadlineDate, setDeadlineDate] = useState(taskToEdit?.deadline ? new Date(taskToEdit.deadline) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [courseId, setCourseId] = useState(taskToEdit?.course_id || null);
  const [courseName, setCourseName] = useState(taskToEdit?.courses?.name || "Pilih Mata Kuliah");
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setShowDatePicker(false);
    if (selectedDate) setDeadlineDate(selectedDate);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Error", "Judul tugas wajib diisi!");
    setLoading(true);
    const payload = { title, description, priority, status, deadline: deadlineDate.toISOString().split('T')[0], course_id: courseId };
    try {
      if (taskToEdit) await taskService.update(taskToEdit.id, payload);
      else await taskService.create(payload);
      Alert.alert("Sukses", "Data tersimpan!");
      navigation.goBack();
    } catch (error) { Alert.alert("Gagal", "Gagal menyimpan data."); } 
    finally { setLoading(false); }
  };

  // Komponen Input Label Biasa
  const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionTitle}>Informasi Tugas</Text>
        
        <Label text="Judul Tugas" />
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Contoh: Laporan Akhir" placeholderTextColor="#ccc"/>
        
        <Label text="Deskripsi" />
        <TextInput style={[styles.input, {height:100, textAlignVertical:'top'}]} value={description} onChangeText={setDescription} multiline placeholder="Detail tugas..." placeholderTextColor="#ccc"/>

        <Text style={styles.sectionTitle}>Detail & Jadwal</Text>

        <Label text="Mata Kuliah" />
        <TouchableOpacity style={styles.inputSelector} onPress={() => setModalVisible(true)}>
            <Text style={{color: courseId ? theme.colors.text : '#ccc'}}>{courseName}</Text>
            <Ionicons name="chevron-down" size={20} color={theme.colors.subtext} />
        </TouchableOpacity>
        <SelectCourseModal visible={modalVisible} courses={courses} onClose={() => setModalVisible(false)} onSelect={(item) => { setCourseId(item.id); setCourseName(item.name); }} />

        {/* DATE PICKER YANG TERLIHAT SEPERTI INPUT BIASA */}
        <Label text="Deadline" />
        <TouchableOpacity style={styles.inputSelector} onPress={() => setShowDatePicker(true)}>
            <Text style={{color: theme.colors.text}}>
                {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        {showDatePicker && <DateTimePicker value={deadlineDate} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />}

        <SelectPriority value={priority} onChange={setPriority} />
        <SelectStatus value={status} onChange={setStatus} />

        <Button title={loading ? "Menyimpan..." : "Simpan Tugas"} onPress={handleSave} loading={loading} style={{ marginTop: 20, marginBottom: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginTop: 10, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  
  // Style Input yang Seragam
  input: {
      backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border,
      borderRadius: 12, padding: 14, fontSize: 16, color: theme.colors.text,
      marginBottom: 16
  },
  inputSelector: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border,
      borderRadius: 12, padding: 14, marginBottom: 16
  }
});