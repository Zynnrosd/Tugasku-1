import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../constants/theme";

export default function SelectCourseModal({ visible, onClose, onSelect, courses }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <View style={styles.header}>
                <Text style={styles.title}>Pilih Mata Kuliah</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={theme.colors.subtext} />
                </TouchableOpacity>
              </View>

              {courses.length === 0 ? (
                <View style={styles.empty}>
                   <Text style={{color: theme.colors.subtext}}>Belum ada mata kuliah.</Text>
                </View>
              ) : (
                <FlatList
                  data={courses}
                  keyExtractor={(i) => i.id}
                  style={{maxHeight: 300}}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      <Ionicons name="book-outline" size={20} color={theme.colors.primary} style={{marginRight: 10}} />
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: "center", 
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20
  },
  modalBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.l,
    padding: theme.spacing.l,
    ...theme.shadow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 10
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: theme.colors.text 
  },
  item: { 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemText: { 
    fontSize: 16, 
    color: theme.colors.text 
  },
  empty: {
    padding: 20,
    alignItems: 'center'
  }
});