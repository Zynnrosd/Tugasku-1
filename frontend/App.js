import React, { useState } from 'react';

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
      {/* menyesuaikan warna ikon */}
      <StatusBar style="auto" backgroundColor="transparent" translucent={true} />
      <RootNavigator />
    </>
  );
}