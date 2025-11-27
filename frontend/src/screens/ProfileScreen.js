import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import theme from "../constants/theme";
import api from "../services/api"; 

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", student_id: "", major: "", bio: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profiles");
      if (res.data && res.data.data && res.data.data.length > 0) {
        const data = res.data.data[0];
        setProfile(data);
        setForm(data);
      }
    } catch (error) {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
        if (profile?.id) {
            await api.put("/profiles", { ...form, id: profile.id });
        } else {
            await api.post("/profiles", form);
        }
        setProfile(form);
        setIsEditing(false);
        Alert.alert("Sukses", "Data tersimpan!");
    } catch (error) {
        Alert.alert("Gagal", "Gagal menyimpan.");
    }
  };

  if (loading) return <ActivityIndicator style={{marginTop:50}} color={theme.colors.primary} />;

  const display = profile || { name: "User", student_id: "-", major: "-", bio: "-" };

  return (
    <View style={styles.container}>
        {/* Header Biru Simple */}
        <View style={styles.headerBg}>
             <SafeAreaView edges={['top']}>
                <View style={styles.headerRow}>
                    <Text style={styles.pageTitle}>Profil Saya</Text>
                    <TouchableOpacity 
                        style={styles.editBtn} 
                        onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                        <Ionicons name={isEditing ? "save" : "create-outline"} size={20} color="white" />
                        <Text style={styles.editBtnText}>{isEditing ? "SIMPAN" : "EDIT"}</Text>
                    </TouchableOpacity>
                </View>
             </SafeAreaView>
        </View>

        <ScrollView contentContainerStyle={{paddingBottom: 50}}>
            {/* Kartu Profil Utama */}
            <View style={styles.card}>
                <View style={styles.avatarCenter}>
                     <Image source={{ uri: `https://ui-avatars.com/api/?name=${form.name}&background=random&size=128` }} style={styles.avatar} />
                </View>

                {/* NAMA & NIM */}
                <View style={{marginTop: 16, width: '100%'}}>
                    <Text style={styles.labelInput}>NAMA LENGKAP</Text>
                    {isEditing ? (
                        <TextInput style={styles.inputBox} value={form.name} onChangeText={t=>setForm({...form, name:t})} placeholder="Nama Lengkap" />
                    ) : (
                        <Text style={styles.textValue}>{display.name}</Text>
                    )}
                    
                    <Text style={[styles.labelInput, {marginTop:12}]}>NIM</Text>
                    {isEditing ? (
                        <TextInput style={styles.inputBox} value={form.student_id} onChangeText={t=>setForm({...form, student_id:t})} placeholder="NIM" keyboardType="numeric" />
                    ) : (
                        <Text style={styles.textValue}>{display.student_id}</Text>
                    )}
                </View>
            </View>

            {/* Kartu Detail Info */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>INFORMASI AKADEMIK</Text>
                
                <Text style={styles.labelInput}>PROGRAM STUDI</Text>
                {isEditing ? (
                    <TextInput style={styles.inputBox} value={form.major} onChangeText={t=>setForm({...form, major:t})} placeholder="Jurusan" />
                ) : (
                    <Text style={styles.textValue}>{display.major || "-"}</Text>
                )}

                <Text style={[styles.labelInput, {marginTop: 16}]}>BIO</Text>
                {isEditing ? (
                    <TextInput style={[styles.inputBox, {height:80, textAlignVertical:'top'}]} multiline value={form.bio} onChangeText={t=>setForm({...form, bio:t})} placeholder="Tulis bio singkat..." />
                ) : (
                    <Text style={styles.textValue}>{display.bio || "-"}</Text>
                )}
            </View>
            
            <Text style={styles.versionText}>Tugasku App v1.0</Text>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.secondary },
  headerBg: { backgroundColor: theme.colors.primary, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  editBtn: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, paddingHorizontal: 16, borderRadius: 20, alignItems:'center' },
  editBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 6, fontSize: 12 },

  card: { backgroundColor: 'white', marginHorizontal: 24, marginTop: 20, borderRadius: 16, padding: 20, ...theme.shadow },
  avatarCenter: { alignItems: 'center', marginTop: -50 }, // Avatar keluar dikit dari card (efek floating)
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: 'white' },
  
  labelInput: { fontSize: 11, color: theme.colors.subtext, fontWeight: 'bold', marginBottom: 6 },
  textValue: { fontSize: 16, color: theme.colors.text, fontWeight: '500', marginBottom: 4 },
  
  // Style Input Kotak Jelas
  inputBox: { 
      borderWidth: 1, borderColor: theme.colors.border, 
      borderRadius: 10, padding: 12, 
      fontSize: 16, color: theme.colors.text,
      backgroundColor: '#F8FAFC'
  },
  
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 16, letterSpacing: 1 },
  versionText: { textAlign:'center', color: theme.colors.subtext, marginTop: 20, fontSize: 12 }
});