import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useReservation } from "../../hook/useReservation.js";
import { useRoom } from "../../hook/useRoom.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Bell, User } from "lucide-react-native";

export default function Reservation() {
  const router = useRouter();
  const { createReservation, loading } = useReservation();
  const { getRooms, rooms } = useRoom();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
    getRooms();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateHours = () => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.abs(Math.round(diff / (1000 * 60 * 60)));
  };

  const handleConfirm = async () => {
    if (!selectedRoom) {
      Alert.alert("Error", "Please select a room");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found. Please login again.");
      return;
    }

    const numberOfHours = calculateHours();
    if (numberOfHours <= 0) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    const reservationData = {
      userID: user.id || user.userID,
      roomID: selectedRoom.id,
      roomNum: selectedRoom.roomnum,
      bldg: selectedRoom.bldg,
      date: selectedDate.toISOString().split("T")[0],
      startTime: startTime.toTimeString().split(" ")[0],
      endTime: endTime.toTimeString().split(" ")[0],
      numberOfHours: numberOfHours,
      status: false, // Pending approval
    };

    const result = await createReservation(reservationData);

    if (result.success) {
      Alert.alert("Success", "Reservation request submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setSelectedRoom(null);
            setSelectedDate(new Date());
            setStartTime(new Date());
            setEndTime(new Date());
            router.push("/request");
          },
        },
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to create reservation");
    }
  };

  return (
    <View className="flex-1 bg-gray-900 mt-9">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View className="px-6 pt-9 pb-6 flex-row items-center justify-between">
        <TouchableOpacity
          className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center"
          onPress={() => router.push("/profile")}
        >
          <User size={28} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-semibold">Reservation</Text>

        <TouchableOpacity className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center">
          <Bell size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Choose Room Dropdown */}
        <Text className="text-white text-base font-medium mb-3">
          Choose Room
        </Text>
        <TouchableOpacity
          onPress={() => setShowRoomPicker(!showRoomPicker)}
          className="bg-gray-800  rounded-xl p-4 mb-6 flex-row justify-between items-center"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="location-outline"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 10 }}
            />
            <Text className="text-gray-400 text-sm">
              {selectedRoom
                ? `${selectedRoom.roomnum} - ${selectedRoom.bldg}`
                : "Select from available rooms"}
            </Text>
          </View>
          <Ionicons
            name={showRoomPicker ? "chevron-up" : "chevron-down"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>

        {/* Room Picker */}
        {showRoomPicker && (
          <View className="bg-gray-800 rounded-xl mb-6 max-h-48">
            <ScrollView>
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  onPress={() => {
                    setSelectedRoom(room);
                    setShowRoomPicker(false);
                  }}
                  className="p-4 border-b border-gray-700"
                >
                  <Text className="text-white font-semibold mb-1">
                    {room.roomnum}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {room.bldg} - Floor {room.floornum} - Capacity:{" "}
                    {room.capacity}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Choose Date */}
        <Text className="text-white text-base font-medium mb-3">
          Choose Date
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-gray-800  rounded-xl p-4 mb-6 flex-row justify-between items-center"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 10 }}
            />
            <Text className="text-gray-400 text-sm">
              {formatDate(selectedDate)}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDateValue) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDateValue) {
                setSelectedDate(selectedDateValue);
              }
            }}
          />
        )}

        {/* Start Time */}
        <Text className="text-white text-base font-medium mb-3">
          Start Time
        </Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="bg-gray-800  rounded-xl p-4 mb-6 flex-row justify-between items-center"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="time-outline"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 10 }}
            />
            <Text className="text-gray-400 text-sm">
              {formatTime(startTime)}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartPicker(Platform.OS === "ios");
              if (selectedTime) {
                setStartTime(selectedTime);
              }
            }}
          />
        )}

        {/* End Time */}
        <Text className="text-white text-base font-medium mb-3">End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="bg-gray-800  rounded-xl p-4 mb-6 flex-row justify-between items-center"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="time-outline"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 10 }}
            />
            <Text className="text-gray-400 text-sm">{formatTime(endTime)}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndPicker(Platform.OS === "ios");
              if (selectedTime) {
                setEndTime(selectedTime);
              }
            }}
          />
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          className="bg-blue-500 rounded-2xl p-4 mb-8 items-center mt-8"
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Confirm</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
