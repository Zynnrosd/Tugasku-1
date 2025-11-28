import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          backgroundColor: 'white',
          height: Platform.OS === 'android' ? 65 : 90,
          paddingBottom: Platform.OS === 'android' ? 10 : 30,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#EDF2F7',
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Tasks') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Courses') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          // Tambahkan efek background circle tipis saat aktif
          return (
            <View style={focused ? styles.activeIconContainer : null}>
               <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }}/>
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tugas' }}/>
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Riwayat' }}/>
      <Tab.Screen name="Courses" component={CoursesScreen} options={{ title: 'Matkul' }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: theme.colors.primary + '15', // Transparan 10%
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  }
});