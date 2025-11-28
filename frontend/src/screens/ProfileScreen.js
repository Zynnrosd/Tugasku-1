import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, 
  TouchableOpacity, TextInput, Alert, Platform 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import theme from "../constants/theme";
import api from "../services/api";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ 
    name: "", 
    student_id: "", 
    major: "", 
    bio: "",
    avatar: "" 
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profiles");
      if (res.data?.data?.[0]) {
        const data = res.data.data[0];
        setProfile(data);
        setForm(data);
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally { 
      setLoading(false); 
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Izin', 'Butuh akses galeri.');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert("Validasi", "Nama wajib diisi.");
    
    setSaving(true);
    try {
      if (profile?.id) {
        await api.put("/profiles", { ...form, id: profile.id });
      } else {
        await api.post("/profiles", form);
      }
      setProfile(form);
      setIsEditing(false);
      Alert.alert("Berhasil", "Profil diperbarui.");
    } catch (error) {
      Alert.alert("Gagal", "Cek koneksi internet.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.primary} style={{flex:1}} />;

  const display = profile || { name: "Pengguna Baru", student_id: "-", major: "-", bio: "-" };
  const avatarUri = form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name||'User')}&background=4A90E2&color=fff&size=200`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* HEADER BERSIH (Tanpa Kotak Ungu) */}
      <View style={styles.headerNavbar}>
        <View>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <Text style={styles.headerSubtitle}>Kelola informasi pribadimu</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
        >
          <Ionicons 
            name={isEditing ? "close" : "settings-outline"} 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            {isEditing && (
              <TouchableOpacity style={styles.cameraBadge} onPress={pickImage}>
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          {!isEditing ? (
            <View style={styles.centerInfo}>
              <Text style={styles.displayName}>{display.name}</Text>
              <View style={styles.nimBadge}>
                <Text style={styles.displayNim}>{display.student_id}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.editingText}>Mode Edit Aktif</Text>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>DATA DIRI</Text>
          
          <InputField 
            label="Nama Lengkap" 
            value={form.name} 
            onChange={t => setForm({...form, name: t})} 
            editable={isEditing} 
            icon="person-outline"
          />
          <InputField 
            label="NIM" 
            value={form.student_id} 
            onChange={t => setForm({...form, student_id: t})} 
            editable={isEditing} 
            keyboardType="numeric"
            icon="card-outline"
          />
          <InputField 
            label="Program Studi" 
            value={form.major} 
            onChange={t => setForm({...form, major: t})} 
            editable={isEditing} 
            icon="school-outline"
          />
          <InputField 
            label="Bio Singkat" 
            value={form.bio} 
            onChange={t => setForm({...form, bio: t})} 
            editable={isEditing} 
            multiline
            icon="chatbox-ellipses-outline"
          />

          {isEditing && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave} 
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
              )}
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
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  
  // Header Styles
  headerNavbar: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 24, 
    paddingVertical: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
  headerSubtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 2 },
  iconButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border
  },

  content: { paddingHorizontal: 24, paddingBottom: 50 },
  
  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#E2E8F0' // Placeholder color
  },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: theme.colors.primary,
    padding: 8, borderRadius: 20, borderWidth: 3, borderColor: theme.colors.background,
  },
  centerInfo: { alignItems: 'center' },
  displayName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  nimBadge: {
    backgroundColor: theme.colors.primary + '15', // Transparan
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8
  },
  displayNim: { fontSize: 14, color: theme.colors.primary, fontWeight: '700' },
  editingText: { color: theme.colors.warning, fontWeight: 'bold', fontStyle: 'italic' },

  // Form Styles
  formContainer: {
    backgroundColor: 'white', borderRadius: 20, padding: 20,
    ...theme.shadow.small, // Menggunakan shadow halus dari theme
  },
  sectionLabel: {
    fontSize: 12, fontWeight: 'bold', color: theme.colors.textMuted,
    marginBottom: 20, letterSpacing: 1
  },
  
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: theme.colors.text, marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FAFC',
    borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#EDF2F7'
  },
  inputWrapperActive: { borderColor: theme.colors.primary, backgroundColor: 'white' },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },

  saveButton: {
    backgroundColor: theme.colors.primary, padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 10, 
    shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity:0.2, shadowRadius:8
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  footerVersion: { textAlign: 'center', marginTop: 30, color: theme.colors.textMuted, fontSize: 12 }
});