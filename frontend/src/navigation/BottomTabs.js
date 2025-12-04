import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, View, Text, StyleSheet, StatusBar } from 'react-native';
// PERBAIKAN: Gunakan hook untuk mendapatkan insets jika diperlukan, 
// namun di sini kita fokus memperbaiki konfigurasi style BottomTabs
// sehingga insets ditangani oleh React Navigation secara default.

import theme from '../constants/theme'; 
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import CoursesScreen from '../screens/CoursesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const screens = [
  { name: "Home", component: HomeScreen, icon: "home-outline", label: "Beranda" },
  { name: "Tasks", component: TasksScreen, icon: "list-circle-outline", label: "Tugas" },
  { name: "Courses", component: CoursesScreen, icon: "library-outline", label: "Kuliah" },
  { name: "History", component: HistoryScreen, icon: "time-outline", label: "Riwayat" },
  { name: "Profile", component: ProfileScreen, icon: "person-circle-outline", label: "Profil" },
];

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, 
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary, 
        tabBarInactiveTintColor: theme.colors.textMuted,
        
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          // Tinggi dasar Tab Bar adalah ~50pt. 
          // iOS memerlukan tambahan 34pt (Home Indicator)
          // Android mungkin memerlukan tambahan 20-30pt untuk System Navigation Bar
          // Jika kita TIDAK menggunakan position: 'absolute', React Navigation
          // akan menambahkan padding otomatis, kita hanya perlu mengatur height.
          // Menggunakan nilai aman 85 untuk menampung tab bar dan safe area iOS/Android.
          height: Platform.OS === 'ios' ? 90 : 80, // Ditingkatkan ke 80/90 untuk ruang aman
          
          // Memaksa padding bawah untuk Android dan iOS agar pasti tidak tertutup.
          // Nilai paddingBottom ini menggantikan safe area inset yang seharusnya dihitung
          paddingBottom: Platform.OS === 'ios' ? 25 : 15, // Padding bawah iOS ~25, Android ~15
          paddingTop: 5,
          borderTopWidth: 0,
          
          // Mengambil bayangan, tetapi MENGHAPUS position: 'absolute'
          // Catatan: Jika ingin bayangan, tambahkan gaya bayangan di sini secara manual,
          // dan jangan gunakan position: 'absolute'. Kita ubah style di bawah.
          ...styles.tabBarStyling,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          marginHorizontal: 5, 
        }
      }}
    >
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            title: screen.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={screen.icon} color={color} size={size + 2} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  // PERBAIKAN: Mengganti tabBarShadow menjadi tabBarStyling
  // dan menghilangkan 'position: absolute'
  tabBarStyling: {
    ...theme.shadow.medium,
    shadowColor: theme.colors.textMuted, 
    // HAPUS: position: 'absolute', 
    borderTopWidth: 0,
  }
});