import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import theme from "../constants/theme"; // Import theme

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false, // Hilangkan garis di bawah header
          headerTitleStyle: { fontWeight: '700', color: theme.colors.text },
          headerTitleAlign: 'center',
          headerTintColor: theme.colors.primary
        }}
      >
        {/* Tab Utama */}
        <Stack.Screen name="Main" component={BottomTabs} />
        
        {/* Halaman Stack (Detail & Form) */}
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen} 
          options={{ headerShown: true, title: "Detail Tugas" }} 
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen} 
          options={{ headerShown: true, title: "Tugas Baru" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}