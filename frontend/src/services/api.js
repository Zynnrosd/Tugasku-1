import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// 1. KONFIGURASI URL
const VERCEL_URL = "https://tugasku-1-rr6y.vercel.app/api"; 

const BASE_URL = VERCEL_URL;

// 2. SETUP DEVICE ID DENGAN PROMISE CACHING
let deviceIdPromise = null;

const getDeviceId = () => {
  if (deviceIdPromise) return deviceIdPromise;

  deviceIdPromise = (async () => {
    let id = 'unknown-device';
    try {
      if (Platform.OS === 'android') {
        const androidId = Application.androidId;
        // PERBAIKAN 2: Jika ID unik undefined, gunakan fallback 'unknown-device' 
        id = androidId || id; 
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

// 3. AXIOS INSTANCE
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor: MENUNGGU device ID siap sebelum request jalan
api.interceptors.request.use(async (config) => {
  const deviceId = await getDeviceId(); 
  
  if (deviceId) {
    config.headers['device-id'] = deviceId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;