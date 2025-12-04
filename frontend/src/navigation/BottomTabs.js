import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, View, Text, StyleSheet, StatusBar } from 'react-native';


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
         
          height: Platform.OS === 'ios' ? 90 : 80,
          
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          paddingTop: 5,
          borderTopWidth: 0,
          
          
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
  
  tabBarStyling: {
    ...theme.shadow.medium,
    shadowColor: theme.colors.textMuted,  
    borderTopWidth: 0,
  }
});