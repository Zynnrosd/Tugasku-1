import { Alert, ToastAndroid, Platform } from "react-native";

export default function showToast(title = "Sukses", message = "") {
  if (Platform.OS === "android") {
    // Tampilkan Toast pesan singkat di Android
    ToastAndroid.show(`${title}: ${message}`, ToastAndroid.SHORT);
  } else {
    // Fallback untuk iOS (karena iOS tidak punya Toast native)
    Alert.alert(title, message);
  }
}