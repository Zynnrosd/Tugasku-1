import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen'; // Import Expo Splash

// Navigasi & Screen
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';

// Cegah splash screen bawaan Android hilang otomatis (biar transisi mulus)
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    // Sembunyikan splash screen bawaan HP setelah React siap
    const hideNativeSplash = async () => {
      await ExpoSplashScreen.hideAsync();
    };
    hideNativeSplash();
  }, []);

  const handleSplashFinish = () => {
    setIsShowSplash(false);
  };

  // LOGIKA UTAMA:
  // Jika isShowSplash == true, tampilkan SplashScreen buatan kita.
  // Jika false, tampilkan RootNavigator (Aplikasi Utama).
  if (isShowSplash) {
    return <SplashScreen onComplete={handleSplashFinish} />;
  }

  return (
    <>
      {/* Status Bar dibuat 'light' agar tulisan jam/baterai putih (bagus di header biru) */}
      <StatusBar style="auto" /> 
      <RootNavigator />
    </>
  );
}