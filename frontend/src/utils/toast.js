import { Alert, ToastAndroid, Platform } from "react-native";

export default function showToast(title = "Sukses", message = "") {
  if (Platform.OS === "android") {
 
    ToastAndroid.show(`${title}: ${message}`, ToastAndroid.SHORT);
  } else {
    
    Alert.alert(title, message);
  }
}