import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import theme from "../constants/theme";
import api from "../services/api"; 

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/tasks");
      const allTasks = res.data.data || [];
      const doneTasks = allTasks.filter(t => t.status === 'Done' || t.status === 'Completed');
      setHistory(doneTasks);
    } catch (err) {} finally { setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { loadHistory(); }, []));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
       <View style={styles.statusLine} />
       <View style={styles.content}>
           <Text style={styles.title}>{item.title}</Text>
           <View style={styles.row}>
               <Ionicons name="book" size={14} color={theme.colors.subtext} />
               <Text style={styles.info}> {item.courses?.name || 'Umum'}</Text>
           </View>
           <View style={styles.row}>
               <Ionicons name="calendar" size={14} color={theme.colors.subtext} />
               <Text style={styles.info}> Deadline: {item.deadline}</Text>
           </View>
       </View>
       <View style={styles.badge}>
           <Text style={styles.badgeText}>SELESAI</Text>
       </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={theme.text.header}>Riwayat</Text>
        <Text style={theme.text.subtitle}>Total {history.length} tugas terselesaikan.</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadHistory} />}
        ListEmptyComponent={
            <View style={styles.empty}>
                 <Ionicons name="file-tray-outline" size={60} color={theme.colors.subtext} />
                 <Text style={{color: theme.colors.subtext, marginTop: 10}}>Belum ada riwayat.</Text>
            </View>
         }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20 },
  card: {
      backgroundColor: 'white', borderRadius: 12, marginBottom: 12,
      flexDirection: 'row', alignItems: 'center', overflow: 'hidden', ...theme.shadow
  },
  statusLine: { width: 6, height: '100%', backgroundColor: theme.colors.success },
  content: { flex: 1, padding: 15 },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6, textDecorationLine: 'line-through', opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  info: { fontSize: 12, color: theme.colors.subtext },
  badge: { backgroundColor: '#ECFDF5', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginRight: 15 },
  badgeText: { color: theme.colors.success, fontSize: 10, fontWeight: 'bold' },
  empty: { alignItems:'center', marginTop: 100 }
});