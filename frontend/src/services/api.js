import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// =================================================================
// 1. KONFIGURASI URL
// =================================================================
// PERBAIKAN 1: URL Vercel harus menyertakan '/api' agar cocok dengan routing backend.
const VERCEL_URL = "https://tugasku-1.vercel.app/api"; 
const LOCAL_URL = "http://192.168.1.4:5000/api"; 

// Logika: Jika mode development, pakai LOCAL. Jika build (APK), pakai VERCEL.
const BASE_URL = __DEV__ ? LOCAL_URL : VERCEL_URL;

// =================================================================
// 2. SETUP DEVICE ID DENGAN PROMISE CACHING
// =================================================================
let deviceIdPromise = null;

const getDeviceId = () => {
  if (deviceIdPromise) return deviceIdPromise;

  deviceIdPromise = (async () => {
    let id = 'unknown-device'; // Default fallback jika ID tidak bisa diambil
    try {
      if (Platform.OS === 'android') {
        const androidId = Application.androidId;
        // PERBAIKAN 2: Gunakan ID Android jika ada, jika tidak, gunakan fallback.
        id = androidId || id; 
      } else if (Platform.OS === 'ios') {
        const iosId = await Application.getIosIdForVendorAsync();
        // Gunakan ID iOS jika ada, jika tidak, gunakan fallback.
        id = iosId || id;
      }
      console.log(`[API] Device ID Ready: ${id}`);
    } catch (error) {
      console.error("Gagal mengambil Device ID:", error);
    }
    // Pastikan return value selalu string untuk header
    return id; 
  })();

  return deviceIdPromise;
};

// =================================================================
// 3. AXIOS INSTANCE
// =================================================================
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor: MENUNGGU device ID siap sebelum request jalan
api.interceptors.request.use(async (config) => {
  const deviceId = await getDeviceId(); 
  
  // Header terjamin terpasang (dengan ID valid atau 'unknown-device')
  if (deviceId) {
    config.headers['device-id'] = deviceId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;