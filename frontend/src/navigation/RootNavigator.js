import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import AddTaskScreen from "../screens/AddTaskScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tab Utama */}
        <Stack.Screen name="Main" component={BottomTabs} />
        
        {/* Halaman Stack (Detail & Form) */}
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen} 
          options={{ headerShown: true, title: "Detail Tugas", headerStyle: { backgroundColor: '#f8f9fc' } }} 
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen} 
          options={{ headerShown: true, title: "Form Tugas", headerStyle: { backgroundColor: '#f8f9fc' } }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}