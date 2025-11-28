import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Example: Replace with a real API call to your backend
    const mockData = [
      { id: "1", title: "Room 101 reserved successfully", time: "2 mins ago" },
      { id: "2", title: "Request approved", time: "10 mins ago" },
      { id: "3", title: "New message from admin", time: "1 hour ago" },
    ];
    setNotifications(mockData);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setNotifications([])}
      >
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  notificationTitle: {
    color: "#fff",
    fontSize: 16,
  },
  notificationTime: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 50,
  },
  clearButton: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});