import React, { useState, useCallback, useRef, useEffect } from "react";
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, 
  TouchableOpacity, TextInput, Alert, Animated
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'; 

import { useFocusEffect } from "@react-navigation/native"; 

import theme from "../constants/theme";
import api from "../services/api";

const ImagePicker = {
    launchImageLibraryAsync: async () => ({ canceled: false, assets: [{ uri: 'simulated_local_uri_123' }] }),
    MediaTypeOptions: { Images: 'Images' },
};

import profileService from "../services/profileService";
// Helper Component
const InputField = ({ label, value, onChange, editable, icon, multiline, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[
      styles.inputWrapper, 
      editable && styles.inputWrapperActive,
      multiline && styles.textAreaWrapper 
    ]}>
      <Ionicons name={icon} size={20} color={editable ? theme.colors.primary : theme.colors.textMuted} style={{marginRight: 10}} />
      <TextInput 
        style={[styles.input, !editable && styles.inputDisabled, multiline && styles.textArea]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        placeholder={editable ? `Masukkan ${label}` : "-"}
        placeholderTextColor={theme.colors.textMuted}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  </View>
);


export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState(""); 
  const [avatar, setAvatar] = useState("");
  

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; 

  const fetchProfile = async () => {

    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    try {
      const res = await api.get("/profiles");
      const data = res.data.data;
      
      if (data) {
        setName(data.name || "");
        setStudentId(data.student_id || "");
        setMajor(data.major || ""); 
        setBio(data.bio || "");
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally { 
      setLoading(false); 
      
      Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Validasi", "Nama wajib diisi.");
    
    setSaving(true);
    try {
      const payload = {
        name,
        student_id: studentId,
        bio,
      };

      await api.post("/profiles", payload);
      
      setIsEditing(false);
      Alert.alert("Berhasil", "Profil diperbarui.");
      fetchProfile();
    } catch (error) {
      Alert.alert("Gagal", "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.primary} style={{flex:1, backgroundColor: theme.colors.background}} />;

  const avatarUri = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name||'User')}&background=${theme.colors.primary.substring(1)}&color=fff&size=200`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* HEADER NAVBAR */}
      <View style={styles.headerNavbar}>
        <View>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <Text style={styles.headerSubtitle}>Kelola informasi pribadimu</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons name={isEditing ? "close" : "settings-outline"} size={24} color={isEditing ? theme.colors.danger : theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Konten Utama dengan Animasi */}
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} 
      >
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>
          
          <View style={styles.centerInfo}>
              <Text style={styles.displayName}>{name || "User Baru"}</Text>
              <View style={styles.nimBadge}>
                <Text style={styles.displayNim}>{studentId || "NIM tidak tersedia"}</Text>
              </View>
          </View>
          
          {isEditing && (
            <Text style={styles.editingText}>
               <Ionicons name="create-outline" size={14} color={theme.colors.warning} /> Mode Edit Aktif
            </Text>
          )}
        </View>

        {/* FORM CONTAINER (Card) */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>DATA PRIBADI</Text>
          
          <InputField 
            label="Nama Lengkap" value={name} onChange={setName} 
            editable={isEditing} icon="person-outline"
          />
          <InputField 
            label="NIM / Student ID" value={studentId} onChange={setStudentId} 
            editable={isEditing} keyboardType="numeric" icon="card-outline"
          />
          <InputField 
            label="Bio Singkat" value={bio} onChange={setBio} 
            editable={isEditing} multiline icon="chatbox-ellipses-outline"
          />

          {isEditing && (
            <TouchableOpacity 
                onPress={handleSave} 
                disabled={saving || !name.trim()}
                style={styles.saveButtonContainer}
            >
               <LinearGradient
                  colors={theme.gradients.deepPurple}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButton}
               >
                 {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Simpan Perubahan</Text>}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.footerVersion}>Tugasku App v1.0.0</Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  
  headerNavbar: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 24, paddingVertical: 20, 
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadow.small
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  headerSubtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 2 },
  iconButton: { padding: 8, backgroundColor: theme.colors.background, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border },
  
  content: { paddingHorizontal: 24, paddingBottom: 50 },
  avatarSection: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: theme.colors.primaryLight },
  
  centerInfo: { alignItems: 'center' },
  displayName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  nimBadge: { 
    backgroundColor: theme.colors.primaryLight, 
    paddingHorizontal: 12, paddingVertical: 4, 
    borderRadius: theme.radius.m,
  },
  displayNim: { fontSize: 14, color: theme.colors.primaryDark, fontWeight: '700' },
  editingText: { 
    color: theme.colors.warning, 
    fontWeight: 'bold', 
    fontStyle: 'italic',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  
  formContainer: { 
    backgroundColor: theme.colors.card, 
    borderRadius: theme.radius.xl, 
    padding: 24, 
    ...theme.shadow.medium,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: theme.colors.primaryDark, 
    marginBottom: 20, 
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 8, fontWeight: '600' },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: theme.colors.background, 
    borderRadius: theme.radius.l, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    height: 50,
  },
  textAreaWrapper: { 
    height: 100, 
    alignItems: 'flex-start',
    paddingVertical: 12
  },
  inputWrapperActive: { 
    borderColor: theme.colors.primary, 
    backgroundColor: theme.colors.primaryLight + '20', 
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },
  inputDisabled: { color: theme.colors.textMuted }, 
  textArea: { paddingVertical: 0 },

  saveButtonContainer: {
    marginTop: 15,
    borderRadius: theme.radius.l,
    overflow: 'hidden',
    ...theme.shadow.large,
    shadowColor: theme.colors.primary,
  },
  saveButton: { 
    padding: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footerVersion: { textAlign: 'center', marginTop: 30, color: theme.colors.textMuted, fontSize: 12 }
});