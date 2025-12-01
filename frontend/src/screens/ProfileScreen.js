import React, { useState, useCallback } from "react";
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, 
  TouchableOpacity, TextInput, Alert 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "@react-navigation/native"; 

import theme from "../constants/theme";
import api from "../services/api";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State terpisah agar kontrol lebih mudah
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState(""); // 1. PASTIKAN BIO ADA
  const [avatar, setAvatar] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profiles");
      const data = res.data.data; // Sesuaikan dengan struktur return backend { data: { ... } }
      
      if (data) {
        setName(data.name || "");
        setStudentId(data.student_id || "");
        setMajor(data.major || ""); // Note: pastikan di DB ada kolom major, kalau ga ada bisa error
        setBio(data.bio || "");     // Ambil bio dari DB
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally { 
      setLoading(false); 
    }
  };

  // 2. AMBIL DATA SETIAP KALI LAYAR DIBUKA
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Validasi", "Nama wajib diisi.");
    
    setSaving(true);
    try {
      // 3. KIRIM PAYLOAD YANG LENGKAP TERMASUK BIO
      const payload = {
        name,
        student_id: studentId,
        bio,
        // major: major // Hapus/comment jika di database tidak ada kolom major
      };

      // Backend kita pakai upsert di endpoint yang sama
      await api.post("/profiles", payload);
      
      setIsEditing(false);
      Alert.alert("Berhasil", "Profil diperbarui.");
      fetchProfile(); // Refresh data
    } catch (error) {
      Alert.alert("Gagal", "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.primary} style={{flex:1}} />;

  const avatarUri = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name||'User')}&background=4A90E2&color=fff&size=200`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.headerNavbar}>
        <View>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <Text style={styles.headerSubtitle}>Kelola informasi pribadimu</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
        >
          <Ionicons name={isEditing ? "close" : "settings-outline"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>
          
          {!isEditing ? (
            <View style={styles.centerInfo}>
              <Text style={styles.displayName}>{name || "User Baru"}</Text>
              <View style={styles.nimBadge}>
                <Text style={styles.displayNim}>{studentId || "-"}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.editingText}>Mode Edit Aktif</Text>
          )}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>DATA DIRI</Text>
          
          <InputField 
            label="Nama Lengkap" value={name} onChange={setName} 
            editable={isEditing} icon="person-outline"
          />
          <InputField 
            label="NIM / Student ID" value={studentId} onChange={setStudentId} 
            editable={isEditing} keyboardType="numeric" icon="card-outline"
          />
          {/* <InputField 
            label="Program Studi" value={major} onChange={setMajor} 
            editable={isEditing} icon="school-outline"
          /> 
          */}
          <InputField 
            label="Bio Singkat" value={bio} onChange={setBio} 
            editable={isEditing} multiline icon="chatbox-ellipses-outline"
          />

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Simpan Perubahan</Text>}
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.footerVersion}>Tugasku App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component
const InputField = ({ label, value, onChange, editable, icon, multiline, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, editable && styles.inputWrapperActive]}>
      <Ionicons name={icon} size={20} color={theme.colors.textMuted} style={{marginRight: 10}} />
      <TextInput 
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        placeholder={editable ? `Masukkan ${label}` : "-"}
        placeholderTextColor="#A0AEC0"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerNavbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: theme.colors.background },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
  headerSubtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 2 },
  iconButton: { padding: 8, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  content: { paddingHorizontal: 24, paddingBottom: 50 },
  avatarSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E2E8F0' },
  centerInfo: { alignItems: 'center' },
  displayName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  nimBadge: { backgroundColor: theme.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  displayNim: { fontSize: 14, color: theme.colors.primary, fontWeight: '700' },
  editingText: { color: theme.colors.warning, fontWeight: 'bold', fontStyle: 'italic' },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 20, ...theme.shadow.small },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: theme.colors.textMuted, marginBottom: 20, letterSpacing: 1 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: theme.colors.text, marginBottom: 6, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FAFC', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#EDF2F7' },
  inputWrapperActive: { borderColor: theme.colors.primary, backgroundColor: 'white' },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },
  saveButton: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 10, shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity:0.2, shadowRadius:8 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footerVersion: { textAlign: 'center', marginTop: 30, color: theme.colors.textMuted, fontSize: 12 }
});