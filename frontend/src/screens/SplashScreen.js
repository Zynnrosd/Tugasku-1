import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={theme.gradients.cool}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="school" size={60} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>TugasKu</Text>
        <Text style={styles.subtitle}>Kelola Tugas Kuliah Lebih Mudah</Text>
      </View>
      
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="white" />
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  iconCircle: {
    width: 120, height: 120, backgroundColor: 'white', borderRadius: 60,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10
  },
  title: { fontSize: 40, fontWeight: 'bold', color: 'white', letterSpacing: 2 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
  footer: { position: 'absolute', bottom: 50, alignItems: 'center', gap: 10 },
  version: { color: 'rgba(255,255,255,0.6)', fontSize: 12 }
});