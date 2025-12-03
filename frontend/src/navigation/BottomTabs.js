import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

import theme from '../constants/theme'; 
// Asumsi import screens yang sudah diatur
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import CoursesScreen from '../screens/CoursesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Definisi konfigurasi layar dan ikon
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
        // 1. Menghilangkan header bawaan (kita akan pakai header custom di tiap screen)
        headerShown: false, 
        
        tabBarShowLabel: true,
        // 2. Warna aktif menggunakan tema Ungu baru
        tabBarActiveTintColor: theme.colors.primary, 
        tabBarInactiveTintColor: theme.colors.textMuted,
        
        // 3. Styling bar bottom tabs
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          // Ketinggian yang disesuaikan untuk mengakomodasi padding pada iOS
          height: Platform.OS === 'ios' ? 90 : 60, 
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 5,
          borderTopWidth: 0,
          // Shadow yang konsisten dengan tema card/shadow.medium
          ...styles.tabBarShadow, 
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          // Memberi sedikit ruang antar item untuk tampilan yang lebih lega
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
    tabBarShadow: {
        ...theme.shadow.medium, // Menggunakan shadow medium dari tema
        shadowColor: theme.colors.textMuted, // Warna shadow yang lembut
        position: 'absolute', // Membuat efek 'mengambang' dari bottom tabs
        borderTopWidth: 0,
    }
});