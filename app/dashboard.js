import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Bell, User } from "lucide-react-native";
import { useRoom } from "../hook/useRoom.js";

export default function Dashboard({ navigation }) {
  const { getRooms, rooms, loading, error } = useRoom();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All"); // 'All' or 'Available'

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const result = await getRooms();
    if (!result.success && result.error) {
      Alert.alert("Error", result.error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  const filteredRooms =
    filter === "All" ? rooms : rooms.filter((room) => room.status === true);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === true).length;

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-5 pt-12 pb-6">
        {/* Top Bar with Icons and Filter */}
        <View className="flex-row items-center justify-between mb-6">
          {/* User Icon */}
          <TouchableOpacity className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center">
            <User size={24} color="#fff" />
          </TouchableOpacity>

          {/* Filter Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setFilter("All")}
              className={`px-8 py-3 rounded-full ${
                filter === "All" ? "bg-white" : "bg-gray-800"
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  filter === "All" ? "text-gray-900" : "text-gray-400"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("Available")}
              className={`px-8 py-3 rounded-full ${
                filter === "Available" ? "bg-white" : "bg-gray-800"
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  filter === "Available" ? "text-gray-900" : "text-gray-400"
                }`}
              >
                Available
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bell Icon */}
          <TouchableOpacity className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center">
            <Bell size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View className="bg-gray-800 rounded-3xl p-6 border-2 border-blue-500 flex-row justify-around">
          <View className="items-center">
            <Text className="text-6xl font-bold text-white">{totalRooms}</Text>
            <Text className="text-gray-400 text-base mt-2">Total Rooms</Text>
          </View>
          <View className="w-px bg-gray-700" />
          <View className="items-center">
            <Text className="text-6xl font-bold text-green-400">
              {availableRooms}
            </Text>
            <Text className="text-green-400 text-base mt-2">Available Now</Text>
          </View>
        </View>
      </View>

      {/* Room List */}
      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
          />
        }
      >
        {filteredRooms.length === 0 ? (
          <View className="py-10 items-center">
            <Text className="text-gray-500 text-base">No rooms found</Text>
          </View>
        ) : (
          filteredRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              className="bg-gray-800 rounded-3xl p-5 mb-4 border-2 border-blue-500"
              onPress={() => navigation.navigate("RoomDetails", { room })}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-white text-xl font-bold">
                  {room.roomnum}
                </Text>
                <View
                  className={`px-4 py-1 rounded-full ${
                    room.status ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <Text className="text-white font-semibold text-sm">
                    {room.status ? "Available" : "Unavailable"}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-400 text-sm mb-1">
                Capacity: {room.capacity}
              </Text>
              <Text className="text-gray-500 text-sm">
                {room.floornum} Floor
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
