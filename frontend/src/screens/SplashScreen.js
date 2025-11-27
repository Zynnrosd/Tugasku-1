import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../constants/theme'; // Pastikan path theme benar

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    // Timer untuk simulasi loading (2 detik)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Ganti URL ini dengan logo kampus atau aplikasimu jika ada */}
        <Image 
          source={{ uri: "https://img.icons8.com/fluency/240/todo-list.png" }} 
          style={styles.logo} 
        />
        
        <Text style={styles.title}>Tugasku</Text>
        <Text style={styles.subtitle}>Manajemen Tugas Kuliah</Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={styles.version}>Versi 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // Menggunakan warna biru utama
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    marginBottom: 50,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: -150, // Geser ke bawah
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
  }
});