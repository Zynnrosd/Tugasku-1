import React, { useState } from 'react';
// Hapus import StatusBar dari 'react-native'
// import { StatusBar } from 'react-native'; 

// Gunakan StatusBar dari Expo agar lebih kompatibel
import { StatusBar } from 'expo-status-bar'; 
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      {/* style="auto" atau "dark" menyesuaikan warna ikon (jam, baterai).
        backgroundColor="transparent" agar gradasi header terlihat penuh.
        translucent={true} agar aplikasi digambar di belakang status bar (Android).
      */}
      <StatusBar style="auto" backgroundColor="transparent" translucent={true} />
      <RootNavigator />
    </>
  );
}