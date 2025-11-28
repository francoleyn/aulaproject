import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useReservation } from "../../hook/useReservation.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "lucide-react-native"; // ✅ Removed Bell import

export default function Request() {
  const router = useRouter();
  const { getReservationsByUserID, deleteReservation, loading } =
    useReservation();
  const [reservations, setReservations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchReservations = async () => {
    if (!user) return;

    const userId = user.id || user.userID;
    const result = await getReservationsByUserID(userId);

    if (result.success) {
      setReservations(result.data);
    } else {
      Alert.alert("Error", result.error || "Failed to load reservations");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const handleDelete = async (reservationId) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const result = await deleteReservation(reservationId);
            if (result.success) {
              Alert.alert("Success", "Reservation cancelled successfully!");
              setModalVisible(false);
              fetchReservations();
            } else {
              Alert.alert(
                "Error",
                result.error || "Failed to cancel reservation"
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const openDetails = (reservation) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-900 mt-9">
      {/* Header */}
      <View className="px-6 pt-9 pb-6 flex-row items-center justify-between">
        <TouchableOpacity
          className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center"
          onPress={() => router.push("/profile")}
        >
          <User size={28} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-semibold">Request</Text>

        {/* Spacer to keep layout centered */}
        <View className="w-14 h-14" />
      </View>

      {/* Reservations List */}
      <ScrollView
        className="flex-1 px-6 pt-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : reservations.length === 0 ? (
          <View className="py-10 items-center">
            <Ionicons name="calendar-outline" size={64} color="#4b5563" />
            <Text className="text-gray-500 text-base mt-4">
              No reservations yet
            </Text>
          </View>
        ) : (
          reservations.map((reservation) => (
            <TouchableOpacity
              key={reservation.id}
              onPress={() => openDetails(reservation)}
              activeOpacity={0.7}
              className="bg-gray-800 rounded-2xl p-5 mb-4 border border-blue-500"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold mb-2">
                    {reservation.roomNum || reservation.roomnum}
                  </Text>
                  <Text className="text-gray-400 text-base">
                    {reservation.bldg + " BLDG"}
                  </Text>
                </View>

                <View className="items-end ">
                  <Text className="text-gray-400 text-sm mb-4">
                    {formatDate(reservation.created_at || reservation.date)}
                  </Text>
                  <View
                    className={`px-4 py-2  rounded-full ${
                      reservation.status === true ||
                      reservation.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <Text className="text-white font-bold text-sm">
                      {reservation.status === true ||
                      reservation.status === "approved"
                        ? "Approved"
                        : "Waiting for approval"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-800 rounded-t-3xl p-6 max-h-[80%]">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-4 right-4 z-10"
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {selectedReservation && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-white text-3xl text-center font-bold mb-6 mt-2">
                  Reservation Details
                </Text>

                <View className="mb-6">
                  <Text className="text-gray-400 text-sm mb-2">Room</Text>
                  <Text className="text-white text-2xl font-bold">
                    {selectedReservation.roomnum}
                  </Text>
                </View>

                <View className="mb-6">
                  <Text className="text-gray-400 text-sm mb-2">Building</Text>
                  <Text className="text-white text-xl">
                    {selectedReservation.bldg}
                  </Text>
                </View>

                <View className="mb-6 flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                  <Text className="text-white text-xl ml-2">
                    {formatDate(selectedReservation.date)}
                  </Text>
                </View>

                <View className="mb-6 flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#3b82f6" />
                  <Text className="text-white text-xl ml-2">
                    {formatTime(selectedReservation.starttime)} -{" "}
                    {formatTime(selectedReservation.endtime)}
                  </Text>
                </View>

                <View className="mb-6 flex-row items-center">
                  <Ionicons
                    name="hourglass-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text className="text-white text-xl ml-2">
                    {selectedReservation.numberofhours}{" "}
                    {selectedReservation.numberofhours === 1 ? "hour" : "hours"}
                  </Text>
                </View>

                <View
                  className={`self-start px-6 py-3 rounded-full mb-8 ${
                    selectedReservation.status === true ||
                    selectedReservation.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  <Text className="text-white font-semibold text-base">
                    {selectedReservation.status === true ||
                    selectedReservation.status === "approved"
                      ? "Approved"
                      : "Waiting for Approval"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(selectedReservation.id)}
                  className="bg-red-500 rounded-2xl py-4 items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-lg">
                    Cancel Reservation
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}