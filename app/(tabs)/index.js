import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoom } from "../../hook/useRoom.js";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native"; // ✅ Removed Bell icon import
import RoomDetailsModal from "../../components/roomDetailsModal.js";

export default function Dashboard({ navigation }) {
  const { getRooms, rooms, loading, error } = useRoom();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

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

  const handleRoomPress = (room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRoom(null);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomnum
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "All" || (filter !== "All" && room.bldg === filter);
    return matchesSearch && matchesFilter;
  });

  const totalRooms = rooms.length;

  // Get unique buildings for filter buttons
  const buildings = ["All", ...new Set(rooms.map((room) => room.bldg))];

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 mt-9">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View className="px-6 pt-9 pb-6">
        <View className="flex-row items-center justify-between mb-6">
          {/* Profile Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center"
            onPress={() => router.push("/profile")}
          >
            <User size={28} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-white text-xl font-semibold">Dashboard</Text>

          {/* Placeholder to keep spacing, replaced Bell with spacer */}
          <View className="w-14 h-14" />
        </View>

        {/* Stats Card */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6 border border-blue-500">
          <View className="flex-row items-center justify-between mx-5 pr-14">
            <View className="items-center grow-4">
              <Ionicons name="stats-chart" size={40} color="#fff" />
              <Text className="text-green-500 text-xl font-semibold mt-2">
                Total Rooms
              </Text>
            </View>
            <Text className="text-white text-6xl font-bold">{totalRooms}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-800 rounded-xl px-4 py-2 flex-row items-center mb-4">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-gray-400 text-base"
            placeholder="Search by room..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <View className="flex-row gap-3">
            {buildings.map((building) => (
              <TouchableOpacity
                key={building}
                onPress={() => setFilter(building)}
                className={`px-6 py-2.5 rounded-full ${
                  filter === building ? "bg-white" : "bg-gray-800"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    filter === building ? "text-[#1a1a1a]" : "text-gray-400"
                  }`}
                >
                  {building}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Room List */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredRooms.length === 0 ? (
          <View className="py-10 items-center">
            <Ionicons name="alert-circle-outline" size={64} color="#4b5563" />
            <Text className="text-gray-500 text-base mt-4">No rooms found</Text>
          </View>
        ) : (
          filteredRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              className="bg-gray-800 rounded-2xl p-5 mb-4 border border-blue-500"
              onPress={() => handleRoomPress(room)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-white text-xl font-bold">
                  {room.roomnum}
                </Text>
                <Text className="text-green-500 text-base font-semibold">
                  {room.bldg + " BLDG"}
                </Text>
              </View>

              <Text className="text-gray-500 text-sm mb-1">
                Capacity: {room.capacity}
              </Text>
              <Text className="text-gray-500 text-sm">
                {room.floornum} Floor
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Room Details Modal */}
      <RoomDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        room={selectedRoom}
      />
    </View>
  );
}