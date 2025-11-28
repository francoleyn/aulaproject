import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useReservation } from "../../hook/useReservation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getApprovedReservations, loading } = useReservation();

  useEffect(() => {
    loadUserData();
  }, []);

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchApprovedReservations();
      }
    }, [user])
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Fetch notifications after getting user
        fetchApprovedReservationsForUser(parsedUser.id || parsedUser.userID);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchApprovedReservations = async () => {
    if (!user) return;
    await fetchApprovedReservationsForUser(user.id || user.userID);
  };

  const fetchApprovedReservationsForUser = async (userId) => {
    try {
      const result = await getApprovedReservations(userId);
      if (result.success) {
        // Transform reservations into notification format
        const notificationList = result.data.map((reservation) => ({
          id: reservation.id.toString(),
          title: `Reservation Approved!`,
          message: `Your reservation for Room ${reservation.roomnum} (${reservation.bldg}) has been approved.`,
          date: reservation.date,
          starttime: reservation.starttime,
          endtime: reservation.endtime,
          time: formatTimeAgo(reservation.created_at),
          type: "approved",
        }));
        setNotifications(notificationList);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApprovedReservations();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-gray-800 rounded-2xl p-4 mb-3 border-l-4 border-green-500">
      <View className="flex-row items-start">
        <View className="bg-green-500/20 rounded-full p-2 mr-3">
          <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-semibold mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-400 text-sm mb-2">{item.message}</Text>
          <View className="flex-row items-center mb-1">
            <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
            <Text className="text-gray-500 text-xs ml-1">{item.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text className="text-gray-500 text-xs ml-1">
              {item.starttime} - {item.endtime}
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-gray-600 text-xs text-right mt-2">{item.time}</Text>
    </View>
  );

  if (loading && notifications.length === 0) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 pt-12">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">Notifications</Text>
        <Text className="text-gray-500 text-sm mt-1">
          Your approved reservations
        </Text>
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="notifications-off-outline" size={64} color="#4b5563" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            No notifications yet
          </Text>
          <Text className="text-gray-600 text-sm mt-2 text-center">
            When your reservations get approved, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}