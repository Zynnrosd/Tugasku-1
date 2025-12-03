import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// =================================================================
// 1. KONFIGURASI URL
// =================================================================
// SOLUSI: Tambahkan '/api' ke VERCEL_URL agar konsisten dengan LOCAL_URL dan routing backend
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
    let id = 'unknown-device'; // <-- Default fallback
    try {
      if (Platform.OS === 'android') {
        const androidId = Application.androidId;
        id = androidId || id; // Pastikan menggunakan fallback jika Application.androidId gagal
      } else if (Platform.OS === 'ios') {
        const iosId = await Application.getIosIdForVendorAsync();
        id = iosId || id;
      }
      console.log(`[API] Device ID Ready: ${id}`);
    } catch (error) {
      console.error("Gagal mengambil Device ID:", error);
    }
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
  const deviceId = await getDeviceId(); // Await di sini kuncinya
  
  if (deviceId) {
    config.headers['device-id'] = deviceId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;